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
export default {
  name: 'App',
  created () {
    this.$router.push('editor')
  },
  data () {
    return {
      loginname: sessionStorage.getItem('fjzflogin'),
      activeIndex: '1', //
      centerDialogVisible: false, // 登录弹框
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
    }
  }
}
</script>

<style>
</style>
