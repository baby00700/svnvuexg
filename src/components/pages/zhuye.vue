<template>
  <div class="zhuye">
    <transition  name="custom-classes-transition"
                 enter-active-class="animated slideInUp"
                 leave-active-class="animated slideOutDown">
    <router-view class="functionview"></router-view>
    </transition>
    <div class="lunbo">
      <mt-swipe :auto="3000" :show-indicators="false">
          <mt-swipe-item v-for="item in lunboimglist" class="lunbotu" :key="item.title">
            <div class="titlebox">{{item.title}}</div>
            <div class="imgbox">
              <img :src='item.image_href' alt="" width="100%" height="100%">
            </div>
          </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="funclistwrap" style="height:140px;overflow: scroll">
      <!--<div class="isshowfuncs" style="position:fixed;top:205px;right:10px;font-size: 14px;color:blue">{{showtips}}</div>-->
      <div class="functionlist" style="height:140px;overflow: scroll">
        <li class="functiccon" v-for="(item, $index) in functionlist"  :key="item.columnName"  @click="tofunctions($index)">
            <div class="funcicon">
              <img :src='item.columnimage' alt="" width="100%">
            </div>
            <div class="funcname">{{item.columnName}}</div>
        </li>
      </div>
    </div>
    <div class="newswrap">
      <div class="changetop">
        <div class="topbut" :class="{ active: isnewslistshow }" @click="shownews()">校内新闻</div>
        <div class="topbut" :class="{ active: isnoticelistshow}" @click="shownotice()">校内公告</div>
      </div>
      <div class="listinfo">
        <div class="infolist">
          <transition  name="custom-classes-transition"
                       enter-active-class="animated fadeIn"
                      >
          <newslist v-show="isnewslistshow"></newslist>
          </transition>
          <transition  name="custom-classes-transition"
                       enter-active-class="animated fadeIn"
                       >
          <noticelist v-show="isnoticelistshow"></noticelist>
          </transition>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem, CellSwipe } from 'mint-ui'
