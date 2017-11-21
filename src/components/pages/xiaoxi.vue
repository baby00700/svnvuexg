<template>
  <div class="xiaoxi"  oncontextmenu='return false' v-loading="loading">
    <transition  name="custom-classes-transition"
                 enter-active-class="animated bounceInLeft"
                 leave-active-class="animated bounceOutRight">
    </transition>
    <ul>
        <li class="loadli" :class="{ loadlianimate: isActive }">
          <div class="loadlicon" v-show="isloadlishow">{{tips}}</div>
        </li>
        <li v-for="(item, $index) in uselist" @click="lookmore($index)" >
          <div class="linewrap">
            <div class="icons" :class="listiconcolorclass[item.ww]">{{item.qq.firstz}}</div>
            <div class="infos">
              <div class="titleinfo">
                <div class="title"><nobr>{{item.qq.senduser}}</nobr></div>
                <div class="cont"><nobr>{{item.qq.content}}</nobr></div>
              </div>
              <div class="timeinfo">{{item.qq.create_date1}}</div>
              <div class="refdot" :style="item.qq.color">{{item.qq.isread}}</div>
            </div>
          </div>
        </li>
        <li class="lookmore"  @click="loadmore()" v-show="isloadmoreshow">
          点击查看更多
        </li>
      </ul>
    <transition  name="custom-classes-transition"
                 enter-active-class="animated slideInLeft"
                 leave-active-class="animated slideOutRight">
    <div class="singdata" v-show="issingdatashow">
      <div class="singcontent" v-for="item in singdata">
        <div class="from">来自：{{item.senduser}}</div>
        <div class="singinfos">{{item.senduser}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.create_date1}}</div>
        <div class="singcontent0">{{item.content}}</div>
      </div>
      <div class="singbotton" @click="hidesingdata()">返回</div>
    </div>
    </transition>
    <div class="eventzhezhao" v-if="isxxshow">
      <div class="xpoint">startpageY:{{startpageY}}</div>
      <div class="xpoint">endpageY:{{endpageY}}</div>
      <div class="xpoint">moveY:{{moveY}}</div>
      <div class="xpoint">touchstate:{{touchstate}}</div>
      <div class="xpoint">alert:{{alert}}</div>
      <div class="xpoint">getdata:{{getdata}}</div>
    </div>
    <!--<div class="xx" v-if="isxxshow"></div>-->
  </div>
</template>

<script>
  // Math.floor(Math.random()*10)
