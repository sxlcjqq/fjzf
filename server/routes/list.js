var express = require('express');
var router = express.Router();

var user = require('../database/db').user;
var types = require('../database/db').types;
var contents = require('../database/db').contents;
//生成uuid
var uuid = require('node-uuid');
//获取当前时间
var nowdate = new Date().getTime();

// see https://github.com/expressjs/body-parser
// 添加 body-parser 中间件就可以了
// 响应一个JSON数据
// 以json形式，把操作结果返回给前台页面
var responseJSON = function(res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code: '-200',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
}
/* GET users listing. */
//获取list通过type 1，2，3
router.get('/list', function(req, res, next) {
	var search = JSON.parse(req.query.search);
	search.createUser = req.session.userid;
	if(req.query.type==1){
		types.find(search, function(err, doc1){
			responseJSON(res, {
				code: '200',
				list:[],
				type:doc1,
				msg: '成功～'
			});
		});
	}else if(req.query.type==2){
		contents.find(search, function(err, doc){
					responseJSON(res, {
						code: '200',
						list:doc,
						type:[],
						msg: '成功～'
					});
	});
}else if(req.query.type==3){
	contents.find(search, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
			console.log('--------------')
			console.log(err)
			types.find(search, function(err, doc1){
				responseJSON(res, {
					code: '200',
					list:doc,
					type:doc1,
					msg: '成功～'
				});
			});
		});
}

});
// 添加分类
router.post('/addtype', function(req, res) {
  var contentid = uuid.v1();
	var typesSingle = {'id': contentid, 'text': req.body.text,'parentid':req.body.parentid,'TypesId':req.body.TypesId,'level':req.body.level,'contentTypeId':req.body.contentTypeId,'createUser':req.session.userid,'createTime':nowdate};
console.log(typesSingle)
	var newTypes = new types(typesSingle);
  newTypes.save(function (err){

		responseJSON(res, {
			code: '200',
			msg: '添加成功～',
			list:{
				id:contentid
			}
		});
    console.log(err);
  });

  // var typetext = req.body.typetext.split('/');
  // var typeidlist = [];
  // typetext.forEach(function(element ,index){
  //   if(element){
  //     var idd = uuid.v1();
  //     var typesSingle = {'id': idd, 'text': element,'parentid':((typeidlist.length-1)>element)?'0':typeidlist[typeidlist.length-1],'level':index,'contentTypeId':req.body.contentTypeId,'createUser':req.session.userid,'createTime':nowdate};
  //     var newTypes = new types(typesSingle);
  //     typeidlist.push(idd);
  //     newTypes.save(function (err){
  //       console.log(err);
  //     });
  //   }
  // })
  //
});

// 修改分类
router.post('/updatetype', function(req, res) {
	types.update({'id':req.body.id},{'text':req.body.text},function (err){
		responseJSON(res, {
			code: '200',
			msg: '修改成功～'
		});
		console.log(err);
	});
});
// 删除分类
router.post('/removetype', function(req, res) {
	types.count({'parentid':req.body.id}, function(err, doc1){
		console.log(doc1)
		if(doc1<1){
			console.log(doc1)
			types.remove({'id':req.body.id},function (err){
				responseJSON(res, {
					code: '200',
					msg: '删除成功～'
				});
				console.log(err);
			});
		}else{
				responseJSON(res, {
					code: '100',
					msg: '删除失败，当前分类下存在子分类～'
				});
		}
	});
});
// 添加list
router.post('/addlist', function(req, res) {

  var contentid = uuid.v1();
  var contentsSingle = {'id': contentid, 'title': req.body.title,'content':req.body.content,'TypesId':req.body.TypesId,'contentTypeId':req.body.contentTypeId,'createUser':req.session.userid,'createTime':nowdate};
  var newContents = new contents(contentsSingle);
  newContents.save(function (err){
      console.log(err);
      responseJSON(res, {
        code: '200',
        msg: '添加成功～'
      });
  });
});
//删除list
router.post('/deletelist', function(req, res) {
	contents.remove({'id':req.body.id},function (err){
		responseJSON(res, {
			code: '200',
			msg: '删除成功～'
		});
		console.log(err);
	});
});
// 修改list
router.post('/updatelist', function(req, res) {
	contents.update({'id':req.body.id},{'title':req.body.title,'content':req.body.content},function (err){
		responseJSON(res, {
			code: '200',
			msg: '修改成功～'
		});
		console.log(err);
	});
});

module.exports = router;
