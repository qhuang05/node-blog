const express = require('express')
const router = express.Router()
const User = require('../models/User')	//返回的是一个构造函数

// 统一返回格式
let responseData;
router.use(function(req,res,next){
	responseData = {
		code: 1,
		message: 'success'
	}
	next();	
})

// 注册
router.post('/user/register', function(req,res,next){
	// console.log(req.body);
	var username = req.body.username,
		password = req.body.password,
		repassword = req.body.repassword;
	if(username == ''){
		responseData.code = 0;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return;
	}
	if(password == ''){
		responseData.code = 0;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}
	if(password != repassword ){
		responseData.code = 0;
		responseData.message = '密码不一致';
		res.json(responseData);
		return;
	}
	// 判断用户名是否已注册(查找数据库，不存在则新增)
	User.findOne({
		username: username
	}).then(function(userInfo){
		if(userInfo){
			responseData.code = 0;
			responseData.message = '用户已被注册';
			res.json(responseData);
			return;
		}
		var user = new User({
			username: username,
			password: password
		});
		return user.save();
	}).then(function(newUserInfo){
		// console.log(newUserInfo);
		if(newUserInfo){
			responseData.message = '注册成功'
			res.json(responseData);
		}
	})
})

// 登录
router.post('/user/login', function(req, res){
	var username = req.body.username,
		password = req.body.password;
	User.findOne({
		username: username,
		password: password
	}).then(function(data){
		if(!data){
			responseData.code = 0;
			responseData.message = '用户名或密码错误';
			res.json(responseData);
		} else{
			var userInfo = {
				id: data._id,
				username: new Buffer(data.username).toString('base64'),
				isAdmin: data.isAdmin
			}
			responseData.data = userInfo;
			// 登录成功后，服务器发送cookie给客户端
			req.cookies.set('userInfo', JSON.stringify(userInfo));
			res.json(responseData);
		}
	})
})

// 退出
router.get('/user/logout', function(req, res){
	req.cookies.set('userInfo', null);
	responseData.message = '退出';
	res.json(responseData);
})

module.exports = router