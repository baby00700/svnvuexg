<template>
  <div class="kaoheckakan"  v-loading="loading" >
    <div class="search" style="z-index: 99">
      <div class="statusearch" @click="showpop">
        <span>{{selshzt}}</span>
        <i class="el-icon-arrow-down" style="font-size: 12px;margin-left: 3px;"></i>
      </div>
      <div class="xhsearch">
        <input type="text" placeholder=" 请选择状态或输入学号查询" v-model="xh">
      </div>
      <div class="searchbotton" @click="searchbut()">查询</div>
    </div>
    <div class="showtips" v-show="istipsshow">请点击选择审核状态进行筛选</div>
    <div class="boxview" style="z-index: 1">
      <div class="count">总人数：{{count}}</div>
      <div class="line" v-for="(item, $index) in datalist">
        <div class="leftview">
          <div class="topinfo">学号：{{item.xh}}</div>
          <div class="botinfo">申请时间：{{item.sqrq}}</div>
        </div>
        <div class="rightview">
          <div class="topinfo">姓名：{{item.xm}}</div>
          <div class="botinfo" style="margin-top: 18px;" v-if="item.isswitchshow"><el-switch
            v-model="item.status"
            on-color="#13ce66"
            off-color="#ff4949"
            on-text="通过"
            off-text="拒绝"
            on-value="1"
            off-value="2"
            class="swich">
          </el-switch></div>
        </div>
        <div class="bottomview">审核状态：<span :style="item.color">{{item.statuswz}}</span></div>
      </div>
      <div class="loadmore" @click="loadmore()" v-show="isloadmoreshow">加载更多...</div>
    </div >
    <div class="tijiao" style="z-index: 10" v-if="isbottomshow">
      <div class="goReturn" @click="hidechakan()" v-if="goSubmit">返回</div>
      <div class="goSubmit" @click="submitpagedata()" v-if="goSubmit">提交本页</div>
      <div class="goSubmit" style="width:100%" v-if="goSubmit2"><mt-spinner color="#fff" type="triple-bounce" ></mt-spinner></div>
    </div>
    <div class="tijiao" style="z-index: 10" v-if="isbackbottonshow">
      <div class="goReturn" @click="hidechakan()" style="width: 100%;background-color:#1D90E6;color:#fff;">返回</div>

    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom"
    style="width:100%;">
      <mt-picker :slots="slots" @change="onValuesChange" :visibleItemCount="3"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Popup, Picker, Toast, Spinner } from 'mint-ui'
  import axios from 'axios'
  const qs = require('qs')
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)
  Vue.component(Spinner.name, Spinner)
  export default {
    name: 'kaoheckakan',
    data () {
      return {
        selshzt: '',
        status: '',
        istg: '1',
        checked: false,
        istipsshow: false,
        datalist: [],
        loading: false,
        popupVisible: false,
        slots: [
          {
            flex: 1,
            values: ['待审核', '已通过', '已拒绝'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        picker: '',
        pageindex: 1,
        pid: '',
        isloadmoreshow: true,
        isbottomshow: false,
        xh: '',
        submitdatalist: [],
        count: 0,
        goSubmit: true,
        goSubmit2: false
      }
    },
    computed: {
      isbackbottonshow: function () {
        return !this.isbottomshow
      }
    },
    created: function () {
      this.sftg = '1'
    },
    mounted: function () {
      this.selshzt = '请选择'
//      this.picker.setSlotValue(0, '待审核')
    },
    props: ['chakandata'],
    methods: {
      onValuesChange (picker, values) {
        this.pageindex = 1
        this.picker = picker
        this.selshzt = values[0]
        if (values[0] === '待审核') {
          this.status = 0
          this.isbottomshow = false
          this.pid = this.chakandata[0].id
        } else if (values[0] === '已通过') {
          this.status = 1
          this.isbottomshow = false
          this.pid = this.chakandata[0].id
        } else if (values[0] === '已拒绝') {
          this.status = 2
          this.isbottomshow = false
          this.pid = this.chakandata[0].id
        }
        this.datalist = []
        this.xh = ''
//        this.getchakanlist(this.pid, this.pageindex, this.xh, this.status)
        if (this.pid !== '') {
          this.getchakanlist(this.pid, this.pageindex, this.xh, this.status)
        }
      },
      hidechakan: function () {
        this.$emit('hidechakan')
        this.datalist = []
        this.count = 0
        this.istipsshow = false
        this.isbottomshow = false
      },
      getchakanlist: function (id, index, xh, status) {
        var that = this
        if (this.datalist.length === 0) {
          this.loading = true
        } else {
          this.loading = false
        }
        var url = '/sms-wx/assessController.do?getListAccessDetail'
        axios.post(url, qs.stringify({status: status, xh: xh, pid: id, pageindex: index, pagesize: 10})).then(function (data) {
//          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              that.$router.push('/dist/zhuye')
              that.location.reload(true)
            } else {
              if (data.data.success === true) {
                that.count = data.data.obj
                if (data.data.obj <= that.datalist.length) {
                  that.istipsshow = false
                  that.isloadmoreshow = false
                  Toast({
                    message: '当前暂无更多数据',
                    position: 'middle',
                    duration: 5000
                  })
                } else {
                  var datamsg = JSON.parse(data.data.msg)
//                  console.log(datamsg)
                  if (datamsg.length === 0) {
                    that.istipsshow = false
                    that.isloadmoreshow = false
                    Toast({
                      message: '当前暂无更多数据',
                      position: 'middle',
                      duration: 5000
                    })
                  } else {
                    that.istipsshow = false
                    if (that.status === 0) {
                      that.isbottomshow = true
                    }
                    for (var i = 0; i < datamsg.length; i++) {
                      var status = '1'
                      var statuswz
                      var isswitchshow
                      var color
                      if (datamsg[i].status === 0) {
                        statuswz = '待审核'
                        color = 'color:#4BA8EB'
                      } else if (datamsg[i].status === 1) {
                        statuswz = '已通过'
                        color = 'color:#55C500'
                      } else if (datamsg[i].status === 2) {
                        statuswz = '已拒绝'
                        color = 'color:#CC0033'
                      }
                      if (datamsg[i].status === 1 || datamsg[i].status === 2) {
                        isswitchshow = false
                      } else if (datamsg[i].status === 0) {
                        isswitchshow = true
                      }
                      var singdata = {
                        addscore: datamsg[i].addscore,
                        score: datamsg[i].score,
                        status: status,
                        xh: datamsg[i].xh,
                        xm: datamsg[i].xm,
                        sqrq: datamsg[i].sqrq,
                        statuswz: statuswz,
                        id: datamsg[i].id,
                        isswitchshow: isswitchshow,
                        color: color
                      }
//                      console.log(singdata)
                      that.datalist.push(singdata)
                    }
                    if (data.data.obj <= that.datalist.length) {
//                      alert(that.isloadmoreshow + '****')
                      that.istipsshow = false
                      that.isloadmoreshow = false
                      Toast({
                        message: '已经加载全部数据',
                        position: 'middle',
                        duration: 5000
                      })
                    } else {
//                      alert(that.isloadmoreshow + '//')
                      that.isloadmoreshow = true
                    }
                  }
                }
                that.loading = false
              }
            }
          }
        })
      },
      showpop: function () {
        this.popupVisible = true
      },
      loadmore: function () {
        this.pageindex++
        this.getchakanlist(this.pid, this.pageindex, this.xh, this.status)
      },
      searchbut: function () {
        this.datalist = []
        this.getchakanlist(this.pid, this.pageindex, this.xh, this.status)
      },
      submitpagedata: function () {
        this.goSubmit = false
        this.goSubmit2 = true
//        console.log(this.datalist.length)
        this.submitdatalist = []
        var that = this
        for (var i = 0; i < this.datalist.length; i++) {
          var datalist = {
            id: this.datalist[i].id,
            status: this.datalist[i].status
          }
          this.submitdatalist.push(datalist)
        }
        var pushdatalist = JSON.stringify(that.submitdatalist)
        var dataall = {
          tlist: pushdatalist
        }
        var url = '/sms-wx/assessController.do?updateAssessListStatus'
        axios.post(url, qs.stringify(dataall)).then(function (data) {
//          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              that.$router.push('/dist/zhuye')
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                setTimeout(function () {
                  Toast({
                    message: '提交成功！',
                    position: 'middle',
                    duration: 5000
                  })
                  that.goSubmit = true
                  that.goSubmit2 = false
                  that.count = 0
                }, 500)
              } else {
                setTimeout(function () {
                  Toast({
                    message: '提交失败！',
                    position: 'middle',
                    duration: 5000
                  })
                  that.goSubmit = true
                  that.goSubmit2 = false
                  that.count = 0
                }, 500)
              }
            }
          }
        })
        this.datalist = []
      }
    },
    watch: {
      chakandata: function (newval) {
//        console.log(newval)
        alert(this.chakandata)
        this.pid = newval[0].id
//        this.getchakanlist(newval[0].id, 1)
      },
      datalist: function (newval) {
        if (newval.length === 0) {
          this.isloadmoreshow = false
        }
      },
      isloadmoreshow: function () {
//        alert(this.isloadmoreshow)
      }
    }
  }
