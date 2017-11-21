<template>
  <div class="fazhankaohe"   v-loading.fullscreen.lock="fullscreenLoading">
    <div class="view" v-for="(item, $index) in khlist">
      <div class="line">
        <div class="khtitle">{{item.title}}</div>
        <div class="khorigin">发起人：{{item.create_name}}</div>
      </div>
      <div class="list">
        <div class="Row">
          <div class="listleft">默认分值：{{item.mrfz}}</div>
          <div class="listright">
            <div class="stuState">{{item.statuswz}}</div>
          </div>
        </div>
        <div class="datetime">考核开始时间：{{item.startdate}}</div>
        <div class="datetime">考核结束时间：{{item.enddate}}</div>
        <div class="caozuo">
          <div class="operation" id="chakan" @click="showindex($index)">查看</div>
          <div class="operation" id="shenqing" @click="saveparticipant($index)" v-show="item.isshenqingshow">申请</div>
          <div class="operation" id="zaicishenqing" @click="zcsaveparticipant($index)"  style="width:66px" v-show="item.iszcshenqingshow">再次申请</div>
        </div>
      </div>
    </div>
    <div class="view" style="color:#1d90e6;width:100%;height:60px;font-size: 14px;background-color:rgba(255,255,255,0.1)">
      <div v-if="isloadmoreshow"  @click="loadmore()">加载更多</div>
    </div>
    <div class="bottons" style="z-index:11">
      <div class="goback" @click="goBack()">返回主页</div>
    </div>
    <transition  name="custom-classes-transition" mode="out-in"
                 enter-active-class="animated fadeIn"
                 leave-active-class="animated fadeOut">
    <div class="content" id="content" style="z-index:111" v-show="iscontentshow"  >
      <span class="closediv" style="z-index:100" @click="close">+</span>
      <div  v-html="contentHtml" style="z-index:1"></div>
    </div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Toast, Spinner } from 'mint-ui'
  import axios from 'axios'
  //  Vue.component(Switch.name, Switch)
  const qs = require('qs')
  Vue.component(Spinner.name, Spinner)
  export default {
    name: 'shenqingkaohe',
    data () {
      return {
        fullscreenLoading: false,
        khlist: [],
        isloadmoreshow: true,
        contentHtml: '',
        iscontentshow: false,
        pageindex: 1

      }
    },
    created: function () {
      this.getAssessListByUser('1')
    },
    mounted: function () {
      console.clear()
    },
    methods: {
      getAssessListByUser: function (index) {
        var that = this
        var url = '/sms-wx/assessController.do?getAssessListByUser'
        axios.post(url, qs.stringify({pageindex: index, pagesize: 10})).then(function (data) {
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                if (data.data.obj <= that.khlist.length) {
                  Toast({
                    message: '已加载全部',
                    position: 'middle',
                    duration: 5000
                  })
                  that.isloadmoreshow = false
                } else {
                  var datamsg = JSON.parse(data.data.msg)
                  for (var i = 0; i < datamsg.length; i++) {
                    var isshenqingshow
                    var statuswz
                    var iszcshenqingshow = false
                    if (datamsg[i].status === '1') {
                      statuswz = '未开始'
                    } else if (datamsg[i].status === '2') {
                      if (datamsg[i].zt === null) {
                        statuswz = '未申请'
                        isshenqingshow = true
                        iszcshenqingshow = false
                      } else if (datamsg[i].zt === 0) {
                        isshenqingshow = false
                        iszcshenqingshow = false
                        statuswz = '已申请'
                      } else if (datamsg[i].zt === 1) {
                        isshenqingshow = false
                        iszcshenqingshow = false
                        statuswz = '已通过'
                        if (datamsg[i].sfdf === 0) {
                          statuswz = '未打分'
                        } else if (datamsg[i].sfdf === 1) {
                          statuswz = '已打分'
                        }
                      } else if (datamsg[i].zt === 2) {
                        isshenqingshow = false
                        statuswz = '未通过'
                        iszcshenqingshow = true
                      }
                    } else if (datamsg[i].status === '3') {
                      statuswz = '已结束'
                      isshenqingshow = false
                      iszcshenqingshow = false
                      if (datamsg[i].sfdf === 0) {
                        statuswz = '未打分'
                        isshenqingshow = false
                        iszcshenqingshow = false
                      } else if (datamsg[i].sfdf === 1) {
                        statuswz = '已打分'
                        isshenqingshow = false
                        iszcshenqingshow = false
                      }
                    }
                    console.log(datamsg[i])
                    var singdata = {
                      applystartdate: datamsg[i].applystartdate,
                      applystartend: datamsg[i].applystartend,
                      content: datamsg[i].content,
                      create_by: datamsg[i].create_by,
                      create_name: datamsg[i].create_name,
                      createdate: datamsg[i].createdate,
                      depent: datamsg[i].depent,
                      enddate: datamsg[i].enddate,
                      fprojectname: datamsg[i].fprojectname,
                      fz: datamsg[i].fz,
                      id: datamsg[i].id,
                      isaddscore: datamsg[i].isaddscore,
                      isapply: datamsg[i].isapply,
                      projectname: datamsg[i].projectname,
                      sfdf: datamsg[i].sfdf,
                      sremark: datamsg[i].sremark,
                      startdate: datamsg[i].startdate,
                      status: datamsg[i].status,
                      title: datamsg[i].title,
                      upscore: datamsg[i].upscore,
                      year: datamsg[i].year,
                      zjfz: datamsg[i].zjfz,
                      zt: datamsg[i].zt,
                      mrfz: datamsg[i].mrfz,
                      isshenqingshow: isshenqingshow,
                      statuswz: statuswz,
                      iszcshenqingshow: iszcshenqingshow
                    }
                    that.khlist.push(singdata)
                  }
                }
              }
            }
          }
        })
      },
      goBack: function () {
        window.history.back()
      },
      loadmore: function () {
        console.log(this.pageindex)
        this.pageindex++
        this.getAssessListByUser(this.pageindex)
      },
      saveparticipant: function (index) {
        console.log('ooo')
        var that = this
        var chakan = document.getElementsByClassName('view')[index].getElementsByClassName('list')[0].getElementsByClassName('caozuo')[0].getElementsByClassName('operation')[1]
        chakan.innerHTML = '<mt-spinner type="double-bounce"></mt-spinner>'
        chakan.style.width = '22' + 'px'
        chakan.style.borderWidth = '1px'
        this.$off('saveparticipant')
        var url = '/sms-wx/assessController.do?saveparticipant'
        var pid0 = this.khlist[index].id
        console.log(pid0)
        axios.post(url, qs.stringify({pid: pid0})).then(function (data) {
          console.log(data)
          chakan.innerHTML = ''
          chakan.style.width = '150' + 'px'
          chakan.innerHTML = '申请成功!'
          chakan.style.fontWeight = '700'
          chakan.style.backgroundColor = '#38adff'
          chakan.style.color = '#fff'
          that.khlist[index].statuswz = '待审核'
          setTimeout(function () {
            chakan.style.width = '3' + 'px'
            chakan.innerHTML = ''
          }, 1500)
          setTimeout(function () {
            chakan.style.display = 'none'
          }, 2000)
        })
      },
      zcsaveparticipant: function (index) {
        var that = this
        var chakan = document.getElementsByClassName('view')[index].getElementsByClassName('list')[0].getElementsByClassName('caozuo')[0].getElementsByClassName('operation')[2]
        chakan.innerHTML = ''
        chakan.style.width = '22' + 'px'
        chakan.style.borderWidth = '1px'
        this.$off('saveparticipant')
        var url = '/sms-wx/assessController.do?saveparticipant'
        var pid0 = this.khlist[index].id
        console.log(pid0)
        axios.post(url, qs.stringify({pid: pid0})).then(function (data) {
          // 动画
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              that.$router.push('/dist/zhuye')
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                chakan.innerHTML = ''
                chakan.style.width = '150' + 'px'
                chakan.innerHTML = '申请成功!'
                chakan.style.fontWeight = '700'
                chakan.style.backgroundColor = '#38adff'
                chakan.style.color = '#fff'
                that.khlist[index].statuswz = '待审核'
                setTimeout(function () {
                  chakan.style.width = '3' + 'px'
                  chakan.innerHTML = ''
                }, 1500)
                setTimeout(function () {
                  chakan.style.display = 'none'
                }, 2000)
              }
            }
          }
        })
      },
      close () {
        this.contentHtml = ''
        this.iscontentshow = false
      },
      showindex (index) {
        this.contentHtml = ''
        this.contentHtml = this.khlist[index].content
        this.iscontentshow = true
        console.clear()
        var screen = document.body.offsetWidth
        setTimeout(function () {
          var div = document.getElementById('content')
          var img = div.getElementsByTagName('img')
          if (img.length > 0) {
            console.log(img)
            for (var i = 0; i < img.length; i++) {
              console.log(img[i])
              img[i].style.width = screen * 0.86 + 'px'
            }
          }
        }, 500)
      }
    },
    watch: {
    },
    components: {
    }
  }
