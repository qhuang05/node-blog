const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Category = require('../models/Category')
const Content = require('../models/Content')

router.get(['/', '/index'], function(req,res,next){
	// 解决中文字符无法存入cookie问题
	if(req.userInfo){
		req.userInfo.username = new Buffer(req.userInfo.username, 'base64').toString();
	}
	// res.render第2个参数表示分配给模板使用的数据
	var perPage = 2,
	curPage = req.query.page ? Number(req.query.page) : 1,
	total = 0,
	totalPage = 0,
	startIndex = 0;
	Category.find().then(function(categories){
		Content.count().then(function(data){
			total = data,
			totalPage = Math.ceil(total/perPage);
			curPage = Math.max(curPage, 1);
			curPage = Math.min(curPage, totalPage);
			startIndex = (curPage-1)*perPage;
			Content.find().sort({_id:-1}).limit(perPage).skip(startIndex).populate('category').then(function(data){
				res.render('index', {
					userInfo: req.userInfo,
					categories: categories,
					contentList: data,
					total: total,
					totalPage: totalPage,
					page: curPage,
					perPage: perPage
				})
			})
		})
	})
	
})

module.exports = router