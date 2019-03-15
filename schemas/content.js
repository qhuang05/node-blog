var mongoose = require('mongoose')
// 内容的表结构
module.exports = new mongoose.Schema({
	// 关联字段
	category:{
		// 类型
		type: mongoose.Schema.Types.ObjectId,
		// 引用
		ref: 'Category'
	},
	title: String,
	description: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: '', 
	}
})