</script>
<style>
  .el-checkbox__input{
    float: right;
    margin-top: 2px;
    margin-left: 2px;
  }
</style>
<style>
  .picker-item{
    color:#ccc !important;
  }
  .picker-selected{
    color:#1d90e6 !important;
    font-weight:500 !important;
    /*background-color: rgba(0,0,0,0.1) !important;*/
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .kaoheckakan{ width:100%; height:100%; z-index:100; overflow:scroll; background:#ecedf1;position:fixed;top:0px;left:0px;}
  .boxview{ padding-bottom:55px;margin-top:42px;}
  .line{
    position: relative;height:72px; background:#fff; padding:12px 15px; border-bottom:1px solid #eee;margin-top: 0px;}
  .leftview{ float:left; width:auto; height:48px; text-align:left;}
  .rightview{ float:right; width:auto; height:48px; text-align:right;}
  .topinfo{ height:24px; line-height:24px; font-size:16px; color:#333;}
  .botinfo{ height:24px; line-height:24px; font-size:14px; color:#999;margin-top: 5px;}
  .tijiao{ position:fixed; bottom:0px; width:100%; height:50px; line-height:50px; font-size:16px; text-align:center;}
  .goReturn{ float:left; width:50%; height:50px; background:#ccc; color:#000;}
  .goSubmit{ float:left; width:50%; height:50px; background:#1d90e6; color:#fff;}
  .bottomview{
    height:24px;
    margin-top:5px;
    float: left;
    line-height:24px;
    font-size:14px;
    color:#999;
    position:absolute;
    top:60px;
  }
  .showtips{
    /*background-color:red;*/
    height:30px;
    width:100%;
    margin-top:calc(50% - 15px);
    color:#555;
  }
  .search{
    height:40px;
    width:100%;
    background-color:#fff;
    border-bottom:1px solid #eee;
    position:fixed;
  }
  .statusearch{
    height:40px;
    width:80px;
    margin-left:5px;
    color:#1d90e6;
    font-size:14px;
    line-height:40px;
    float: left;
    /*background-color:red;*/
  }
  .xhsearch{
    float: left;
    margin-left:0px;
    position:absolute;
    width:calc(100% - 140px);
    height:40px;
    left:85px;
    top:0px;

  }
  .xhsearch input{
    width:calc(100%);
    height:30px;
    border:0;
    border: 1px solid #79BEF0;
    margin-top:4px;
    border-radius: 3px;
  }
  .searchbotton{
    width:40px;
    height:30px;
    margin-top:6px;
    float: right;
    margin-right:10px;
    font-size:15px;
    line-height: 30px;
    color:#1d90e6;
  }
  .searchbotton:active{
    width:40px;
    height:30px;
    margin-top:6px;
    float: right;
    margin-right:10px;
    font-size:15px;
    line-height: 30px;
    color:#ccc;
  }
  .loadmore{
    height:20px;
    width:100%;
    line-height: 20px;
    font-size:14px;
    color:#1d90e6;
    margin-top:3px;
  }
  .count{
    width:calc(100% - 15px);
    padding-left:15px;
    height:30px;
    background-color:#fff;
    border-bottom:1px solid #eee;
    font-size: 14px;
    color:#555;
    line-height: 30px;
    text-align: left;
  }
</style>
