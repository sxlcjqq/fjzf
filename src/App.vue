<template>
  <div id="app">
    <header class="app">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-button type="primary" v-if="!loginname" size="small" plain class="fr" style="margin-top:15px;margin-right:15px;" @click="showlogin">登录/注册</el-button>
        <el-button type="primary" v-if="loginname" size="small" plain class="fr" style="margin-top:15px;margin-right:15px;" @click="loginout">退出登录</el-button>
        <el-button type="primary" v-if="loginname" size="small" plain class="fr" style="margin-top:15px;margin-right:15px;">{{loginname}}</el-button>
        <el-menu-item index="1">我的笔记</el-menu-item>
        <el-submenu index="3" disabled>
          <template slot="title">我的工作台</template>
          <el-menu-item index="3-1">选项1</el-menu-item>
          <el-menu-item index="3-2">选项2</el-menu-item>
          <el-menu-item index="3-3">选项3</el-menu-item>
          <el-submenu index="3-4">
            <template slot="title">选项4</template>
            <el-menu-item index="3-4-1">选项1</el-menu-item>
            <el-menu-item index="3-4-2">选项2</el-menu-item>
            <el-menu-item index="3-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </header>
    <div class="content">
      <div class="lefttree">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>

        <el-button type="primary" size="mini" style="margin-bottom:10px;margin-top:10px;" @click="addRootTree">添加根节点</el-button>

        <el-tree
          class="filter-tree"
          :data="data2"
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
      <router-view/>
    </div>
    <el-dialog
      title="登录/注册"
      :visible.sync="centerDialogVisible"
      width="400px"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="用户名（唯一）" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="loginFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var id = 100
export default {
  name: 'App',
  created () {
    this.$router.push('editor')
    this.getTree()
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  data () {
    return {
      loginname: sessionStorage.getItem('fjzflogin'),
      activeIndex: '1', //
      centerDialogVisible: false, // 登录弹框
      filterText: '', // 关键字进行过滤
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getTree () {
      const that = this
      that.$http.get('/article/searchTree').then(function (response) {
        if (response.data.code === '200') {
          that.data2 = response.data.list[0].content ? response.data.list[0].content : []
        }
      })
    },
    loginout () {
      const that = this
      that.$http.get('/article/loginout').then(function (response) {
        if (response.data.code === '200') {
          that.loginname = false
          sessionStorage.clear('fjzflogin')
        }
      })
    },
    loginFun () {
      const that = this
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.$http.post('/article/login', this.ruleForm).then(function (response) {
            if (response.data.code === '200') {
              console.log(that.ruleForm)
              sessionStorage.setItem('fjzflogin', that.ruleForm.username)
              that.loginname = that.ruleForm.username
              that.centerDialogVisible = false
              that.getTree()
            } else {
              that.$message({
                type: 'info',
                message: response.data.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showlogin () {
      this.centerDialogVisible = true
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetField()
      }
    },
    handleSelect (key, keyPath) {
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
        const newChild = { id: id++, label: value, children: [] }
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
          id: 100,
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
    }
  }
}
</script>

<style>
</style>
