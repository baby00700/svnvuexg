<template>
  <div class="fazhankaohe"   v-loading.fullscreen.lock="fullscreenLoading">

    <transition  name="custom-classes-transition" mode="out-in"
                 enter-active-class="animated fadeInUp"
                 leave-active-class="animated fadeOutDown">
    <div class="boxview" style="position:absolute;" v-if="isboxviewshow">
      <div class="view" style="border-bottom:1px solid #eee;border-top:1px solid #eee;z-index:0" v-for="(item, $index) in khlist">
        <div class="line">
          <div class="khtitle">{{item.title}}</div>
          <div class="khorigin">发起人：{{xm}}</div>
        </div>
        <div class="list">
          <div class="Row">
            <div class="listleft">默认分值：{{item.score}}</div>
            <div class="listright">
              <div class="state">{{item.status}}</div>
              <div style="width:60px;height:30px;position:absolute;right:0px;top:0px;">
                <el-switch
                  v-model="item.iskhopen"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  style="position:absolute;top:4px;right:-1px;font-size: 13px !important;"
                  @change="iskhopen($index)"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div class="datetime">考核开始时间：{{item.startdate}}</div>
          <div class="datetime">考核结束时间：{{item.enddate}}</div>
          <div class="caozuo">
            <div class="operation" @click="qiandaoma($index)">生成签到码</div>
            <div class="operation" @click="dafen($index)">打分</div>
            <div class="operation"@click="chakan($index)">查看</div>
          </div>
        </div>
      </div>
      <div class="view" v-if="isloadmoreshow" style="color:#1d90e6;height:20px;font-size: 14px;background-color: rgba(0,0,0,0)" @click="loadmore()">加载更多</div>
      <div class="bottons" style="z-index:11">
        <div class="goback" @click="goBack()">返回主页</div>
        <div class="goadd" @click="faqi()">发起考核</div>
      </div>
    </div>
    </transition>

    <transition  name="custom-classes-transition" mode="out-in"
                 enter-active-class="animated fadeInUp"
                 leave-active-class="animated fadeOutDown">
      <div class="chakan" v-if="ischakanviewshow" style="z-index:99;positison:fixed;height:100%;width:100%;">
        <chakanview v-on:hidechakan="hidechakanview()" :chakandata="chakandata"></chakanview>
      </div>
    </transition>
    <transition  name="custom-classes-transition" mode="out-in"
                 enter-active-class="animated fadeInUp"
                 leave-active-class="animated fadeOutDown">
      <div class="dafen" v-if="isdafenviewshow" style="z-index:99;positison:fixed;height:100%;width:100%;">
        <dafenview v-on:hidedafen="hidedafenview()" :chakandata="chakandata"></dafenview>
      </div>
    </transition>
    <transition  name="custom-classes-transition" mode="out-in"
                 enter-active-class="animated fadeInLeft"
                 leave-active-class="animated fadeOutDown">
      <div class="faqi" v-if="isfaqiviewshow" style="z-index:99;positison:fixed;height:100%;width:100%;">
        <faqiview v-on:hidefaqi="hidefaqiview()"></faqiview>
      </div>
    </transition>
  </div>
</template>

<script>
  import chakanview from '@/components/fazhankaohe/chakan'
  import dafenview from '@/components/fazhankaohe/dafen'
  import faqiview from '@/components/fazhankaohe/faqikaohe'
//  import Vue from 'vue'
  import { Toast } from 'mint-ui'
  import axios from 'axios'
