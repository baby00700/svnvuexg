<template>
  <div class="newslist">
    <div class="wrapline" v-for="(item, $index) in newslist" @click="toarticle($index)">
      <div class="infoimg">
        <img :src='item.path' alt="" width="100%" height="100%">
      </div>
      <div class="titleinfos">
        <div class="newstitle"><nobr>{{item.notice_title}}</nobr></div>
        <div class="newsinfo">
          <div class="author"><nobr>{{item.create_user}}&nbsp;&nbsp;&nbsp;{{item.create_time}}</nobr></div>
        </div>
      </div >
      <div class="rightarr">
        <div class="arrowright">
          <i class="el-icon-arrow-right" style="color:#999"></i>
        </div>
      </div>
    </div>
    <div class="lookmore" @click="lookmore()"><span style="margin-top:0px;display: inline-block;position:absolute;top:0px;left:calc(50% - 50px);color:#999" >点击查看更多</span><span style="height:20px;width:20px;margin-top:0px;display: inline-block;position:absolute;top:4px;left:calc(50% + 35px);" ><img src="../../../static/img/toright.png" alt="18px" width="18px"></span></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import bus from '@/components/bus.js'   // 事件总线
  const qs = require('qs')
  export default {
    name: 'news',
    data () {
      return {
        newslist: []
      }
    },
    created: function () {
      window.localStorage.setItem('step', 'self')
      var islogin = window.localStorage.getItem('isloginsuccess')
      var step = window.localStorage.getItem('step')
      var that = this
      bus.$on('loginsuccessfromroot', function () {  // 从app触发 从login触发
        that.newslist.splice(0, that.newslist.length)
        that.getnewslistdata()
      })
      console.log('self')
      if (step === 'self') {
        if (islogin === 'true') {
          this.getnewslistdata()
        }
      }
    },
    beforeDestroy: function () {
      let that = this
      bus.$off('loginsuccessfromroot', function () {
        that.newslist.splice(0, that.newslist.length)
        that.getnewslistdata()
      })
    },
    methods: {
      getnewslistdata: function () {
        this.newslist.splice(0, this.newslist.length)
        var url = '/sms-wx/smsUserController.do?getNotice'
        var that = this
        axios.post(url, qs.stringify({pageindex: '1', pagesize: '4', ptype: '3'})).then(function (data) {
          if (typeof data.data === 'object') {
            if (data.data.msg !== '' && data.data.msg !== null && data.data.msg !== 'null' && data.data.msg !== undefined && data.data.msg !== 'undefined') {
              // console.log(data.data.msg)
              if (data.data.obj === 'needlogin') {
                window.localStorage.clear()
                window.location.reload(true)
              } else {
                if (data.data.success === true) {
                  var newslistdata = JSON.parse(data.data.msg)
                  console.log(newslistdata)
                  var imgurl = 'http://192.168.1.155:8080/sms/'
                  for (var i = 0; i < newslistdata.length; i++) {
                    console.log(i)
                    newslistdata[i].path = imgurl + newslistdata[i].path
                    var newsdata = {
                      create_time: newslistdata[i].create_time,
                      create_user: newslistdata[i].create_user,
                      id: newslistdata[i].id,
                      notice_content: newslistdata[i].notice_content,
                      notice_level: newslistdata[i].notice_level,
                      notice_title: newslistdata[i].notice_title,
                      notice_type: newslistdata[i].notice_type,
                      path: newslistdata[i].path
                    }
                    that.newslist.push(newsdata)
                  }
                }
              }
              console.log(that.newslist)
            }
          }
        })
      },
      lookmore: function () {
        console.log('ss')
        window.location.href = 'http://192.168.1.155:8081/sms-wx/smsUserController.do?getNoticeToListPage&ptype=3'
      },
      toarticle: function (index) {
        console.log(index)
        var commonurl = 'http://192.168.1.155:8081/sms-wx/smsUserController.do?pageList&articleid=' + this.newslist[index].id
        window.location.href = commonurl
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .newslist{
    width:100%;
    /*height:350px;*/
    padding-bottom:60px;
    background-color:#ECEDF1 ;
  }
  .wrapline{
    height:80px;
    width:100%;
    background-color:#fff;
    position: relative;
    top:4px;
    border-bottom:1px solid #eee;
  }
  .infoimg{
    width:80px;
    height:60px;
    /*background-color:red;*/
    margin-top:10px;
    margin-left:15px;
    float: left;
  }
  .titleinfos{
    width:calc(100% - 145px);
    height:60px;
    margin-top:10px;
    margin-left:5px;
    /*background-color:green;*/
    float: left;
  }
  .newstitle{
    width:100%;
    height:30px;
    /*background-color:blue;*/
    text-align: left;
    line-height:30px;
    overflow:hidden;text-overflow:ellipsis;
  }
  .newsinfo{
    width:100%;
    height:30px;
    /*background-color:#00ffff;*/
    color:#555;
    font-size:14px;
    font-weight: 300;
  }
  .rightarr{
    width:40px;
    height:60px;
    /*background-color:yellow;*/
    float: left;
    margin-top:10px;
  }
  .arrowright{
    width: 16px;
    height:16px;
    margin-top:22px;
    margin-left:10px;
  }
  .author{
    width:100%;
    height:30px;
    text-align: left;
    line-height:30px;
    float: left;
    overflow:hidden;text-overflow:ellipsis;
  }
  .lookmore{
    width:100%;
    height:50px;
    background-color:#fff;
    border-top:1px solid #eee;
    margin-top:3px;
    line-height:50px;
    font-size:14px;
    position:relative;
  }

</style>
