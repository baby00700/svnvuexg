<template>
  <div class="changepwd" >
    <div class="pwd">
      <label for="oldpwdinput" class="pwdlabel">旧密码</label>
      <input type="text" id="oldpwdinput" class="pwdinput" placeholder="请输入旧密码" v-model="oldpwd" @change="validatepwd" >
    </div>
    <div class="pwd">
      <label for="newpwdinput" class="pwdlabel">新密码</label>
      <input type="password" id="newpwdinput" class="pwdinput" placeholder="请输入新密码" v-model="newpwd" @change="validatenewpwd">
    </div>
    <div class="pwd">
      <label for="confnewpwdinput" class="pwdlabel">确认密码</label>
      <input type="password" id="confnewpwdinput" class="pwdinput" placeholder="请再次输入新密码" v-model="confnewpwd" @change="validateconfnewpwd">
    </div>
    <div class="tip">{{tip}}</div>
    <el-button
      type="primary"
      @click="changepwd"
      class="but" v-if="isbut0show" :disabled="isdisable">
      提交
    </el-button>
    <el-button type="primary" class="but1" @click="offchangepwd()" v-if="isbut0show">返回</el-button>
    <el-button type="primary" :disabled="true" class="but0"  v-if="isbut1show">提交中...</el-button>
  </div>
</template>

<script>
  import vue from 'vue'
  import resource from 'vue-resource'
  import axios from 'axios'
 // import { Loading } from 'element-ui'
  const qs = require('qs')

  vue.use(resource)

  export default {
    name: 'changepwd',
    data () {
      return {
        oldpwd: '',
        newpwd: '',
        confnewpwd: '',
        isoldpwdok: false,
        isnewpwdok: false,
        iseqpwd: false,
        isbut0show: true,
        isbut1show: false,
        isdisable: true,
        isallok: false,
        tip: '密码由6-20位英文或数字组成',
        isloading: true
      }
    },
    mounted: function () {
    },
    watch: {
      confnewpwd: function (newval, oldval) {
        this.validateconfnewpwd()
      },
      oldpwd: function (newval, oldval) {
        this.validatepwd()
      },
      newpwd: function (newval, oldval) {
        this.validatenewpwd()
      }
    },
    methods: {
      changepwd: function () {
        if (this.isoldpwdok === true && this.isnewpwdok === true && this.iseqpwd === true) {
         // let loadingInstance1 = Loading.service({ fullscreen: true })
          this.isbut0show = false
          this.isbut1show = true
          console.log(this.$data)
          var that = this
          var url = '/sms-wx/smsUserController.do?modlePwd'
          var olduserpwd = this.oldpwd
          var newuserpwd = this.newpwd
          var data0 = {olduserpwd: olduserpwd, newuserpwd: newuserpwd}
          axios.post(url, qs.stringify(data0)).then(function (data) {
            console.log(data)
            that.isloading = false
          })
        }
      },
      validatepwd: function () {
        var reg = /^[0-9]+$/
        if (!reg.test(this.oldpwd)) {
          this.tip = '身份证号码格式不正确'
          this.isdisable = true
        } else {
          this.isoldpwdok = true
          this.tip = '请输入新密码'
        }
      },
      validatenewpwd: function () {
        console.log(this.newpwd)
        var reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(this.newpwd) || this.newpwd.length < 6) {
          this.tip = '密码格式不正确'
          this.isdisable = true
        } else {
          this.isnewpwdok = true
          this.tip = '密码由6-20位英文或数字组成'
          if (this.newpwd === this.confnewpwd) {
            this.iseqpwd = true
            this.tip = '两次输入的密码一致'
            this.isdisable = false
          } else {
            this.tip = '两次输入的密码不一致'
            this.iseqpwd = false
            this.isdisable = true
          }
        }
      },
      validateconfnewpwd: function () {
        console.log(this.confnewpwd)
        if (this.newpwd === this.confnewpwd) {
          this.iseqpwd = true
          this.tip = '两次输入的密码一致'
          this.isdisable = false
        } else {
          this.tip = '两次输入的密码不一致'
          this.iseqpwd = false
          this.isdisable = true
        }
      },
      offchangepwd: function () {
        this.$emit('changepwdhide')
      },
      openFullScreen () {
        this.fullscreenLoading = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .changepwd{
    width:100%;
    height:100%;
    background-color:#ecedf1;
    position:fixed;
    top:0px;
    left:0px;
    z-index:999;
  }
  .pwd{
    /*border:1px solid red;*/
    width:100%;
    height:50px;
    background-color:#fff;
    border-bottom: 1px solid #ecedf1;
    position:relative;
  }
  .pwdlabel{
    line-height:50px;
    color:#555555;
    font-size:16px;
    float: left;
    position:absolute;
    left:15px;
    font-weight:600;
  }
  .pwdinput{
    height:48px;
    width:calc(100% - 120px);
    position:absolute;
    left:100px;
    font-size:16px;
    border:0;
  }
  .pwdinpu::-webkit-input-placeholder{
    color: #eee;
  }
  .tip{
    height:30px;
    width:100%;
    color:#999999;
    font-size:14px;
    position:relative;
    top:10px;
    left: 15px;
    text-align: left;
  }
  .but{
    width:40%;
    height:40px;
    position:absolute;
    top:200px;
    right:6%;
    font-size:16px;
  }
  .but0{
    width:92%;
    height:40px;
    position:absolute;
    top:200px;
    left:4%;
    font-size:16px;
    z-index:-100;
  }
  .but1{
    width:40%;
    height:40px;
    position:absolute;
    top:200px;
    left:3%;
    font-size:16px;
  }
  .loadingview{
    width:100%;
    height:100%;
    position:fixed;
    top:0px;
    left:0px;
    z-index:999;
  }
</style>
