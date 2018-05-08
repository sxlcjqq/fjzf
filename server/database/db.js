var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://localhost/myList");//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var userScheMa = new mongoose.Schema({
    name: String,
    password: String,
    createTime:String,
    userid:String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
var typesScheMa = new mongoose.Schema({
    id: String,
    text: String,
    parentid: String,
    level: String,
    contentTypeId: String,//1,2,3
    createUser: String,
    createTime: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联

var contentsScheMa = new mongoose.Schema({
    id: String,
    title: String,
    content: String,
    contentTypeId: String,//1,2,3
    TypesId: String,
    createUser: String,
    createTime: String
});
exports.user = mongoose.model("users", userScheMa);//  与users集合关联
exports.types = mongoose.model("types", typesScheMa);//  与types集合关联
exports.contents = mongoose.model("contents", contentsScheMa);//  与contents集合关联
