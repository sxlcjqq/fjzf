<template>
 <div id="editor">
   <div class="lefttree">
     <el-input
       placeholder="输入关键字进行过滤"
       v-model="filterText">
     </el-input>

     <el-button type="primary" size="mini" style="margin-bottom:10px;margin-top:10px;" @click="addRootTree">添加根节点</el-button>

     <el-tree
       class="filter-tree"
       :data="data2"
       @node-click="clickTree"
       :props="defaultProps"
       default-expand-all
       :render-content="renderContent"
       :filter-node-method="filterNode"
       ref="tree2"
       @node-drag-start="handleDragStart"
       @node-drag-enter="handleDragEnter"
       @node-drag-leave="handleDragLeave"
       @node-drag-over="handleDragOver"
       @node-drag-end="handleDragEnd"
       @node-drop="handleDrop"
       draggable
       :allow-drop="allowDrop"
       :allow-drag="allowDrag"
     >
     </el-tree>
   </div>
   <el-row style="position:absolute;top:0;left:350px;">
      <el-button type="success" plain size="mini" @click="savehtml">保存</el-button>
      <el-button type="info" plain size="mini" @click="clearhtml">清空</el-button>
    </el-row>
    <div style="height:100%;">
      <mavon-editor v-model="value"/>
    </div>
 </div>
</template>

<script>
var Chance = require('chance') // id 生成器
export default {
  name: 'editor',
  data () {
    return {
      value: '',
      filterText: '', // 关键字进行过滤
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    const that = this
    that.classlist = []

    this.getTree()
    // that.$http.get('/article/example').then(function (response) {
    //   console.log(response)
    // })
    // that.$http.get('/data/test.txt').then(function (response) {
    //   that.value = response.data
    // })
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    getTree () {
      const that = this
      that.$http.get('/article/searchTree').then(function (response) {
        if (response.data.code === '200') {
          that.data2 = response.data.list[0] ? response.data.list[0].content : []
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return (data.label.indexOf(value) !== -1)
    },
    append (data) {
      this.$prompt('请输入名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{1,}/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        const newChild = { id: new Chance().hash({ length: 24 }), label: value, children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
        this.updateTreeFun()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        })
      })
    },
    addRootTree () {
      this.$prompt('请输入名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{1,}/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        this.data2.push({
          id: new Chance().hash({ length: 24 }),
          label: value,
          children: []
        })
        this.updateTreeFun()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        })
      })
    },
    update (node, data) {
      this.$prompt('请输入名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{1,}/,
        inputErrorMessage: '名称不能为空'
      }).then(({ value }) => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children[index].label = value
        this.updateTreeFun()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
      })
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      this.updateTreeFun()
    },
    updateTreeFun () {
      const that = this
      that.$http.post('/article/updateTree', {'content': this.data2}).then(function (response) {
        if (response.data.code === '200') {

        }
      })
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
        <span>{node.label}</span>
      <span>
      <el-button size="mini" type="text" on-click={ () => this.append(data) }>增</el-button>
      <el-button size="mini" type="text" on-click={ () => this.update(node, data) }>改</el-button>
      <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删</el-button>
      </span>
      </span>)
    },
    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', this.data2)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-1-1') === -1
    },
    clickTree (node) {
      console.log(node)
      this.getHtml(node.id)
    },
    savehtml () { // 保存文章
      const that = this
      console.log(this.value)
      console.log(this.$refs.tree2.getCurrentNode())
      var nowtreedate = that.$refs.tree2.getCurrentNode()
      if (nowtreedate) {
        that.$http.post('/article/updateContent', {'id': nowtreedate.id, 'content': this.value}).then(function (response) {
          if (response.data.code === '200') {
            that.$message('保存成功！')
          }
        })
      } else {
        that.$message('请选择左侧文档名称！')
      }
      // that.$http.post('/article/savehtml', {'value': this.value}).then(function (response) {
      //   // that.value = response.data
      // })
    },
    getHtml (id) {
      const that = this
      that.$http.get('/article/getContent?id=' + id).then(function (response) {
        if (response.data.code === '200') {
          that.value = response.data.content
        }
      })
    },
    clearhtml () { // 清空文章
      this.value = ''
    }
  }
}
</script>

<style scoped>
  #editor{
    height: 100%;
    padding-top:35px;
    position: relative;
    padding-left:350px;
  }
</style>
