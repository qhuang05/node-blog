const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Category = require('../models/Category')
const Content = require('../models/Content')

router.use(function(req,res,next){
	req.userInfo.username = new Buffer(req.userInfo.username, 'base64').toString();
	if(!req.userInfo.isAdmin){
		res.send('<h1 style="text-align:center;margin-top:20px;">对不起，只有管理员可以登录！</h1>');
	}
	next();
})

// 用户管理首页
router.get('/index', function(req,res,next){
	if(req.userInfo.isAdmin){
		res.render('admin/index', {
			title: '管理首页',
			userInfo: req.userInfo
		})
	}
})

// 用户列表页面
router.get('/user', function(req,res,next){
	if(req.userInfo.isAdmin){
		var perPage = 3,
		curPage = req.query.page ? Number(req.query.page) : 1,
		total = 0,
		totalPage = 0,
		startIndex = 0;
		User.count().then(function(data){
			total = data,
			totalPage = Math.ceil(total/perPage);
			curPage = Math.max(curPage, 1);
			curPage = Math.min(curPage, totalPage);
			startIndex = (curPage-1)*perPage;
			User.find().limit(perPage).skip(startIndex).then(function(data){
				res.render('admin/user', {
					userInfo: req.userInfo,
					userList: data,
					total: total,
					totalPage: totalPage,
					page: curPage,
					perPage: perPage
				})
			})
		})
	}
})

// 删除用户
router.post('/user/delete', function(req,res,next){
	var id = req.body.id;
	User.remove({
		_id: id
	}).then(function(data){
		res.json({
			code: 0,
			message: '删除成功'
		})
	})
})

// 分类管理列表页面
router.get('/category', function(req, res, next){
	var perPage = 3,
	curPage = req.query.page ? Number(req.query.page) : 1,
	total = 0,
	totalPage = 0,
	startIndex = 0;
	Category.count().then(function(data){
		total = data,
		totalPage = Math.ceil(total/perPage);
		curPage = Math.max(curPage, 1);
		curPage = Math.min(curPage, totalPage);
		startIndex = (curPage-1)*perPage;
		Category.find().sort({_id:-1}).limit(perPage).skip(startIndex).then(function(data){
			res.render('admin/category', {
				userInfo: req.userInfo,
				categoryList: data,
				total: total,
				totalPage: totalPage,
				page: curPage,
				perPage: perPage
			})
		})
	})
})

// 分类管理添加页面
router.get('/category_add', function(req, res, next){
	res.render('admin/category_add', {
		userInfo: req.userInfo
	})
})
// 添加分类
router.post('/category/add', function(req, res){
	var name = req.body.name;
	if(name == ''){
		res.render('admin/category_add', {
			userInfo: req.userInfo,
			message: '信息填写不完整'
		});
	} else{
		Category.findOne({
			name: req.body.name
		}).then(function(category){
			if(category){
				res.render('admin/category_add', {
					userInfo: req.userInfo,
					message: '分类名已存在'
				});
			} else{
				return new Category({
					name: req.body.name
				}).save()
			}
		}).then(function(category){
			if(category){
				res.render('admin/category_add', {
					userInfo: req.userInfo,
					message: '添加成功'
				})
			}
		})
	}
})
// 编辑分类页面
router.get('/category_edit', function(req, res){
	var id = req.query.id || '';
	Category.findOne({
		_id: id
	}).then(function(data){
		res.render('admin/category_edit', {
			userInfo: req.userInfo,
			category: data
		})
	})
})
// 编辑分类
router.post('/category/edit', function(req, res){
	var id = req.query.id || '',
	newName = req.body.name;
	// 判断新的修改数据在数据库中是否已存在
	Category.findOne({
		_id: {$ne: id},
		name: newName
	}).then(function(data){
		if(data){	//如果存在
			Category.findOne({
				_id: id
			}).then(function(data){
				res.render('admin/category_edit', {
					userInfo: req.userInfo,
					message: '数据库中已存在同名分类',
					category: data
				});
			})
		} else{	//如果不存在则更新
			return Category.update({
				_id: id
			},{
				name: newName
			}).then(function(data){
				if(data){
					res.json({
						code: 1,
						message: '修改成功'
					})
				}
			})
		}
	})
})

// 删除分类
router.post('/category/delete', function(req, res){
	var id = req.body.id;
	Category.remove({
		_id: id
	}).then(function(data){
		res.json({
			code: 0,
			message: '删除成功'
		})
	})
})

// 内容管理列表页面
router.get('/content', function(req, res, next){
	var perPage = 3,
	curPage = req.query.page ? Number(req.query.page) : 1,
	total = 0,
	totalPage = 0,
	startIndex = 0;
	Content.count().then(function(data){
		total = data,
		totalPage = Math.ceil(total/perPage);
		curPage = Math.max(curPage, 1);
		curPage = Math.min(curPage, totalPage);
		startIndex = (curPage-1)*perPage;
		Content.find().sort({_id:-1}).limit(perPage).skip(startIndex).populate('category').then(function(data){
			res.render('admin/content', {
				userInfo: req.userInfo,
				contentList: data,
				total: total,
				totalPage: totalPage,
				page: curPage,
				perPage: perPage
			})
		})
	})
})

// 添加内容页面
router.get('/content_add', function(req, res, next){
	Category.find().sort({_id: -1}).then(function(data){
		res.render('admin/content_add', {
			userInfo: req.userInfo,
			categories: data
		})
	})
})

// 添加内容
router.post('/content/add', function(req, res){
	var data = req.body;
	if(data.category == '' || data.title == '' || data.description == '' || data.content == ''){
		Category.find().sort({_id: -1}).then(function(data){
			res.render('admin/content_add', {
				userInfo: req.userInfo,
				categories: data,
				code: 0,
				message: '信息填写不完整'
			})
		})
	} else{
		// 保存数据
		new Content({
			category: data.category,
			title: data.title,
			description: data.description,
			content: data.content
		}).save().then(function(data){
			Category.find().sort({_id: -1}).then(function(data){
				res.render('admin/content_add', {
					userInfo: req.userInfo,
					categories: data,
					code: 1,
					message: '添加成功'
				});
			})
		});
	}
});
// 编辑内容页面
router.get('/content_edit', function(req, res){
	var id = req.query.id || '';
	// 获取内容详情
	Category.find().then(function(categories){
		Content.findOne({
			_id: id
		}).populate('category').then(function(data){
			res.render('admin/content_edit', {
				userInfo: req.userInfo,
				content: data,
				categories:categories
			})
		})
	})
})

// 编辑内容保存
router.post('/content/edit', function(req, res){
	var id = req.query.id || '';
	var data = req.body;
	if(data.category == '' || data.title == '' || data.description == '' || data.content == ''){
		Category.find().sort({_id: -1}).then(function(categories){
			Content.findOne({
				_id: id
			}).populate('category').then(function(data){
				res.render('admin/content_edit', {
					userInfo: req.userInfo,
					categories: categories,
					content: data,
					code: 0,
					message: '信息填写不完整'
				})
			})
		})
	} else{
		// 保存数据
		Content.update({
			_id: id
		},{
			category: data.category,
			title: data.title,
			description: data.description,
			content: data.content
		}).then(function(data){
			res.json({
				code: 1,
				message: '修改成功'
			})
		})
	}
})

// 内容删除
router.post('/content/delete', function(req, res){
	var id = req.body.id;
	Content.remove({
		_id: id
	}).then(function(data){
		res.json({
			code: 0,
			message: '删除成功'
		})
	})
})
module.exports = router