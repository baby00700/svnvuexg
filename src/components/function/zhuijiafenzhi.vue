<template>
  <div class="zhuijiafenzhi">
    <div class="chaxunwrap">
      <input type="text" class="searchinput" placeholder=" 请输入学号查询并进行分值追加" id="xhinput" v-model="xh" maxlength="30">
      <div  class="searchbotton" id="botton" @click="searchstudent()"><nobr><i class="el-icon-search"  ></i></nobr></div>
    </div>
    <div class="result" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="historylist" v-if="ishistoryshow" style="padding-bottom:60px" >
        <div class="historycard" v-for="(item, $index) in historylist" @click="zhankai0($index)" v-bind:class="{ active: item.isActive }">
          <div class="stuinfoline">
            <div class="label">姓名:{{item.xm}}</div>
            <div class="con">学号:{{item.xh}}</div>
          </div>
          <div class="stuinfoline">
            <div class="label">标题:</div>
            <div class="con">{{item.title}}</div>
          </div>
          <div class="stuinfoline">
            <div class="label" style="width:auto;">时间:{{item.time}}</div>
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
      <!--<div class="commontips"><div class="tips" v-if="istipsshow"><p>{{tips}}<a style="color:#1d90e6;text-decoration: underline" @click="goback()">点此返回</a></p></div></div>-->
      <div style="position: absolute;left:3%;
    top:20px;padding-bottom: 20px; width:94%;">
        <div class="studentcard" v-if="isstudentcardshow" v-loading="cardloading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
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
          <div class="stuinfoline">
            <div class="label"><span style="color:red">*</span>年级:</div>
            <div class="con">
              <input type="text" @click="showPopper2" readonly="readonly" v-model="selnj" placeholder="请点击选择年级" class="jcinput">
            </div>
          </div>
          <div class="stuinfoline">
            <div class="label"><span style="color:red">*</span>奖惩类型:</div>
            <div class="con">
              <input type="text" @click="showPopper" readonly="readonly" v-model="jcsel" placeholder="请点击选择奖惩类型" class="jcinput">
            </div>
          </div>
          <div class="stuinfoline">
            <div class="label"><span style="color:red">*</span>栏目:</div>
            <div class="con">
              <input type="text" v-if="islmshow0" @click="showPopper0" readonly="readonly" v-model="lmsel" placeholder="请点击选择栏目" class="jcinput">
              <input type="text" v-if="islmshow1"  readonly="readonly" v-model="lmsel" placeholder="请先选择上级栏目" class="jcinput">
              <div class="jcinput" v-if="islmshow2"><mt-spinner type="double-bounce" color="#26a2ff" :size="20" style="position:absolute;right:0px;top:12px"></mt-spinner></div>
            </div>
          </div>

          <div class="stuinfoline">
            <div class="label"><span style="color:red">*</span>项目:</div>
            <div class="con">
              <input type="text" v-if="isxmshow0" @click="showPopper1" readonly="readonly" v-model="xmsel" placeholder="请点击选择项目" class="jcinput">
              <input type="text" v-if="isxmshow1"  readonly="readonly" v-model="xmsel" placeholder="请先选择上级栏目" class="jcinput">
              <div class="jcinput" v-if="isxmshow2"><mt-spinner type="double-bounce" color="#26a2ff" :size="20" style="position:absolute;right:0px;top:12px"></mt-spinner></div>
            </div>
          </div>

          <div class="stuinfoline">
            <div class="label"><span style="color:red">*</span>分值:</div>
            <div class="con">
              <div class="fzinputwrap">

                <div class="count">
                  <input type="number" class="countinput" maxlength="2" v-model="score">
                </div>
                <div class="jian" @click="jian()">-</div>
                <div class="jia" @click="jia()">+</div>
              </div>
            </div>
          </div>

          <div class="stuinfoline" style="height:100px;">
            <div class="yysm">
            <textarea rows="3" cols="20"  v-model="yy" placeholder="请在此输入原因...(可选)" class="textarea">

            </textarea>
            </div>
          </div>

          <div class="stuinfoline">
            <div class="label">添加附件(可选)</div>

          </div>
          <div class="upload" style="margin-bottom: 50px;">
            <div id="review" style="border-bottom:1px solid #eee">
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
            <mt-spinner type="triple-bounce" color="#26a2ff" :size="33" style="position:relative;top:14px;"></mt-spinner>
          </div>
        </div>
      </div>



    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots" @change="onValuesChange" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" @click="hidepop">取消</div>
          <div class="queding bar" @click="hidepop">确定</div>
        </slot>
      </mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupVisible0"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots0" @change="onValuesChange0" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" @click="hidepop0">取消</div>
          <div class="queding bar" @click="hidepop0">确定</div>
        </slot>
      </mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupVisible1"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots1" @change="onValuesChange1" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" @click="hidepop1">取消</div>
          <div class="queding bar" @click="hidepop1">确定</div>
        </slot>
      </mt-picker>
    </mt-popup>

    <mt-popup
      v-model="popupVisible2"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots2" @change="onValuesChange2" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" @click="hidepop2">取消</div>
          <div class="queding bar" @click="hidepop2">确定</div>
        </slot>
      </mt-picker>
    </mt-popup>
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
        xh: '',
        xm: '',
        xb: '',
        title: '',
        studentinfo: 'waiting',
        tips: '',
        loading: false,
        cardloading: false,
        istipsshow: false,
        studentlist: [],
        popupVisible: false,
        popupVisible0: false,
        popupVisible1: false,
        popupVisible2: false,
        isstudentcardshow: false,
        slots: [
          {
            flex: 1,
            values: ['奖励', '惩罚'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        slots0: [
          {
            flex: 1,
            values: ['...'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        slots1: [
          {
            flex: 1,
            values: ['...'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        slots2: [
          {
            flex: 1,
            values: ['...'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        jcsel: '',
        lmsel: '',
        xmsel: '',
        yy: '',
        imagedatalist: [],
        imagenamelist: [],
        score: 0,
        lmidlist: [],
        xmidlist: [],
        jcdm: '',
        lmid: '',
        xmid: '',
        isbottonshow: true,
        isloading: false,
        islmshow0: false,
        isxmshow0: false,
        islmshow1: true,
        isxmshow1: true,
        islmshow2: false,
        isxmshow2: false,
        ishistoryshow: true,
        historylist: [],
        isloadmoreshow: true,
        pageindex: 1,
        picker2: '',
        selnj: ''
      }
    },
    update: function () {
      var input = document.getElementById('file_input')
      if (typeof FileReader === 'undefined') {
        input.setAttribute('disabled', 'disabled')
      } else {
        input.addEventListener('change', this.readfile(), false)
        input.addEventListener('click', function () {
          this.value = ''
        }, false)
      }
    },
    mounted: function () {
      this.historylist = []
      this.gethistorylist(1)
    },
    methods: {
      onValuesChange (picker, values) {
        this.slots[0].values = ['奖励', '惩罚']
        if (values[0] === undefined) {
          picker.setSlotValue(0, '奖励')
        } else {
          this.slots0[0].values = []
          this.lmidlist = []
          this.jcsel = values[0]
          if (values[0] === '奖励') {
            this.jcdm = 1
          } else if (values[0] === '惩罚') {
            this.jcdm = 2
          }
          this.getlmxm('', this.jcdm)
        }
//        console.log(values[0])
      },
      onValuesChange0 (picker, values) {
        this.lmsel = values[0]
        if (values[0] === undefined) {
        } else {
          this.slots1[0].values = []
          this.xmidlist = []
          for (var i = 0; i < this.slots0[0].values.length; i++) {
            if (values[0] === this.slots0[0].values[i]) {
              var lmid = this.lmidlist[i]
//              console.log(lmid + '****')
              this.lmid = lmid
              this.getlmxm(lmid, this.jcdm)
            }
          }
        }
      },
      onValuesChange1 (picker, values) {
        this.xmsel = values[0]
        for (var i = 0; i < this.slots1[0].values.length; i++) {
          if (values[0] === this.slots1[0].values[i]) {
            var xmid = this.xmidlist[i]
//            console.log(xmid + '****')
            this.xmid = xmid
          }
        }
      },
      onValuesChange2 (picker, values) {
        this.picker2 = picker
        this.selnj = values[0]
      },
      searchstudent: function () {
//        console.log(this.xh)
        var that = this
        if (this.isstudentcardshow === true) {
          that.cardloading = true
        } else {
          that.loading = true
          that.ishistoryshow = false
        }
        var url = '/sms-wx/assessController.do?classattendList'
        axios.post(url, qs.stringify({xh: this.xh, classCode: ''})).then(function (data) {
//          console.log(data)
          if (typeof data === 'object') {
            if (typeof data.data === 'object') {
//              alert('yeshi')
              if (data.data.obj === 'needlogin') {
//                window.localStorage.clear()
                window.location.reload(true)
              } else {
                if (data.data.success === true) {
                  var studentmsg = data.data.msg
                  studentmsg = JSON.parse(studentmsg)
                  if (studentmsg.length > 0) {
//                    console.log(studentmsg)
                    that.xm = studentmsg[0].xm
                    that.xb = studentmsg[0].xbdm
                    if (that.xb === '2') {
                      that.xb = '女'
                    } else {
                      that.xb = '男'
                    }
                    setTimeout(function () {
                      that.loading = false
                      that.cardloading = false
                      that.xhok = that.xh
                      that.isstudentcardshow = true
                      that.ishistoryshow = false
                    }, 800)
                  } else {
//                    alert('meiyouzhegeren')
                    setTimeout(function () {
                      that.loading = false
                      that.cardloading = false
                      that.istipsshow = true
                      that.ishistoryshow = true
                      Toast({
                        message: '无此学生信息!',
                        position: 'bottom',
                        duration: 3000
                      })
                    }, 800)
                  }
                }
              }
            }
          }
          that.studentinfo = data.data
        })
      },
      showPopper: function () {
        this.popupVisible = true
      },
      showPopper0: function () {
        this.popupVisible0 = true
      },
      showPopper1: function () {
        this.popupVisible1 = true
      },
      showPopper2: function () {
        this.popupVisible2 = true
        this.setnj()
      },
      hidepop: function () {
        this.popupVisible = false
      },
      hidepop0: function () {
        this.popupVisible0 = false
      },
      hidepop1: function () {
        this.popupVisible1 = false
      },
      hidepop2: function () {
        this.popupVisible2 = false
      },
      readfile: function ($event) {
        var that = this
//        console.log($event.target.files[0])
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
//                  console.log(temp)
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
//        console.clear()
//        console.log(that.imagedatalist)
//        console.log(that.imagenamelist)
      },
      delimg: function (index) {
        console.log(index)
        this.imagedatalist.splice(index, 1)
        this.imagenamelist.splice(index, 1)
      },
      jian: function () {
        this.score = this.score - 0.5
      },
      jia: function () {
        this.score = this.score + 0.5
      },
      setnj: function () {
        this.slots2[0].values = []
        var dqnj = new Date().getFullYear()
        console.log(dqnj)
        var nj
        for (var i = 0; i < 5; i++) {
          nj = dqnj - i
          this.slots2[0].values.push(nj)
        }
      },
      getlmxm: function (pid0, type0) {
        var that = this
        var url = '/sms-wx/assessController.do?getExamintoMapList'
        if (pid0 === '') {
          this.islmshow0 = false
          this.islmshow1 = false
          this.islmshow2 = true
        } else {
          this.isxmshow0 = false
          this.isxmshow1 = false
          this.isxmshow2 = true
        }
        setTimeout(function () {
          axios.post(url, qs.stringify({pid: pid0, type: type0, nj: that.selnj})).then(function (data) {
//            console.log(data)
            if (typeof data.data === 'object') {
              if (typeof data.data === 'object') {
                if (data.data.obj === 'needlogin') {
//                  window.localStorage.clear()
                  window.location.reload(true)
                } else {
                  if (data.data.success === true) {
//                    console.log(data.data.msg)
                    var datamsg = JSON.parse(data.data.msg)
//                    console.log(datamsg)
                    for (var i = 0; i < datamsg.length; i++) {
//                      console.log(datamsg[i].id)
                      if (pid0 !== '') {
                        that.xmidlist.push(datamsg[i].id)
                        that.slots1[0].values.push(datamsg[i].columnname)
                        that.score = datamsg[i].score
                        setTimeout(function () {
                          that.isxmshow0 = true
                          that.isxmshow1 = false
                          that.isxmshow2 = false
                        }, 200)
                      } else {
                        that.lmidlist.push(datamsg[i].id)
//                        console.log(that.slots0)
                        that.slots0[0].values.push(datamsg[i].columnname)
                        setTimeout(function () {
                          that.islmshow0 = true
                          that.islmshow1 = false
                          that.islmshow2 = false
                        }, 500)
                      }
                    }
                  }
                }
              }
            }
          })
        }, 500)
      },
      gethistorylist: function (index) {
        var url = '/sms-wx/assessController.do?getddcassess'
        var that = this
        axios.post(url, qs.stringify({pageindex: index, pagesize: 7})).then(function (data) {
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                var listdata = data.data.msg
                listdata = JSON.parse(listdata)
                for (var i = 0; i < listdata.length; i++) {
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
//                  console.log(data.data)
                  var singledata = {
                    xm: listdata[i].xm,
                    xh: listdata[i].xh,
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
//          console.log(that.historylist)
        })
      },
      loadmore: function () {
        this.pageindex++
        this.gethistorylist(this.pageindex)
      },
      submitdata: function () {
        var that = this
        var imglist = JSON.stringify(that.imagedatalist)
        var imgnamelist = JSON.stringify(that.imagenamelist)
        if (this.xm !== '' && this.xh !== '' && this.title !== '' && this.lmsel !== undefined && this.lmsel !== '' && this.score !== '') {
          var url = '/sms-wx/assessController.do?saveAddPoints'
          this.isbottonshow = false
          this.isloading = true
          axios.post(url, qs.stringify({
            image: imglist,
            imagename: imgnamelist,
            xm: that.xm,
            xh: that.xh,
            content: that.yy,
            columnid: that.lmid,
            projectid: that.xmid,
            projectname: that.xmsel,
            score: that.score,
            title: that.title,
            type: that.jcdm
          })).then(function (data) {
            if (typeof data === 'object') {
              if (typeof data.data === 'object') {
                if (data.data.success === true) {
                  setTimeout(function () {
                    that.isloading = false
                    that.isbottonshow = true
                    that.xh = ''
                    // 清除信息
                    that.imagedatalist = []
                    that.imagenamelist = []
                    that.xm = ''
                    that.xh = ''
                    that.yy = ''
                    that.lmid = ''
                    that.xmid = ''
                    that.xmsel = ''
                    that.lmsel = ''
                    that.lmidlist = []
                    that.xmidlist = []
                    that.score = 0
                    that.jcdm = ''
                    that.jcsel = ''
                    that.slots1[0].values = []
                    that.slots0[0].values = []
                    that.isstudentcardshow = false
                    that.loading = false
                    that.title = ''
                    that.islmshow0 = false
                    that.islmshow1 = true
                    that.islmshow2 = false
                    that.isxmshow0 = false
                    that.isxmshow1 = true
                    that.isxmshow2 = false
                    that.historylist = []
                    that.gethistorylist(1)
                    that.ishistoryshow = true
                    Toast({
                      message: '信息保存成功!',
                      position: 'bottom',
                      duration: 3000
                    })
                  }, 800)
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
      zhankai0: function (index) {
        this.historylist[index].isshowzhedie = !this.historylist[index].isshowzhedie
        this.historylist[index].isActive = !this.historylist[index].isActive
      },
      hidecard: function () {
        this.ishistoryshow = true
        this.isstudentcardshow = false
      }
    },
    watch: {
      xh: function (newval, oldval) {
        var that = this
        var botton = document.getElementById('botton')
        var xhinput = document.getElementById('xhinput')
        if (that.xh.length > 0 && !isNaN(that.xh)) {
          if (oldval.length - newval.length < 0) {
            that.isloading = false
            that.isbottonshow = true
            // 清除信息
            that.imagedatalist = []
            that.imagenamelist = []
            that.xm = ''
            that.yy = ''
            that.lmid = ''
            that.xmid = ''
            that.xmsel = ''
            that.lmsel = ''
            that.lmidlist = []
            that.xmidlist = []
            that.score = 0
            that.jcdm = ''
            that.jcsel = ''
            that.slots1[0].values = []
            that.slots0[0].values = []
            that.isstudentcardshow = false
            that.loading = false
            that.title = ''
            that.islmshow0 = false
            that.islmshow1 = true
            that.islmshow2 = false
            that.isxmshow0 = false
            that.isxmshow1 = true
            that.isxmshow2 = false
          }
          botton.style.width = '50px'
          xhinput.style.width = 'calc(100% - 73px)'
          that.istipsshow = false
          that.tips = ''
          that.isstudentcardshow = false
        } else {
          botton.style.width = '0px'
          xhinput.style.width = 'calc(95%)'
          that.isstudentcardshow = false
          that.istipsshow = true
        }
      },
      loading: function (newval) {
        var botton = document.getElementById('botton')
        var xhinput = document.getElementById('xhinput')
        if (newval === false) {
          botton.style.width = '50px'
          xhinput.style.width = 'calc(100% - 73px)'
        } else {
          botton.style.width = '0px'
          xhinput.style.width = 'calc(95%)'
        }
      },
      score: function (newval) {
        if (newval > 98) {
          this.score = 98
        }
        if (newval < -98) {
          this.score = -98
        }
      }
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

  .zhuijiafenzhi{
    width:100%;
    z-index:100;
    background-color:#ecedf1;
    overflow: scroll;
  }
  .chaxunwrap{
    width:100%;
    height:70px;
    background-color:#fff;
    /*border:1px solid red;*/
    position:relative;
    border-bottom:1px solid #eee;
    -webkit-box-shadow: 1px 1px 8px 1px rgba(0,0,0,0.1);
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
    height:calc(100% - 70px);
    width: 100%;
    overflow: scroll;
    position: relative;
    top:0px;
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
    border-radius: 6px;
    /*bottom:60px;*/
    overflow: hidden;
    -webkit-box-shadow: 1px 1px 5px 1px rgba(0,0,0,0.1);
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
   left:10px;
 }
  .con{
    width:calc(100% - 110px);
    height:44px;
    text-align: right;
    line-height: 44px;
    position:absolute;
    left:100px;
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
    width:122px;
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
    width:60px;
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
    width:60px;
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
    margin-top:150px;
    border-top:1px solid #eee
  }
  .goback, .subbut{
    width:50%;
    height:45px;

    float:left;
    line-height:45px;
    color:#1d90e6

  }
  .subbut:active{
    background-color:#1d90e6;
    color:#fff;
  }
  .goback:active{
    background-color:#1d90e6;
    color:#fff;
  }


  /**/
  .xm{
    text-align: left;
    margin-left:10px;
  }
  .xh{
    text-align: right;
    margin-right:10px;
  }
  .time{
    width:30%;
    height:44px;
    text-align: left;
    line-height: 44px;
    position:absolute;
    left:80px;
  }
  .zhedie{
    width:100%;
    border-bottom:1px solid #eee;
  }
  .sftg{
    width:calc(70% - 90px);
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
    background-color:#fff;
  }
  .active{
    border:1px solid #1d90e6 !important;
    -webkit-box-shadow: 1px 1px 10px 2px rgba(29,144,230,.3) !important;
  }
</style>
