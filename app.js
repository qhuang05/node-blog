const express = require('express')			//加载express模块,创建app应用
const mongoose = require('mongoose')		//加载数据库模块
const swig = require('swig')				//加载模板处理模块
const bodyParser = require('body-parser')	//用来处理post提交过来的数据
const Cookies = require('cookies')			//加载cookie模块
const User = require('./models/User')

var app = express()							//创建app应用，相当于nodejs中的http.createServer()
app.engine('html',swig.renderFile)			//配置应用模板。参数1：模板引擎的名称，同时也是模板文件的后缀。参数2：用于解析处理模板内容的方法
app.set('views', './views')					//设置模板文件存放的目录。参数1：必须是views。参数2：目录
app.set('view engine', 'html')				//注册所使用的模板引擎。参数1：必须是view engine。参数2：与app.engine中的第1个参数相同
swig.setDefaults({
	cache: false 	//取消模板缓存
})

// 设置post提交过来的数据
app.use(bodyParser.urlencoded({
	extended: true
}))

// 设置cookie
app.use(function(req, res, next){
	req.cookies = new Cookies(req, res);
	if(req.cookies.get('userInfo')){
		try{
			//将cookie信息存储到req自定义字段userInfo,渲染给页面模板使用
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));	
			// 判断是否为管理员账户
			/*User.findById(req.userInfo.id).then(function(data){
				req.userInfo.isAdmin = Boolean(data.isAdmin);
			});*/
		}catch(error){
			console.log(error)
		}
	}
	next();
})

// 静态文件托管(请求css,js,images等),当用户访问的url以/public开始，那么直接返回对应的__dirname+'/public'下的文件
app.use('/public', express.static(__dirname + '/public'))

// 根据不同功能划分模块
app.use('/', require('./routers/main'))
app.use('/api', require('./routers/api'))
app.use('/admin', require('./routers/admin'))

// 数据库连接
mongoose.connect('mongodb://localhost:27017/node-blog', function(err){
	if(err){
		console.log('数据库连接失败！')	
	} else{
		console.log('数据库连接成功！')
		app.listen(9900)
	}
});

// 启动mongodb数据库：
// cd C:\Program Files\MongoDB\Server\3.6\bin
// mongod --dbpath D:\xampp\htdocs\Projects\node-blog\db --port 27017