//  Vue.component(Switch.name, Switch)
  const qs = require('qs')
  export default {
    name: 'fazhankaohe',
    data () {
      return {
        khlist: [],
        ischakanviewshow: false,
        chakandata: [],
        pageindex: 1,
        isdafenviewshow: false,
        isfaqiviewshow: false,
        isboxviewshow: true,
        fullscreenLoading: false,
        isloadmoreshow: true
      }
    },
    created: function () {
      this.getselfinfo()
      this.getAssessListByUser('1')
    },
    mounted: function () {
    },
    methods: {
      getselfinfo: function () {
        var selfinfo = window.localStorage.getItem('selfinfo')
        selfinfo = JSON.parse(selfinfo)
        console.log(selfinfo)
        this.xm = selfinfo.userName
      },
      getAssessListByUser: function (index) {
        var that = this
        var url = '/sms-wx/assessController.do?getListAccess'
        axios.post(url, qs.stringify({pageindex: index, pagesize: 4})).then(function (data) {
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
                    console.log(datamsg[i])
                    var status
                    var iskhopen = false
                    if (datamsg[i].status === '1') {
                      status = '未开始'
                      iskhopen = false
                    } else if (datamsg[i].status === '2') {
                      status = '进行中'
                      iskhopen = true
                    } else if (datamsg[i].status === '3') {
                      status = '已结束'
                      iskhopen = false
                    } else {
                      status = '请刷新'
                    }
                    var singdata = {
                      id: datamsg[i].id,
                      title: datamsg[i].title,
                      startdate: datamsg[i].startdate,
                      enddate: datamsg[i].enddate,
                      score: datamsg[i].score,
                      status: status,
                      iskhopen: iskhopen,
                      isaddscore: datamsg[i].isaddscore
                    }
                    if (data.data.obj <= that.khlist.length) {
                      Toast({
                        message: '已加载全部',
                        position: 'middle',
                        duration: 5000
                      })
                      that.isloadmoreshow = false
                    } else {
                      that.khlist.push(singdata)
                    }
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
      iskhopen: function (index) {
        console.log(index)
        var that = this
        this.fullscreenLoading = true
        var id0 = this.khlist[index].id
        var status0 = this.khlist[index].iskhopen
        if (status0 === true) {
          status0 = '2'
          this.khlist[index].status = '已开始'
//          alert(status0)
        } else if (status0 === false) {
          status0 = '3'
          this.khlist[index].status = '已结束'
//          alert(status0)
        }
        var url = '/sms-wx/assessController.do?sqztsh'
        axios.post(url, qs.stringify({id: id0, status: status0})).then(function (data) {
          console.log(data)
          that.fullscreenLoading = false
        })
      },
      qiandaoma: function (index) {
        console.log(index)
      },
      chakan: function (index) {
        console.log(index)
        this.isboxviewshow = false
        this.ischakanviewshow = true
        this.chakandata = [{
          id: this.khlist[index].id
        }]
      },
      dafen: function (index) {
        this.isboxviewshow = false
        this.isdafenviewshow = true
//        this.isboxviewshow = false
        this.chakandata = [{
          id: this.khlist[index].id,
          isaddscore: this.khlist[index].isaddscore
        }]
      },
      hidechakanview: function () {
        this.isboxviewshow = true
        this.ischakanviewshow = false
      },
      hidedafenview: function () {
        this.isboxviewshow = true
        this.isdafenviewshow = false
      },
      faqi: function () {
        this.isboxviewshow = false
        this.isfaqiviewshow = true
//        this.isboxviewshow = false
      },
      hidefaqiview: function () {
        this.isboxviewshow = true
        this.isfaqiviewshow = false
        this.khlist = []
        this.getAssessListByUser('1')
      },
      loadmore: function () {
        console.log(this.pageindex)
        this.pageindex++
        this.getAssessListByUser(this.pageindex)
      }
    },
    watch: {
    },
    components: {
      chakanview: chakanview,
      dafenview: dafenview,
      faqiview: faqiview
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
  .operation{ float:right; margin-left:5px; display:block; height:22px; line-height:24px; border-radius:30px; border:1px solid #38adff; color:#38adff; padding:0px 12px;}
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
    width:50%;
    height:50px;
    background-color:#ccc;
    float: left;
  }

  .goback:active{
    width:50%;
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

</style>