import axios from 'axios'
// import { Loading } from 'element-ui'
import bus from '@/components/bus.js'   // 事件总线
import newslist from '@/components/zhuye/newslist'
import noticelist from '@/components/zhuye/noticelist'

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(CellSwipe.name, CellSwipe)
export default {
  name: 'zhuye',
  data () {
    return {
      ispageshow: false,
      functionlist: [
        {columnName: '成绩查询', columnbyName: 'chengjichaxun', columnimage: 'upload/1509087429968_d01373f082025aaf9789fc56fdedab64024f1af7.jpg'}
      ],
      lunboimglist: [
        {image_href: 'http://192.168.1.155:8081/sms-wx/upload/files/20140627233502FEzyc38j.jpg', image_name: '19300001024098134717639977056.jpg', title: 'IPHONE7'}
      ],
      isnewslistshow: true,
      isnoticelistshow: false,
      showtips: '展开'
    }
  },
  created: function () {
    let that = this
    var islogin = window.localStorage.getItem('isloginsuccess')
    if (islogin === 'true') {
      that.getfunctionslist()
      that.getimageurl()
      bus.$emit('zhuyeok')
      window.localStorage.setItem('step', 'zhuye')
    }
  },
  mounted: function () {
    console.log('zy')
    let that = this
    this.$emit('mountedcomplete')
    bus.$on('loginsuccessfromroot', function () {  // 从app触发 从login触发
      console.log(this)
      that.getfunctionslist()
      that.getimageurl()
    })
  },
  beforeDestroy: function () {
    let that = this
    bus.$off('loginsuccessfromroot', function () {
      console.log(this)
      that.getfunctionslist()
      that.getimageurl()
    })
  },
  methods: {
    alert: function () {
      alert('ajsadfvujf')
    },
    tofunctions: function (index) {
     // console.log(index)
      this.$router.push('/dist/zhuye/' + this.functionlist[index].columnbyName)
    },
    getfunctionslist: function () {
      console.log('事件已接收')
      bus.$emit('zhuyeisok')
     // let loadingInstance1 = Loading.service({fullscreen: true})
      var that = this
      var url = '/sms-wx/smsUserController.do?columnRoleList'
     // http://192.168.1.110:8081/sms-wx/smsUserController.do?doMUserLogin&columnRoleList
      axios.post(url).then(function (data) {
        that.functionlist = []
        if (data.data !== null && data.data !== 'null') {
          var islogin = window.localStorage.getItem('isloginsuccess')
          if (data.data.success === true) {
            if (islogin === 'true' && data.data.msg.length >= 1 && data.data.msg !== null && data.data.msg !== 'null' && data.data.msg !== undefined && data.data.msg !== 'undefined') {
              if (data.data.success === true) {
                var datamsg = JSON.parse(data.data.msg)
                // console.log(datamsg)
                var imgurl = 'http://192.168.1.155:8080/sms/'
                for (var i = 0; i < datamsg.length; i++) {
                  datamsg[i].columnimage = imgurl + datamsg[i].columnimage
                  var funcnames = {columnbyName: datamsg[i].columnbyName, columnName: datamsg[i].columnName, columnimage: datamsg[i].columnimage}
                  that.functionlist.push(funcnames)
                }
                window.localStorage.setItem('iszhuyeok', 'ok')
              }
              setTimeout(function () {
                //  loadingInstance1.close()
              }, 500)
            }
          }
         // console.log(islogin)
        }
      })
    },
    getimageurl: function () {
      let that = this
      var url = '/sms-wx/smsUserController.do?adListByImg'
      axios.post(url).then(function (data) {
        that.lunboimglist = []
        if (data.data !== null && data.data !== 'null') {
          if (data.data.obj === 'needlogin') {
//            window.localStorage.clear()
            window.location.reload(true)
          }
          // console.log(data.data.msg)
          if (data.data.msg !== null && data.data.msg !== 'null' && data.data.msg !== undefined && data.data.msg !== 'undefined') {
            if (data.data.success === true) {
              if (data.data.msg.length > 0) {
                var imgdata = JSON.parse(data.data.msg)
                //  console.log(imgdata)
                var imgdatalength = imgdata.length
                if (imgdatalength >= 4) {  // 轮播图限制显示4张
                  imgdatalength = 4
                }
                var commonimgurl = 'http://192.168.1.155:8081/sms-wx/'
                for (var i = 0; i < imgdatalength; i++) {
                  that.lunboimglist.push(imgdata[i])
                  //  console.log(imgdata[i].image_href)
                  imgdata[i].image_href = commonimgurl + imgdata[i].image_href
                }
              }
            }
          }
        }
      }).catch(function (err) {
        alert(err)
      })
    },
    shownews: function () {
      this.isnewslistshow = true
      this.isnoticelistshow = false
    },
    shownotice: function () {
      this.isnewslistshow = false
      this.isnoticelistshow = true
    }
  },
  watch: {
    isnewslistshow: function (newval, oldval) {
      this.isnewslistshow = !this.isnoticelistshow
    },
    isnoticelistshow: function (newval, oldval) {
      this.isnoticelistshow = !this.isnewslistshow
    }
  },
  components: {
    newslist: newslist,
    noticelist: noticelist
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .zhuye{
    width: 100%;
    padding-bottom:60px;
    overflow: scroll;
  }
  .lunbo{
    width:100%;
    height:200px;
    background-color:#fff;
  }
 .imgbox{
   width:100%;
   height:100%;

 }
  .funclistwrap{
    width:100%;
    /*height:140px;*/
    background-color:#fff;
  overflow: scroll;
  }
  .functionlist{
    width:170%;
    /*//height:140px;*/
    /*background-color:yellow;*/
    padding-right:-150%;
  }
  .functiccon{
    display: inline-block;
    /*background-color: darkgreen;*/
    width:12%;
    height:110px;
    float: left;
    margin-left:4%;
    margin-top:25px;
    margin-bottom:0px;
    position: relative;
  }

.funcicon{
  width:60px;
  height:60px;
  border-radius:25px;
  position:absolute;
  left:calc(50% - 30px);

}
  .funcname{
    width:100%;
    height:20px;
    /*background-color:blue;*/
    position:absolute;
    top:65px;
    color:#555;
    font-size:15px;
  }
  .functionview{
    width:100%;
    height:100%;
    position:fixed;
    background-color:yellow;
  }
  .titlebox{
    width:100%;
    height:26px;
    background-color:rgba(0,0,0,0.3);
    position:absolute;
    bottom:0px;
    color:#fff;
    line-height:26px;
    font-size:15px;
    font-weight:500;
  }
  .newswrap{
    width:100%;
    /*border:1px solid red;*/
    margin-top:15px;
  }
  .changetop{
    width:100%;
    height:40px;
    /*background-color:red;*/
    border-bottom:1px solid #eee;
  }
  .topbut{
    height:45px;
    width:50%;
    float: left;
    background-color:#fff;
    text-align: center;
    line-height:45px;
    box-sizing: border-box;

    border-bottom:1px solid #eee;
  }
  .active{
    /*background-color:green;*/
    border-bottom:3px solid #179aec;

  }
  .notice{
    /*background-color:blue;*/
    /*border-bottom:3px solid #179aec;*/
  }

</style>
