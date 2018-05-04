<template>
 <div id="editor">
    <mavon-editor v-model="value"/>
 </div>
</template>

<script>
export default {
  name: 'editor',
  data () {
    return {
      value: ''
    }
  }
}
</script>

<style scoped>
  #editor{
    height: 100%;
  }
</style>
