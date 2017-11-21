<template>
  <div id="app">
    <transition>
     <loginview class="loginview" v-if="isloginshow" @loginsuccess="logintosucess"></loginview>
    </transition>
      <transition :name="transitionName">
      <router-view class="child-view"/>
    </transition>
    <barview v-show="isbarshow" class="barview"></barview>
  </div>
</template>

<script>
import bar from '@/components/bar'
import login from '@/components/login'
import loading from '@/components/loading'
// import bus from '@/components/bus.js'
const qs = require('qs')

export default {
  name: 'app',
  data () {
    return {
      DangQianPath: '',
      transitionName: 'slide-left',
      barcons: ['xiaoxi', 'daiban', 'zhuye', 'lianxiren', 'wode'],
      isloginshow: true,
      isloadingshow: false,
      isbarshow: true
    }
  },
  created: function () {
    this.getPath()
    if ('isloginsuccess' in window.localStorage) {
      var loginsuccess
      loginsuccess = window.localStorage.getItem('isloginsuccess')
      if (loginsuccess === 'true') {
        var that = this
        var usercode = window.localStorage.getItem('usercode')
        var userpwd = window.localStorage.getItem('userpwd')
        var usertype = window.localStorage.getItem('usertype')
        var data0 = { openid: '123456', usercode: usercode, userpwd: userpwd, usertype: usertype }
        var url = '/sms-wx/smsUserController.do?doMUserLogin'
        this.$ajax.post(url, qs.stringify(data0), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (data) {
          if (data.data !== null && data.data !== 'undefined' && data.data !== undefined) {
            var isloginsuccess = data.data.success
            console.log(isloginsuccess + 'isloginsuccess')
            var selfinfo = data.data.attributes
            if (isloginsuccess === true) {
              console.log(selfinfo)
              var phoneisopen = selfinfo.phoneisopen
              console.log(phoneisopen)
              var selfinfol = JSON.stringify(selfinfo)
              window.localStorage.setItem('isloginsuccess', 'true')
              window.localStorage.setItem('selfinfo', selfinfol)
              window.localStorage.setItem('phoneisopen', phoneisopen)
              window.localStorage.setItem('step', 'app')
              that.isloginshow = false
//              console.log('loginsuccessfromapp')
              console.log('app执行...')
            } else {
              window.localStorage.clear()
              alert('登陆失败，请重新登录')
              // window.location.reload(true)
            }
          }
        })
          .catch(function (err) {
            alert('error:' + err)
          })
      }
    } else {
      window.localStorage.clear()
      window.location.reload(true)
    }
  },
  components: {
    barview: bar,
    loginview: login,
    loadingview: loading
  },
  mounted () {
    this.isloadingshow = false
//    alert(navigator.userAgent)
  },
  methods: {
    getPath: function () {
      this.DangQianPath = this.$route.path
     // console.log(this.DangQianPath)
    },
    logintosucess: function (logininfo) {
      this.isloginshow = false
      console.log(logininfo)
      this.$router.push('/dist/zhuye')
    },
    loadinghide: function () {
      this.isloadingshow = false
      console.log(this.isloadingshow)
    },
    hidebar: function () {
      this.isbarshow = false
    }
  },
  watch: {
    '$route' (to, from) {                    // 控制动画方向
     // console.log(to.path + from.path)
      var newval = to.path
      var oldval = from.path
      newval = newval.split('/')
      newval = newval[2]
      oldval = oldval.split('/')
      oldval = oldval[2]
     // console.log(newval + oldval)
      var toindex
      var fromindex
      for (var i = 0; i < this.barcons.length; i++) {
        if (this.barcons[i] === newval) {
          toindex = i
        }
      }
      for (var n = 0; n < this.barcons.length; n++) {
        if (this.barcons[n] === oldval) {
          fromindex = n
        }
      }
      var fx = toindex - fromindex
     // console.log(fx)
      if (fx < 0) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
    }
  }
}
</script>

<style >
  @import '../static/css/animate.css';

</style>

<style>
  *{
    margin:0px;
    padding:0px;
    -webkit-tap-highlight-color:rgba(255,0,0,0);
  }
  /* 视图动画*/
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0
  }
  body{
    background-color:#ECEDF1
  }
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height:100%;
  -webkit-tap-highlight-color:rgba(255,0,0,0);
}


.loginview{
  position:fixed;
  width:100%;
  height:300%;
  top:0px;
}

.loadingview{
  position:fixed;
  width:100%;
  height:300%;
  top:0px;
}
  .child-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: suto;
    overflow: scroll;
    transition: all .6s cubic-bezier(.55,0,.1,1);
    background-color:#ecedf1;
  }

  /*页面加载动画*/
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }


  .spinner {
    width: 60px;
    height: 60px;
    position: relative;
    margin: 100px auto;
  }

  .double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #67CF22;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: bounce 2.0s infinite ease-in-out;
    animation: bounce 2.0s infinite ease-in-out;
  }

  .double-bounce2 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  @-webkit-keyframes bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 50% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
      }
  }

  .barview{
    /*z-index:0;*/
    /*border:1px solid red;*/
  }
</style>
