<template>
  <div class="wode">
    <div class="content">
      <teacherinfo v-if="isteacherinfoshow"  class="studentinfo"></teacherinfo>
      <studentinfo v-else></studentinfo>
      <!--<el-button @click="loginout">注销账号</el-button>-->
    </div>
  </div>
</template>

<script>
import loading from '@/components/loading'
import teacherinfo from '@/components/wode/teacherinfo'
import studentinfo from '@/components/wode/studentinfo'

export default {
  name: 'wode',
  data () {
    return {
      ischangepwdshow: true,
      isloadingshow: false,
      isteacherinfoshow: '',
      isselinfoshow: true
    }
  },
  created: function () {
    var usertype = window.localStorage.getItem('usertype')
    if (usertype === '1') {
      this.isteacherinfoshow = true
    } else if (usertype === '0') {
      this.isteacherinfoshow = false
    }
    console.log(this.isteacherinfoshow)
  },
  mounted: function () {
  },
  methods: {
  },
  components: {
    loadingview: loading,
    studentinfo: studentinfo,
    teacherinfo: teacherinfo
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wode{
  width: 100%;
  overflow: scroll;
}
</style>
