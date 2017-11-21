<template>
  <div class="kaoheliushui" >
    <div class="selfinfo">
      <div class="topinfo">
        <div class="xm0">姓名:<span style="color:#1d90e6">{{xm}}</span></div>
        <div class="xh">{{usertypename}}:<span style="color:#1d90e6">{{hm}}</span></div>
      </div>
    </div>
    <div class="listwrap">
      <div class="baseline" v-for="item in datalist">
        <div class="linetop">
          <div class="left">日期：{{item.create_date1}}</div>
          <div class="right">得分:{{item.score}}分</div>
        </div>
        <div class="linebottom">{{item.remark}}</div>
      </div>
      <div class="loadmore" style="color:#1d90e6;line-height:40px;height:40px;font-size: 15px;margin-top:5px;" @click="loadmore()" v-show="isloadmoreshow">点击加载更多</div>
    </div>
    <div class="bottons" @click="goback()">返回</div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {Toast} from 'mint-ui'
  const qs = require('qs')
  export default {
    name: 'kaoheliushui',
    data () {
      return {
        xm: '',
        usertypename: '',
        hm: '',
        datalist: [],
        pageindex: 1,
        isloadmoreshow: true
      }
    },
    created: function () {
      this.getselfinfo()
      this.getdatalist(1)
    },
    mounted: function () {
    },
    methods: {
      getselfinfo: function () {
        var selfinfo = window.localStorage.getItem('selfinfo')
        selfinfo = JSON.parse(selfinfo)
        this.xm = selfinfo.userName
        if (selfinfo.usertype === '0') {
          this.usertypename = '学号'
        } else {
          this.usertypename = '工号'
        }
        this.hm = selfinfo.userCode
      },
      getdatalist: function (index) {
        var that = this
        var url = '/sms-wx/assessController.do?khls'
        axios.post(url, qs.stringify({pageindex: index, pagesize: 8})).then(function (data) {
          console.clear()
          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                var datamsg = JSON.parse(data.data.msg)
                console.log(datamsg)
                for (var i = 0; i < datamsg.length; i++) {
                  var singsata = {
                    create_date1: datamsg[i].create_date1,
                    projectname: datamsg[i].projectname,
                    remark: datamsg[i].projectname + ' ' + datamsg[i].remark,
                    score: datamsg[i].score
                  }
                  that.datalist.push(singsata)
                  if (data.data.obj <= that.datalist.length) {
                    that.isloadmoreshow = false
                    Toast({
                      message: '已经加载全部内容!',
                      position: 'bottom',
                      duration: 3000
                    })
                  }
                }
                console.log(that.datalist)
              }
            }
          }
        })
      },
      goback: function () {
        window.history.back()
      },
      loadmore: function () {
        this.pageindex++
        this.getdatalist(this.pageindex)
      }
    },
    watch: {
    },
    components: {
    }
  }
</script>


<style scoped>
  .topinfo{
    height:40px;
    width:100%;
    background-color:#fff;
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    font-size: 15px;
    position: fixed;
    top:0px;
  }
  .xm0{
    height:40px;
    width:45%;
    /*background-color:red;*/
    margin-left:5%;
    float: left;
    text-align: left;
  }
  .xh{
    height:40px;
    width:45%;
    /*background-color:green;*/
    float: left;
    text-align: right;
  }
  .kaoheliushui{
    width:100%;
    height:100%;
    z-index:100;
    background-color:#ecedf1;
    overflow: scroll;
  }
  .listwrap{
    width:100%;
    height:auto;
    overflow: scroll;
    padding-bottom:60px;
    margin-top:46px;
  }
  .bottons{
    width:100%;
    height:50px;
    background-color:#1d90e6;
    color:#fff;
    line-height: 50px;
    position:fixed;
    bottom:0px;
  }
  .baseline{
    width:100%;
    border-bottom:1px solid #ccc;
    background-color:#fff;
    margin-top:5px;
  }
  .linetop{
    width:90%;
    height:40px;
    margin-left: 5%;
    line-height: 40px;
    border-bottom:1px solid #eee;
  }
 .left{
   width:50%;
   float: left;
   text-align: left;
 }
  .right{
    width:50%;
    float: left;
    text-align: right;
  }
  .linebottom{
    height:40px;
    width:90%;
    overflow: scroll;
    font-size:14px;
    color:#999;
    text-align: left;
    margin-left: 5%;
    padding-top:15px;
  }
  textarea{
    width:90%;
    height:50px;
    border:none;
    font-size: 15px;
    color:#999;
    resize: none;
  }
</style>
