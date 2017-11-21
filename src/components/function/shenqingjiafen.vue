<template>
  <div class="shenqingjiafen">
    <transition  name="custom-classes-transition"
                 enter-active-class="animated fadeInUp"
                 >
    <div class="chaxunwrap" v-if="isshenqingbottonshow" >

     <div class="gobackbut"  @click="goback()">返回</div>
     <div class="sqjfbut"   @click="showcard()">申请加分</div>
    </div>
    </transition>
    <div class="result">

      <div class="historylist" v-if="ishistoryshow" style="padding-bottom:60px">
        <div class="selfinfo">
          <div class="xm"><p>姓名:<span style="color:#1d90e6">{{xm}}</span></p></div>
          <div class="xh"><p>学号:<span style="color:#1d90e6">{{xh}}</span></p></div>
        </div>
        <div class="historycard" v-for="(item, $index) in historylist" @click="zhankai($index)" v-bind:class="{ active: item.isActive }">
          <div class="stuinfoline">
            <div class="label">标题:</div>
            <div class="con">{{item.title}}</div>
          </div>
          <div class="stuinfoline">
            <div class="label" style="width:80px;">申请时间:</div>
            <div class="time">{{item.time}}</div>
            <div class="sftg" :style="item.isscorecolor">{{item.isscore}}</div>
          </div>
          <div class="zhedie" v-show="item.isshowzhedie" >
            <div class="text">
              <textarea rows="3" cols="20"  v-model="item.remark"  class="textarea" readonly="readonly"></textarea>
            </div>
            <div class="stuinfoline" style="border-bottom: none">
              <div class="label" style="width:80px;">得分:</div>
              <div class="con" style="color:#1d90e6">{{item.score}}</div>
            </div>
          </div>
        </div>
        <div class="loadmore" style="color:#1d90e6;line-height:40px;height:40px;font-size: 15px;margin-top:5px;" @click="loadmore()" v-show="isloadmoreshow">点击加载更多</div>
      </div>


      <transition  name="fade">
       <div style="position: absolute;padding-bottom: 0px; width:100%;">
        <div class="studentcard" v-if="isstudentcardshow">
          <div class="stuinfoline">
            <div class="label">学号:</div>
            <div class="con">{{xh}}</div>
          </div>
          <div class="stuinfoline">
            <div class="label">姓名:</div>
            <div class="con">{{xm}}</div>
          </div>
          <div class="stuinfoline">
            <div class="label">性别:</div>
            <div class="con">{{xb}}</div>
          </div>
          <div class="stuinfoline">
            <div class="label"><span style="color:red">*</span>标题:</div>
            <div class="con">
              <input type="text" v-model="title" placeholder="请输入标题" class="jcinput">
            </div>
          </div>
          <div class="stuinfoline" style="height:100px;">
            <div class="yysm">
            <textarea rows="3" cols="20"  v-model="content " placeholder="请在此输入原因...(可选)" class="textarea">
            </textarea>
            </div>
          </div>
          <div class="stuinfoline">
            <div class="label">添加附件(可选)</div>

          </div>
          <div class="upload" style="margin-bottom: 50px;">
            <div id="review" >
              <a class="uploadimg">
                <div class="uploadimgz">添加图片</div>
                <input id="file_input" type="file" multiple="multiple" class="uploadimginput" @change="readfile($event)">
              </a>
              <div class="imgresult" v-for="(item, $index) in imagedatalist"><img :src='item' alt=""/><div class="delimg" @click="delimg($index)" style="background-color:red;">x</div></div>
            </div>
          </div>
          <div class="bottons" v-show="isbottonshow">
            <div class="goback" @click="hidecard()">返回</div>
            <div class="subbut" @click="submitdata()">提交</div>
          </div>
          <div class="bottons" v-show="isloading">
            <div class="goback" style="background-color:#ccc;color:#eee;border:1px solid #eee">返回</div>
            <div class="subbut" ><mt-spinner type="triple-bounce" color="#fff"></mt-spinner></div>
          </div>
        </div>
      </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Spinner, Picker, Popup, Toast } from 'mint-ui'
  import axios from 'axios'
  const qs = require('qs')
  Vue.component(Spinner.name, Spinner)
  Vue.component(Picker.name, Picker)
  Vue.component(Popup.name, Popup)

  export default {
    name: 'zhuijiafenzhi',
    data () {
      return {
        xm: '',
        xh: '',
        xb: '',
        title: '',
        content: '',
        imagedatalist: [],
        imagenamelist: [],
        isshenqingbottonshow: true,
        isstudentcardshow: false,
        isbottonshow: true,
        isloading: false,
        historylist: [],
        ishistoryshow: true,
        iszhedie: false,
        pageindex: 1,
        isloadmoreshow: true
      }
    },
    created: function () {
      this.getselinfo()
      this.gethistorylist(1)
    },
    methods: {
      readfile: function ($event) {
        var that = this
        console.log($event.target.files[0])
        for (var i = 0; i < $event.target.files.length; i++) {
          if (!$event.target.value.match(/.jpg|.gif|.png|.bmp/i)) {
            alert('图片格式不正确！，请重新选择')
          } else {
            var size = $event.target.files[i] / 1024
            if (size > 7000) {
              alert('大小限制在5M以内')
            } else {
              var reader = new FileReader()
              reader.readAsDataURL($event.target.files[i])
              reader.onload = function (e) {
                // console.log(e)
                // console.log(e.currentTarget.result)
                if (that.imagedatalist.length > 0) {
                  var temp = []
                  temp.push(e.currentTarget.result)
                  console.log(temp)
                  if (that.imagedatalist.indexOf(temp[0]) >= 0) {
                    alert('此文件已在待上传队列中！请勿重复选取！')
                  } else {
                    that.imagedatalist.push(e.currentTarget.result)
                    that.imagenamelist.push($event.target.files[0].name)
                  }
                } else {
                  that.imagedatalist.push(e.currentTarget.result)
                  that.imagenamelist.push($event.target.files[0].name)
                }
              }
            }
          }
        }
        console.clear()
        console.log(that.imagedatalist)
        console.log(that.imagenamelist)
      },
      delimg: function (index) {
        console.log(index)
        this.imagedatalist.splice(index, 1)
        this.imagenamelist.splice(index, 1)
      },
      submitdata: function () {
        var that = this
        var imglist = JSON.stringify(that.imagedatalist)
        var imgnamelist = JSON.stringify(that.imagenamelist)
        if (this.xm !== '' && this.xh !== '' && this.title !== '') {
          var url = '/sms-wx/assessController.do?saveAddPoints'
          this.isbottonshow = false
          this.isloading = true
          axios.post(url, qs.stringify({
            image: imglist,
            imagename: imgnamelist,
            xm: that.xm,
            xh: that.xh,
            content: that.content,
            title: that.title
          })).then(function (data) {
            if (typeof data === 'object') {
              if (typeof data.data === 'object') {
                if (data.data.obj !== 'needlogin') {
                  if (data.data.success === true) {
                    setTimeout(function () {
                      that.isloading = false
                      that.isbottonshow = true
                      that.imagedatalist = []
                      that.imagenamelist = []
                      that.content = ''
                      that.title = ''
                      that.hidecard()
                      that.historylist = []
                      that.gethistorylist(1)
                      Toast({
                        message: '提交成功!',
                        position: 'bottom',
                        duration: 3000
                      })
                      that.isloadmoreshow = true
                    }, 800)
                  }
                } else {
//                  window.localStorage.clear()
                  window.location.repeat(true)
                }
              }
            }
          })
        } else {
          Toast({
            message: '有未填项!',
            position: 'bottom',
            duration: 3000
          })
        }
      },
      goback: function () {
        window.history.back()
      },
      getselinfo: function () {
        var selfinfo = window.localStorage.getItem('selfinfo')
        selfinfo = JSON.parse(selfinfo)
        console.log(selfinfo)
        this.xm = selfinfo.userName
        this.xh = selfinfo.userCode
        if (selfinfo.xb === '1') {
          this.xb = '男'
        } else {
          this.xb = '女'
        }
      },
      showcard: function () {
        this.isshenqingbottonshow = false
        this.isstudentcardshow = true
        this.ishistoryshow = false
      },
      hidecard: function () {
        this.isshenqingbottonshow = true
        this.isstudentcardshow = false
        this.ishistoryshow = true
      },
      gethistorylist: function (index) {
        var url = '/sms-wx/assessController.do?getddcassess'
        var that = this
        axios.post(url, qs.stringify({pageindex: index, pagesize: 4})).then(function (data) {
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                var listdata = data.data.msg
                listdata = JSON.parse(listdata)
                for (var i = 0; i < listdata.length; i++) {
                  console.log(listdata[i])
                  var sfdf
                  var isscorecolor
                  if (listdata[i].isscore === 0) {
                    sfdf = '待审核'
                    isscorecolor = 'color:#1d90e6'
                  } else if (listdata[i].isscore === 1) {
                    sfdf = '已打分'
                    isscorecolor = 'color:green'
                  } else if (listdata[i].isscore === 2) {
                    sfdf = '未通过'
                    isscorecolor = 'color:red'
                  }
                  var remark
                  if (listdata[i].remark === null) {
                    remark = '未说明原因'
                  } else {
                    remark = listdata[i].remark
                  }
                  var score
                  if (listdata[i].score === null) {
                    score = '暂无'
                  } else {
                    score = listdata[i].score
                  }
                  console.clear()
                  console.log(data.data.obj)
                  var singledata = {
                    isscore: sfdf,
                    title: listdata[i].title,
                    score: score,
                    remark: remark,
                    time: listdata[i].create_date1,
                    isscorecolor: isscorecolor,
                    isshowzhedie: false,
                    isActive: false
                  }
                  that.historylist.push(singledata)
                  if (data.data.obj <= that.historylist.length) {
                    that.isloadmoreshow = false
                    Toast({
                      message: '已经加载全部内容!',
                      position: 'bottom',
                      duration: 3000
                    })
                  }
                }
              }
            }
          }
          console.log(that.historylist)
        })
      },
      zhankai: function (index) {
        console.log(index)
        this.historylist[index].isshowzhedie = !this.historylist[index].isshowzhedie
        this.historylist[index].isActive = !this.historylist[index].isActive
      },
      loadmore: function () {
        this.pageindex++
        this.gethistorylist(this.pageindex)
      }
    },
    watch: {
    }
  }
