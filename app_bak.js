var express = require('express')	//加载express模块,创建app应用
var swig = require('swig')			//加载模板处理模块

var app = express()					//创建app应用，相当于nodejs中的http.createServer()
app.listen(9900)

app.engine('html',swig.renderFile)			//配置应用模板。参数1：模板引擎的名称，同时也是模板文件的后缀。参数2：用于解析处理模板内容的方法
app.set('views', './views')					//设置模板文件存放的目录。参数1：必须是views。参数2：目录
app.set('view engine', 'html')				//注册所使用的模板引擎。参数1：必须是view engine。参数2：与app.engine中的第1个参数相同
swig.setDefaults({
	cache: false 		//取消模板缓存
})

// 静态文件托管(请求css,js,images等),当用户访问的url以/public开始，那么直接返回对应的__dirname+'/public'下的文件
app.use('/public', express.static(__dirname + '/public'))

app.get('/', function(req,res,next){
	/*
		读取views目录下的指定文件，解析并返回给客户端
		参数1：模板的文件，相对于views目录，views/index.html
		参数2：传递给模板使用的数据
	*/
	res.render('index');
})
