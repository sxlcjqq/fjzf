var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://localhost/myList");//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var userScheMa = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true //唯一username
  },
  password: String,
  createTime: {
    type: Date,
    default: Date.now
  }
})
var contentsScheMa = new mongoose.Schema({
  leaf: {
    type: String,
    unique: true // 唯一leaf，文档列表就是树列表
  },
  name: String,
  createTime: String,
  updateTime: String,
  children: Array,
  content: String,
  createTime: {
    type: Date,
    default: Date.now
  }
}, {strict: true})
exports.user = mongoose.model('users', userScheMa) //  与users集合关联
exports.contents = mongoose.model('contents', contentsScheMa) //  与contents集合关联
