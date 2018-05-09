<template>
 <div id="editor">
   <el-row style="position:absolute;top:0;left:0;">
      <el-button type="success" plain size="mini" @click="savehtml">保存</el-button>
      <el-button type="info" plain size="mini" @click="clearhtml">清空</el-button>
    </el-row>
    <div style="height:100%;">
      <mavon-editor v-model="value"/>
    </div>
 </div>
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
      value: ''
    }
  },
  created () {
    const that = this
    that.classlist = []
    // that.$http.get('/article/example').then(function (response) {
    //   console.log(response)
    // })
    that.$http.get('/data/test.txt').then(function (response) {
      that.value = response.data
    })
  },
  methods: {
    savehtml () { // 保存文章
      const that = this
      console.log(this.value)
      that.$http.post('/article/savehtml', {'value': this.value}).then(function (response) {
        // that.value = response.data
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
  }
</style>
