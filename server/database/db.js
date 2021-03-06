var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://47.93.98.194:27017/myList");//；连接数据库
// var db = mongoose.connect("mongodb://localhost/myList");//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var userScheMa = new mongoose.Schema({
  userid: Schema.Types.ObjectId, // 对应contentsScheMa中的_id
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
var treeScheMa = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // 唯一name,对应userScheMa中的username
  },
  updateTime: {
    type: Date,
    default: Date.now
  },
  content: Object,
  createTime: {
    type: Date,
    default: Date.now
  }
}, {strict: true})
var contentsScheMa = new mongoose.Schema({
  updateTime: {
    type: Date,
    default: Date.now
  },
  content: Object,
  createTime: {
    type: Date,
    default: Date.now
  }
}, {strict: true})
exports.user = mongoose.model('users', userScheMa) //  与users集合关联
exports.tree = mongoose.model('trees', treeScheMa) //  与users集合关联
exports.contents = mongoose.model('contents', contentsScheMa) //  与contents集合关联