</script>
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
    opacity: 0
  }
  .active{
    border:1px solid #1d90e6 !important;
    -webkit-box-shadow: 1px 1px 10px 2px rgba(29,144,230,.3) !important;
  }

  .selfinfo{
    width:100%;
    height:40px;
    border-bottom:1px solid #eee;
  }
  .xm, .xh{
    width:calc(50% - 11px);
    height:40px;
    float:left;
    font-size:14px;
    line-height: 40px;
  }
  .xm{
    text-align: left;
    margin-left:10px;
    margin-top: 0px;
  }
  .xh{
    text-align: right;
    margin-right:10px;
  }
  .time{
    width:30%;
    height:44px;
    text-align: right;
    line-height: 44px;
    position:absolute;
    left:80px;
  }
  .zhedie{
    width:100%;
    border-bottom:1px solid #eee;
  }
  .sftg{
      width:calc(70% - 110px);
      position:absolute;
      left:calc(30% + 80px);
      text-align: right;
      line-height:44px;
      color:#1d90e6;
  }
  .textarea{
    width: 100%;
    border:0;
    height:90px;
    position: relative;
    top:5px;
    resize:none;
    margin-bottom:2px;
    color:#666;
  }
  .text{
    border-bottom:1px solid #eee;
  }
  .delimg {
    height: 16px;
    width: 16px;
    border: 1px solid red;
    border-radius: 9px;
    text-align: center;
    line-height: 16px;
    position: relative;
    top: -96px;
    left: 76px;
    -webkit-box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.3);
    color: #fff;
    background-size: 100% 100%;
  }
  .imgresult {
    width:84px;
    height:84px;
    float:left;
    margin-bottom:30px;
    margin-left:20px;
    -webkit-box-shadow: 1px 1px 8px 2px rgba(0,0,0,0.2);

  }

  .result img {
    width: 86px;
    height: 86px;

  }
  .shenqing-tupian {
    width: 100%;
    float: left;

    background-color: #fff;
  }

  .shenqing-tupian:before,
  .shenqing-tupian:after {
    content: "";
    display: table;
  }

  .shenqing-tupian:after {
    clear: both;
  }
  #review {
    margin-top: 16px;
    margin-bottom: 16px;
    float: left;
    clear: both;
  }

  .uploadimg {
    height: 82px;
    width: 82px;
    border: 2px dashed #ccc;
    text-align: center;
    color: #c0c0c0;
    /*background-image: url(images/uploadimg.png);*/
    /*background-repeat: no-repeat;*/
    /*background-position: 20px 15px;*/
    background-size: 40px 40px;
    margin-left: 20px;
    margin-bottom: 10px;
    float: left;
    position: relative;
  }
  .uploadimg:active{
    height: 82px;
    width: 82px;
    border: 2px dashed #000;
    text-align: center;
    color: #000;
    /*background-image: url(images/uploadimg.png);*/
    /*background-repeat: no-repeat;*/
    /*background-position: 20px 15px;*/
    background-size: 40px 40px;
    margin-left: 20px;
    margin-bottom: 10px;
    float: left;
    position: relative;
  }

  .uploadimginput {
    height: 82px;
    width: 82px;
    float: left;
    border: 2px solid rgba(0, 0, 0, 0.5);
    position: absolute;
    left:0px;
    top:0px;
    opacity: 0;
  }


  .uploadimgz {
    width: 80px;
    height: 20px;
    z-index: -111;
    margin-top: 32px;
    font-size: 10pt;
  }

  .shenqingjiafen{
    width:100%;
    z-index:100;
    background-color:#ecedf1;
    overflow: scroll;
  }
  .chaxunwrap{
    width:100%;
    height:50px;
    background-color:#fff;
    /*border:1px solid red;*/
    position:fixed;
    bottom:0px;
    border:1px solid #eee;
    z-index:2;
    -webkit-box-shadow: 1px 1px 8px 1px rgba(0,0,0,0.1);
  }

  .sqjfbut{
    height:50px;
    width:50%;
    color:#fff;
    line-height: 50px;
    background-color:#1d90e6;
    float: left;
  }
  .sqjfbut:hover{
    height:50px;
    width:50%;
    color:#ddd;
    line-height: 50px;
    background-color:#2f01f7;
    float: left;
  }
  .gobackbut{
    height:50px;
    width:50%;
    color:#000;
    line-height: 50px;
    background-color:#ccc;
    float: left;
  }
  input{
    background:none;
    outline:none;
    border:0px;
    border-radius:0;
  }
  .searchinput{
    width:95%;
    height:40px;
    border:0px;
    border-bottom:2px solid #1d90e6;
    position: absolute;
    left:10px;
    top:15px;
    line-height: 40px;
    transition: width 0.5s;
    font-size:18px;
    font-weight: 500;
  }
  .searchbotton{
    width:0px;
    background-color:#fff;
    height:30px;
    position:absolute;
    top:25px;
    right:10px;
    color:#1d90e6;
    line-height:30px;
    font-size:17px;
    overflow: hidden;
    transition: width 0.5s;
    font-weight: 600;
  }
  .searchbotton:active{
    width:0px;
    background-color:#fff;
    height:30px;
    position:absolute;
    top:25px;
    right:10px;
    color:red;
    line-height:30px;
    font-size:17px;
    overflow: hidden;
    transition: width 0.5s;
    font-weight: 600;
    -webkit-animation: bottonactive 0.3s;

  }
  @-webkit-keyframes bottonactive /* Safari 和 Chrome */
  {
    0% {font-size: 17px}
    25% {font-size: 30px}
    50% {font-size: 20px}
    75% {font-size: 18px}
    100% {font-size: 17px}
  }
  .result{
    height:calc(100% - 0px);
    width: 100%;
    overflow: scroll;
    position: relative;
    top:0px;
    z-index:1;
    background-color:#fff;
  }
  .commontips{
    width:100%;
    height:100px;
    position:fixed;
    top:calc(50% - 50px);
    /*background-color: #1d90e6;*/
  }
  .tips{
    height:90%;
    width:90%;
    margin-top:5%;
    margin-left:5%;
    /*background-color:red;*/
    word-wrap:break-word ;
  }
  .studentcard{
    width:100%;
    background-color:#fff;
    /*position:absolute;*/
    /*left:3%;*/
    /*top:20px;*/

    /*bottom:60px;*/
    overflow: hidden;
  }
  .stuinfoline{
    height:44px;
    width:100%;
    border-bottom: 1px solid #eee;
    position:relative;
    font-size:14px;
  }
  .label{
    width:100px;
    height:44px;
    line-height: 44px;
    text-align: left;
    position: absolute;
    left:20px;
  }
  .con{
    width:calc(100% - 120px);
    height:44px;
    text-align: right;
    line-height: 44px;
    position:absolute;
    left:90px;
  }
  .bar{
    float:left;
    border-bottom:1px solid #e9e9e9;
    font-size: 14px;
    color:#1d90e6;
  }
  .quxiao{
    height:38px;
    width:calc(50% - 1px);
    border-right:1px solid #e9e9e9;
    line-height: 38px;
  }
  .queding{
    height:38px;
    width:50%;
    line-height: 38px;
  }
  .jcinput{
    height:44px;
    width:calc(100%);
    text-align: right;
    line-height: 44px;
    position:absolute;
    left:0px;
    /*background-color:Red;*/
  }
  .fzinputwrap{
    width:92px;
    height:30px;
    /*background-color:red;*/
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    position: absolute;
    top:6px;
    right:0px;
    border:1px solid #1d90e6;
  }
  .jian{
    height:30px;
    width:30px;
    /*background-color:green;*/
    float:left;
    border-right:1px solid #1d90e6;
    text-align: center;
    line-height: 30px;
    color:#1d90e6;
    background-color:rgba(29,144,230,0.1);
    font-weight: 600;
  }
  .jian:active{
    height:30px;
    width:30px;
    /*background-color:green;*/
    float:left;
    border-right:1px solid #1d90e6;
    text-align: center;
    line-height: 30px;
    color:#1d90e6;
    background-color:rgba(29,144,230,0.4);
    font-weight: 600;
  }
  .count{
    height:30px;
    width:30px;
    /*background-color:blue;*/
    float:left;
    border-right:1px solid #1d90e6;
    text-align: center;
    line-height: 30px;
  }

  .jia{
    height:30px;
    width:30px;
    /*background-color:yellow;*/
    float:left;
    /*border-right:1px solid #ccc;*/
    text-align: center;
    line-height: 30px;
    color:#1d90e6;
    font-weight: 600;
    background-color:rgba(29,144,230,0.1);
  }
  .jia:active{
    height:30px;
    width:30px;
    /*background-color:yellow;*/
    float:left;
    /*border-right:1px solid #ccc;*/
    text-align: center;
    line-height: 30px;
    color:#1d90e6;
    font-weight: 600;
    background-color:rgba(29,144,230,0.4);
  }
  .countinput{
    height:30px;
    width:30px;
    border:0;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    background-color:rgba(29,144,230,0.0)
  }
  .textarea{
    width: 90%;
    border:0;
    height:90px;
    position: relative;
    top:5px;
    resize:none;
  }
  .bottons{
    width:100%;
    height:45px;
    /*background-color:red;*/
    /*position:fixed;*/
    margin-top:130px;

  }
  .goback, .subbut{
    width:35%;
    height:40px;
    margin-left:10%;
    float:left;
    line-height:40px;
    color:#1d90e6;
    border-radius:5px;
    border:1px solid #1d90e6;
    margin-top:10px;
    margin-bottom:20px;
  }
  .subloading{
    width:100%;
    height:40px;
    /*margin-left:10%;*/
    /*float:left;*/
    line-height:40px;
    color:#1d90e6;
    border-radius:5px;
    margin-top:10px;
    margin-bottom:20px;
  }
  .subbut{
    background-color:#1d90e6;
    color:#fff;
  }
  .subbut:active{
    background-color:#1d90e6;
    color:#fff;
  }
  .goback:active{
    background-color:#1d90e6;
    color:#fff;
  }
  .historycard{
    width:90%;
    border:1px solid #ccc;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    -webkit-box-shadow: 1px 1px 10px 2px rgba(0,0,0,.1);
    margin-left: 5%;
    margin-top:15px;
    overflow: hidden;
  }
</style>
