$(function(){
  vm.init({'contentTypeId':1},3);
})

var vm=new Vue({
  el:'#jqq',
  data:{
    type1:{val2:'',val3:'',val4:''},
    type2:{val2:'',val3:'',val4:''},
    content_title:[{
      id:"1",
      text:"链接",
      number:"20"
    },{
      id:"2",
      text:"代码",
      number:"20"
    },{
      id:"3",
      text:"文档",
      number:"20"
    }],
    content_title_active:0,//标题类型 
    statu:'list',//当前页面，create list
    lists:[],
    treeData:[],//数据
     checkListData:{},
     liveid:'',
     updatelist:{}
  },
  methods:{
    changeIndex:function(name,index){
      vm[name] = index;
      vm.init({'contentTypeId':index*1+1},3);
    },
    toggleClass:function(e,className){
      $(e.target).parents('.panel').toggleClass(className);
    },
    addFun:function(type){
      if(vm.liveid){
        if(!vm.type1.val2){
          layer.msg('请输入标题！');
          return;
        }
        if(!vm.type1.val3){
          layer.msg('请输入链接！');
          return;
        }
        if(type==1){
          $.post(__post+"/list/addlist",{
            title: vm.type1.val2,
            content: JSON.stringify({
              'link':(vm.type1.val3)?((vm.type1.val3.indexOf('http://')>-1)?vm.type1.val3:'http://'+vm.type1.val3):'',
              'remark':vm.type1.val4
            }),
            'TypesId':vm.liveid,
            contentTypeId: type//1,2,3
          },function(result){
            if(result.code==200){
                var search = {'contentTypeId':type};
                if(vm.liveid&&vm.liveid!="dd01ce10-0f30-11e8-ab8a-93d47bbad8e9"){
                  search['TypesId'] = vm.liveid;
                }
                vm.init(search,2);
                vm.statu = 'list';
                if(vm.liveid){
                    Vue.set(vm.content_title[0],['number'],vm.content_title[0].number+1);
                }
            }else{
              alert(result.msg);
            }
          });
        }
      }else{
        layer.msg('请选择分类！');
      }
    },
    updateFun:function(type,id){
      if(type==1){
        $.post(__post+"/list/updatelist",{
          id: id,
          title:vm.updatelist.title,
          content:JSON.stringify({'link':vm.updatelist.link,'remark':vm.updatelist.remark})
        },function(result){
          if(result.code==200){

                var search = {'contentTypeId':type};
                if(vm.liveid&&vm.liveid!="dd01ce10-0f30-11e8-ab8a-93d47bbad8e9"){
                  search['TypesId'] = vm.liveid;
                }
                vm.init(search,2);              vm.statu = 'list';
              layer.msg('修改成功！');
          }else{
            alert(result.msg);
          }
        });
      }
    },
    updatelistFun:function(type,data){
      vm.updatelist = JSON.parse(JSON.stringify(data));
      vm.statu = 'update';
      vm.updatelist.link = vm.updatelist.content?JSON.parse(vm.updatelist.content).link:'';
      vm.updatelist.remark = vm.updatelist.content?JSON.parse(vm.updatelist.content).remark:'';
    },
    deletelist:function(type,id){
        if(type==1){
          $.post(__post+"/list/deletelist",{
            id: id
          },function(result){
            if(result.code==200){

                  var search = {'contentTypeId':type};
                  if(vm.liveid&&vm.liveid!="dd01ce10-0f30-11e8-ab8a-93d47bbad8e9"){
                    search['TypesId'] = vm.liveid;
                  }
                  vm.init(search,2);                layer.msg('删除成功！');

                if(vm.liveid){
                  Vue.set(vm.content_title[0],['number'],vm.content_title[0].number-1);
                }
            }else{
              alert(result.msg);
            }
          });
        }
    },
    init:function(search,statu){//statu:1分类。2.文档 3.分类和文档
        $.get(__post+"/list/list?search="+JSON.stringify(search)+'&type='+statu,function(result){
            if(statu!=2){
              vm.getParentlist(result.type);
            }
            if(statu!=1){
              vm.lists = result.list;
              if(!search.TypesId){
                vm.content_title[vm.content_title_active].number = vm.lists.length;
              }
            }
        });
    },
    // 上下级转化
    getParentlist:function(typedata){
        var dd = JSON.parse(JSON.stringify(typedata));
        var level = {};
        var pp = {};
        $.each(dd,function(index,element){
          if(level[element.level]){
            level[element.level].push(element);
          }else{
            level[element.level] = [];
            level[element.level].push(element);
          }
          if(element.parentid){
              if(!pp[element.parentid]){
                pp[element.parentid] = [];
              }
              pp[element.parentid].push(element);
          }else{
              if(!pp['first']){
                pp['first'] = [];
              }
              pp['first'].push(element);
            }
        })
        for(var i = (objLength(level)-1);i>-1;i--){
          $.each(level[i],function(index,element){
            if(pp[element.id]){
              element.child = pp[element.id];
            }
          })
        }
        vm.treeData = level[0];
    }
    ,
    onactiveidChange:function(val){
      this.liveid=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
    }
  }
})
/* 注册组件 */
Vue.component('table-component', {
    template:"#table-component-template",//模板
    props:['list','checkdata','activeid'],//传递数据
    data:function(){
      return {
        childrenactiveid:this.activeid //①创建props属性activeid的副本--childrenactiveid
      }
    },
     watch: {
       activeid(val) {
        this.childrenactiveid = val;//新增activeid的watch，监听变更并同步到myResult上
       },
        childrenactiveid(val){
        this.$emit("on-activeid-change",val);//③组件内对childrenactiveid变更后向外部发送事件通知
       }
      },
    methods:{
        showlist:function(event,list){//显示当前分类下的列表
            var _this = $(event.currentTarget);//点击的对象
            if(event.target.nodeName!='SPAN'){
              if((vm.statu == 'list')||(vm.statu =='list2')||(vm.statu =='list3')){
                if(list.level==0){
                  vm.init({'contentTypeId':list.contentTypeId},2);
                }else{
                  vm.init({'contentTypeId':list.contentTypeId,'TypesId':list.id},2);
                }
              }
              $('#table-component-div p').removeClass('live');
              _this.addClass('live');
              // vm.statu = 'list';
              //
              this.childrenactiveid = list.id;
            }
        },
        showChild:function(event,list){
              var _this = $(event.currentTarget);//点击的对象

                _this.parent('p').parent('li').toggleClass('active');
                $('#table-component-div .menubtn').removeClass('active');
                // console.log(this.activeid)
        },
        showMenu:function(event){//右键出现菜单
          var _this = $(event.currentTarget);//点击的对象
          $('#table-component-div .menubtn').removeClass('active');
            _this.children('.menubtn').addClass('active');
        },
      onactiveidChange:function(val){
        this.childrenactiveid=val;//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      setlist:function(statu,list){//新建修改删除方法
          var that = this;
          if(statu==1){//新建
            $('#name').val('');
            var i = layer.open({
              title:false,
              type: 1,
              content: $('#create'),
              closeBtn: 0,
              zIndex: 99,
              area: ['300px', '200px'],
              btn: ['保存', '返回'],
              yes: function (c, d) {
                if($('#name').val()){
                    $.post(__post+"/list/addtype",{
                      text: $('#name').val(),
                      parentid: list.id,
                      level: (list.level*1+1),
                      contentTypeId: list.contentTypeId
            				},function(result){
            					if(result.code==200){
                          var a = that.list.child?that.list.child:[];
                          a.push({
                            text:$('#name').val(),
                            parentid: list.id,
                            level: (list.level*1+1),
                            id:result.list.id,
                            contentTypeId: list.contentTypeId,
                            child:[]
                          });
                          Vue.set(that.list,['child'],a);
            					}else{
                          layer.msg(result.msg);
            					}
            			  });
                    layer.close(i);
                }else{
                  layer.msg('请输入名称！');
                }
              },
              cancel: function (a) {
                layer.close(i);
              }
          });
          }else if(statu==2){//修改
            $('#name').val(list.text);
            var i = layer.open({
              title:false,
              type: 1,
              content: $('#create'),
              closeBtn: 0,
              zIndex: 99,
              area: ['300px', '200px'],
              btn: ['保存', '返回'],
              yes: function (c, d) {
                  if($('#name').val()){
                      $.post(__post+"/list/updatetype",{
                        text: $('#name').val(),
                        id: list.id
              				},function(result){
              					if(result.code==200){
                          list.text = $('#name').val();
              					}else{
                          layer.msg(result.msg);
              					}
              			  });
                      layer.close(i);
                  }else{
                    layer.msg('请输入名称！');
                  }
              },
              cancel: function (a) {
                layer.close(i);
              }
          });
          }else if(statu==3){//删除removetype
            $('#name').val(list.text);
            var i = layer.open({
              title:false,
              type: 1,
              content: $('#del'),
              closeBtn: 0,
              zIndex: 99,
              area: ['300px', '150px'],
              btn: ['确定', '返回'],
              yes: function (c, d) {
                  if($('#name').val()){
                      $.post(__post+"/list/removetype",{
                        id: list.id
              				},function(result){
              					if(result.code==200){
                          vm.init({'contentTypeId':list.contentTypeId},1);
              					}else{
                          layer.msg(result.msg);
              					}
              			  });
                      layer.close(i);
                  }else{
                    layer.msg('请输入名称！');
                  }
              },
              cancel: function (a) {
                layer.close(i);
              }
          });
          }
        }
    }
});