//  import { Loading } from 'element-ui'
  import { Toast } from 'mint-ui'
  import axios from 'axios'
  const qs = require('qs')
  export default {
    name: 'xiaoxi',
    data () {
      return {
        list: [],
        listiconcolorclass: ['color0', 'color1', 'color2', 'color3'],
        colorindex: -1,
        uselist: [],
        touchscrolltop: 0,
        startpageY: 0,
        endpageY: 0,
        moveY: 0,
        alert: 0,
        touchstate: '',
        isxxshow: false,
        isActive: false,
        getdata: false,
        tips: '下拉刷新',
        pageindex: 1,
        isloadmoreshow: true,
        fullscreenLoading: false,
        singdata: [],
        issingdatashow: false,
        loading: false,
        isloadlishow: false,
        iskongshow: true,
        ifkong: '当前暂无消息'
      }
    },
    mounted: function () {
      console.log('zy')
      this.$emit('mountedcomplete')
      this.setbgcolorrandom()
      this.getnewslistdata(1)
      var element = this.$el.children[0]
      console.clear()
      console.log(element)
      element.addEventListener('touchstart', this.touchstart, false)
      element.addEventListener('touchmove', this.touchmove, false)
      element.addEventListener('touchend', this.touchend, false)
      element.addEventListener('touchcancel', this.touchcancel, false)
    },
    methods: {
      setbgcolorrandom: function () {
        var ran = Math.floor(Math.random() * 3)
        this.colorindex = ran
        for (var i = 0; i < this.list.length; i++) {
          console.log(this.list[i])
          var qq = this.list[i]
          this.colorindex = this.colorindex + 1
          var ww = this.colorindex
          if (this.colorindex >= 3) {
            this.colorindex = -1
          }
          var xx = {qq, ww}
          this.uselist.push(xx)
        }
        console.log(this.uselist)
      },
      touchstart: function (event) {
       // console.log(event)
        this.getdata = false
        this.moveY = 0
        this.startpageY = event.touches[0].pageY
        this.touchstate = 'touchstart'
        this.tips = '下拉刷新'
        // event.preventDefault()
      },
      touchmove: function (event) {
        this.touchstate = 'touchmove'
        this.isloadlishow = true
        this.moveY = event.touches[0].pageY - this.startpageY
        this.endpageY = event.touches[0].pageY
        this.pagey = event.touches[0].pageY
        this.isActive = false
        var loadwrap = this.$el.children[0].children[0]
        if (this.moveY > 0 && event.touches[0].pageY - event.touches[0].clientY === 0) {
          loadwrap.style.height = this.moveY + 'px'
          event.preventDefault()
          if (this.moveY >= 100) {
            this.alert = 'ok'
            this.tips = '松手即可刷新'
          } else {
            this.tips = '下拉刷新'
          }
        }
      },
      touchend: function () {
        if (this.moveY >= 100 && this.alert === 'ok') {
          this.alert = 'ok'
          console.log('okonce')
          this.tips = '正在刷新...'
          this.list = []
          this.uselist = []
          this.pageindex = 1
          this.isloadmoreshow = true
          this.getnewslistdata(1)
          this.isloadlishow = false
        } else {
          this.touchstate = 'touchend'
          var loadwrap = this.$el.children[0].children[0]
          this.isActive = true
          this.alert = 'no'
          loadwrap.style.height = 0 + 'px'
        }
      },
      touchcancel: function (event) {
        event.preventDefault()
        console.log(event)
        this.touchstate = 'touchcancel'
//        alert(this.alert)
        if (this.moveY >= 100 && this.alert === 'ok') {
          this.alert = 'ok'
          console.log('okonce')
          this.tips = '正在刷新...'
          this.list = []
          this.uselist = []
          this.pageindex = 1
          this.getnewslistdata(1)
          this.isloadlishow = false
        } else {
          var loadwrap = this.$el.children[0].children[0]
          this.isActive = true
          this.alert = 'no'
          loadwrap.style.height = 0 + 'px'
        }
      },
      getnewslistdata: function (index) {
        var that = this
        this.loading = true
//        let loadingInstance1 = Loading.service({ fullscreen: true })
        var url = '/sms-wx/assessController.do?getMessage'
        axios.post(url, qs.stringify({pageindex: index, pagesize: '12'})).then(function (data) {
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                if (data.data.msg !== '' && data.data.msg !== null && data.data.msg !== 'null' && data.data.msg !== undefined && data.data.msg !== 'undefined') {
                  console.log(data.data.msg)
                  var datamsg = JSON.parse(data.data.msg)
                  for (var i = 0; i < datamsg.length; i++) {
                    var isread
                    var color
                    if (datamsg[i].isread === 'N') {
                      isread = '未读'
                      color = 'color:#1D90E6'
                    } else if (datamsg[i].isread === 'Y') {
                      isread = '已读'
                      color = 'color:#bbb'
                    }
                    var firstz = datamsg[i].senduser.substr(0, 1)
                    var singdata = {
                      id: datamsg[i].id,
                      create_date1: datamsg[i].create_date1,
                      content: datamsg[i].content,
                      senduser: datamsg[i].senduser,
                      sendtype: datamsg[i].datamsg,
                      isread: isread,
                      firstz: firstz,
                      color: color
                    }
                    if (data.data.obj <= that.uselist.length) {
                      that.isloadmoreshow = false
                      Toast({
                        message: '已经加载全部内容!',
                        position: 'middle',
                        duration: 1000
                      })
                    } else {
                      that.list.push(singdata)
                    }
                  }
                  if (data.data.obj <= that.uselist.length) {
                    that.isloadmoreshow = false
                    Toast({
                      message: '已经加载全部内容!',
                      position: 'middle',
                      duration: 1000
                    })
                  } else {
                    that.uselist = []
                    that.setbgcolorrandom()
                  }
                  that.loading = false
                  console.log(that.list)
                  that.touchstate = 'touchend'
                  var loadwrap = that.$el.children[0].children[0]
                  that.isActive = true
                  that.alert = 'no'
                  loadwrap.style.height = 0 + 'px'
                  that.getdata = 'ok'
//                  loadingInstance1.close()
                  that.tips = '已刷新！'
                }
              }
            }
          }
        })
      },
      loadmore: function () {
        this.pageindex++
        this.getnewslistdata(this.pageindex)
      },
      lookmore: function (index) {
        var that = this
        this.singdata = []
        var pid = this.uselist[index].qq.id
        var url = '/sms-wx/assessController.do?updateReadStatusByMessage'
        if (that.uselist[index].qq.isread === '未读') {
          axios.post(url, qs.stringify({pid: pid})).then(function (data) {
            console.log(data)
            if (typeof data.data === 'object') {
              if (data.data.obj === 'needlogin') {
//                window.localStorage.clear()
                that.$router.push('/dist/zhuye')
              } else {
                if (data.data.success === true) {
                  that.issingdatashow = true
                  var sing = {
                    content: that.uselist[index].qq.content,
                    create_date1: that.uselist[index].qq.create_date1,
                    senduser: that.uselist[index].qq.senduser
                  }
                  that.singdata.push(sing)
                  that.uselist[index].qq.color = 'color:#bbb'
                  that.uselist[index].qq.isread = '已读'
                }
              }
            }
          })
        } else {
          that.issingdatashow = true
          that.issingdatashow = true
          var sing = {
            content: that.uselist[index].qq.content,
            create_date1: that.uselist[index].qq.create_date1,
            senduser: that.uselist[index].qq.senduser
          }
          that.singdata.push(sing)
        }
      },
      hidesingdata: function () {
        this.issingdatashow = false
      }
    },
    watch: {
      colorindex: function (newval, oldval) {
        if (newval > 3) {
          this.colorindex = 0
         // alert(newval)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .xiaoxi{
   width:100%;
   height:100%;
   padding-bottom:76px;
    overflow: scroll;
   /*background-color: #1c8de0;*/

 }
 li{
   width:100%;
   height:71px;
   position: relative;
 }
 .loadmore{
   width:100%;
   height:100%;
   position: relative;
   /*background-color: red;*/
 }
  .linewrap{
    height:70px;
    width:100%;
    background-color:#fff;
    border-bottom: 1px solid #eee;
    position:absolute;
    top:0px;
  }
 .linewrap:active{
   height:70px;
   width:100%;
   background-color:#f5f5f5;
   border-bottom: 1px solid #eee;
   position:absolute;
   top:0px;
 }
  .icons{
    height:50px;
    width:50px;
    background-color:red;
    position: absolute;
    top:10px;
    left:15px;
    border-radius:24px;
    line-height:50px;
    font-size:20px;
    color:#fff;
    font-weight: 500;
  }
  .color0{
    background-color:#37ACFE;
  }
 .color1{
   background-color:#82CB2A;
 }
 .color2{
   background-color:#1AC4BA;
 }
 .color3{
   background-color:#488AFB;
 }
  .infos{
    width:calc(100% - 80px);
    height:50px;
    /*background-color:#00ffff;*/
    position:absolute;
    top:10px;
    left:80px;
  }
  .titleinfo{
    height:50px;
    width:calc(100% - 100px);
    /*background-color:#00ff00;*/
    position:relative;
  }
  .title{
    width:100%;
    height:26px;
    /*background-color:#1c8de0;*/
    position:absolute;
    text-align: left;
    line-height: 26px;
    font-size:18px;
    color: #333;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .cont{
    width:100%;
    height:24px;
    /*background-color:#0000ff;*/
    position:absolute;
    top:24px;
    text-align: left;
    line-height: 24px;
    font-size:14px;
    color:#999;
    overflow:hidden;text-overflow:ellipsis;
  }
 .timeinfo{
   width:100px;
   height:26px;
   /*background-color:#00ff00;*/
   position:absolute;
   top:0px;
   right:0px;
   line-height: 26px;
   font-size:14px;
   color:#bbb;
 }
  .refdot{
    width:70px;
    height:24px;
    position: absolute;
    top:26px;
    right:0px;
    border-radius:7px;
    color:#37ACFE;
    font-size:14px;
    line-height:24px;
    font-weight: 500;
  }
  .eventzhezhao{
    width:250px;
    padding:10px 0px 15px 0px;
    background-color: rgba(0,0,0,0.7);
    position:fixed;
    top:250px;
    left:30px;
    border-radius: 5px;
    -webkit-box-shadow: 2px 2px 10px 1px rgba(0,0,0,0.5);
  }
  .xpoint{
    height:10px;
    width:100%;
    color:#fff;
    text-align: left;
    margin-top:5px;
    margin-bottom:5px;
    margin-left:10px;
    font-size:13px;
    font-weight:900;
  }
  .xx{
    height:30px;
    width:100%;
    border-radius: 0px;
    background-color:#fff;
    /*-webkit-box-shadow: 1px 1px 4px 1px rgba(0,0,0,0.3);*/
    line-height:30px;
    z-index:999;
    border-bottom:1px solid #ccc;
    color:#000;
    font-size:13px;
  }
 .loadli{
   width:100%;
   height:0px;
   background-color: #fff;
   -webkit-box-shadow: 0px 1px 10px 1px rgba(0,0,0,0.3) inset;
   position: relative;
 }

  .loadlianimate{
    transition:all .5s ease;
  }
  .loadlicon{
    height:40px;
    width:100%;

    border-radius: 20px;
    position: absolute;
    top:calc(50% - 10px);
    text-align: center;
    /*text-shadow:  3px 3px 1px rgba(0,0,0,0.3);*/
  }
  .lookmore{
    height:50px;
    width:100%;
    font-size:16px;
    line-height: 50px;
    color:cornflowerblue;
  }
 .lookmore:active{
   height:50px;
   width:100%;
   background-color:#eee;
   font-size:16px;
   line-height: 50px;
   color:#999;
 }
.singdata{
  width:100%;
  height:100%;
  z-index: 100;
  position:fixed;
  top:0px;
  background-color:#fff;
}
  .singcontent{
    width:100%;
    height:calc(100% - 60px);
    padding-bottom:60px;
    z-index: 100;
    position:fixed;
    top:0px;
    background-color:#fff;
    z-index:2;
  }
  .from{
    width:90%;
    height:30px;
    font-size: 18px;
    /*border:1px solid red;*/
    margin-top:0px;
    z-index:4;
    margin-left:5%;
    text-align: left;
    line-height:50px;
    font-weight: 600;
  }
  .singinfos{
    width:90%;
    height:20px;
    font-size: 14px;
    /*border:1px solid red;*/
    margin-top:0px;
    z-index:4;
    margin-left:5%;
    text-align: left;
    line-height:50px;
    font-weight: normal;
    color:#999;
  }
  .singcontent0{
    width:80%;
    height:20px;
    font-size: 16px;
    /*border:1px solid red;*/
    margin-top:30px;
    z-index:4;
    margin-left:10%;
    text-align: left;
    line-height:50px;
    font-weight: normal;
    color:#000;
  }
  .singbotton{
    width:100%;
    height:50px;
    background-color:#1d90e6;
    color:#fff;
    position:fixed;
    bottom:0px;
    z-index:3;
    line-height: 50px;
  }
  /*#79BDF0*/
 .singbotton:hover{
   width:100%;
   height:50px;
   background-color:#79BDF0;
   color:#fff;
   position:fixed;
   bottom:0px;
   z-index:3;
   line-height: 50px;
 }
 .singbotton:active{
   width:100%;
   height:50px;
   background-color:#79BDF0;
   color:#fff;
   position:fixed;
   bottom:0px;
   z-index:3;
   line-height: 50px;
 }
  .ifkong{
    width:100%;
    height:50px;
    line-height: 50px;
    margin-top:50%;
  }
</style>