</script>
<style>
</style>

<style scoped>
  .fazhankaohe{ width:100%; height:100%; z-index:100; overflow:scroll; background:#ecedf1;position:fixed;top:0px;left:0px;}
  .boxview{ padding-bottom:50px;position:absolute;width:100%;}
  .view{width:100%; background:#fff; margin-bottom:15px;position:relative}
  .line{ height:45px; line-height:45px; padding:0px 15px; border-bottom:1px solid #eee; color:#333; font-size:16px;}
  .khtitle{ float:left; text-align:left;}
  .khorigin{ float:right; text-align:right;}
  .list{ height:121px; border-bottom:1px solid #eee; font-size:14px; position:relative;}
  .Row{ width:100%; height:30px; position:relative; font-size:13px; line-height:30px; color:#38adff;}
  .listleft{ position:absolute; left:15px; width:calc(50% - 15px); height:30px; text-align:left;}
  .listright{ position:absolute; right:15px; width:calc(50% - 15px); height:30px; text-align:right;}
  .state{ position:absolute; width:50px; height:30px; line-height:30px; right:60px; top:0px;}
  .stuState{ position:absolute; width:50px; height:30px; line-height:30px; right:0px; top:0px;}
  .aniu{ position:absolute; width:60px; height:30px; line-height:30px; right:0px; top:0px;}
  .datetime{ position:relative; padding:0px 15px; height:25px; line-height:25px; font-size:13px; color:#999;text-align: left}
  .caozuo{ position:relative; padding:8px 15px; height:24px; font-size:13px;}
  .operation{ float:right; margin-left:5px; width:44px; height:22px; line-height:24px; border-radius:11px; border:1px solid #38adff; color:#38adff; overflow: hidden;transition: all 0.5s}
  .operation:active{
    background-color:#38adff;
    color:#fff;
  }
  .bottons{
    height:50px;
    width:100%;
    font-size: 16px;
    line-height: 50px;
    position:fixed;
    bottom:0px;
  }
  .goadd{
    background-color:#1d90e6;
    height:50px;
    width:50%;
    float: left;
    color:#fff;
  }
  .goadd:active{
    background-color:#79BDF0;
    height:50px;
    width:50%;
    float: left;
    color:#fff;
  }
  .goback{
    width:100%;
    height:50px;
    background-color:#1d90e6;
    float: left;
    color:#fff;
  }

  .goback:active{
    width:100%;
    height:50px;
    background-color:#bbb;
    float: left;
    color:#000;
  }
  .swich{
    float:right;
    position: relative;
    top:4px;
  }
.content{
  width:100%;
  height:100%;
  position: fixed;
  top:0%;
  left:0%;
  background-color:rgba(0,0,0,0.7);
  overflow: scroll;
  word-wrap: break-word;
  word-break: break-all;
  border-radius: 3px;
}
  .content div{
    height:90%;
    width:86%;
    background-color: #fff;
    padding:4%;
    position: absolute;
    top:3%;
    left:3%;
    border-radius: 5px;
    overflow: scroll;
  }
  .closediv{
    width:20px;
    height:20px;
    position:absolute;
    right:2%;
    top:2%;
    background-color:red;
    border-radius: 10px;
    color:#fff;
    line-height: 20px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  img {
    width: 100px !important;
  }
  .inner-container::-webkit-scrollbar {
    display: none;
  }
  .roate{
    animation: roate360 0.5s;
    animation-iteration-count: infinite
  }
  @keyframes roate360
  {
    from {background: red;}
    to {background: yellow;}
  }
</style>
