<template>
  <div class="shangkeqiandao">
    <div class="topinfo">
      <div class="classinfo">
        <div class="bjname"><div class="bj">班级:</div> <div class="bjmc">
          <nobr v-if="isstudentshowbjmc" style="text-align: left;color:#20A0FF">{{stuclassname}}</nobr>
          <nobr><input type="text" style="color:blue" v-if="isteachershowbjmc" class="selbjnput" v-model="classname" @click="bjshowpop()" placeholder="请点击选择班级" readonly="readonly"   :disabled="isinputdidable"></nobr>
        </div></div>
        <div class="count"><div class="zrs">总人数<span style="color:#4db3ff">{{bjcount}}</span>人</div></div>
      </div>
      <div class="lessoninfo">
        <div class="seltime">
          <div class="seltimelabel"><nobr>选择日期<span style="color:red;">*</span> </nobr></div>
          <input type="text" class="seltimeinput" v-model="classtime" icon="el-icon-search" @click="openPicker" readonly="readonly"  :disabled="isinputdidable">
        </div>
        <div class="selkeshi">
          <div class="selkeshilabel"><nobr>选择课时<span style="color:red;">*</span></nobr></div>
          <input type="text" class="selkeshinput" v-model="keshi" @click="showpop()" placeholder="请选择课时" readonly="readonly"  :disabled="isinputdidable">
        </div>
        <div class="lessonname" >
          <div class="skcmclabel"><nobr>课程名称<span style="color:red;">*</span></nobr></div>
          <input type="text" class="kcmcinput" v-model="kcmc" placeholder="请填写课程名称" maxlength="30" :change="islengthok()"  :disabled="isinputdidable"></div>
      </div>
    </div>
    <div class="teachertips" v-if="isteachershowtips">{{teachertips}}</div>
    <div class="studentslist">
      <div class="studentcard" v-for="(item, $index) in instudentslist" @click="showcard($index)" v-bind:class="{ cardchecked: item.ischecked}">
        <div class="cardtop">
          <div class="xh"><nobr>学号:{{item.xh}}</nobr></div>
          <div class="xm"><nobr>姓名:{{item.xm}}</nobr></div>
          <div class="sel" @click="tozero($index)">
            <el-checkbox v-model="item.ischecked" style="float: right;" v-bind:class="{ checked: item.ischecked}" ><span style="float: left;" >{{item.ischecked ? '已签到' : '未签到'}}&nbsp;</span></el-checkbox>
          </div>
        </div>
        <div class="cardmid">
          <div class="fztip">分值</div>
          <div class="fzctrl">
            <div class="fzinput">
              <div class="fz">
                <input type="text" class="fzinputin" readonly="readonly" v-model="item.fz">
              </div>
              <!--<div class="low" @click="fzminus($index)">-</div>-->
              <!--<div class="high" @click="fzplus($index)">+</div>-->
            </div>
          </div>
        </div>
        <div class="cardbot" v-show="item.iscardbotshow">
          <input type="text" v-model="item.reason" class="reasontext" @click="stopevent($index)" placeholder="请输入原因（限50字以内）" maxlength="50">
        </div>
      </div>
    </div>
     <!--默认显示返回 isbuttonokshow = true-->
    <div class="buttons2" v-show="isbackbuttonokshow" >
      <div class="gobackbuttons"  @click="goback()">
        返回
      </div>
    </div>


    <!--条件符合时显示返回和提交 isbuttonokshow = false-->
      <div class="buttons1" v-show="isbuttonokshow">
        <div class="goback" @click="goback()" >返回</div>
        <div class="submit" @click="submit()" >提交</div>
      </div>


    <!--提交时的加载动画 isbackbuttonokshow = false-->
    <div class="buttons0" v-show="issubloadingshow">
      <div class="submiting" ><mt-spinner type="triple-bounce" color="#26a2ff"></mt-spinner></div>
    </div>

    <div class="datapicker">
      <mt-datetime-picker
        ref="picker0"
        type="date"
        v-model="pickerdate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
      </mt-datetime-picker>
    </div>
    <div class="keshipicker">
      <mt-popup  v-model="popupVisible"  position="bottom" style="width:100%">
        <mt-picker :slots="slots" @change="onValuesChange"><slot></slot></mt-picker>
      </mt-popup>
    </div>
    <div class="bjpicker">
      <mt-popup  v-model="bjpopupVisible"  position="bottom" style="width:100%">
        <mt-picker :slots="bjslots" @change="bjonValuesChange"><slot></slot></mt-picker>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { DatetimePicker, Popup, Picker, Spinner } from 'mint-ui'
  import axios from 'axios'
  import bus from '@/components/bus.js'   // 事件总线
 // import { Loading } from 'element-ui'
  const qs = require('qs')
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)
  Vue.component(DatetimePicker.name, DatetimePicker)
  Vue.component(Spinner.name, Spinner)

  export default {
    name: 'shangkeqiandao',
    data () {
      return {
        classname: '',
        stuclassname: '',
        classtime: '',
        jcinfo: '',
        kcmc: '',
        actualnum: '', // 实际人数
        pickerdate: new Date(),
        popupVisible: false,
        slots: [
          {
            flex: 1,
            values: ['1-2', '3-4', '5-6', '7-8'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        bjslots: [
          {
            flex: 1,
            values: ['222', '3222-4', '5111-6', '7-2228'],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        pickerkeshi: '',
        instudentslist: [
          {xm: '...', xh: '...', ischecked: false, color0: 'color:#38adff', color1: 'color:#999', iscardbotshow: false, fz: 0, reason: ''}
        ],
        stauts: '',
        score: '',
        remark: '',
        classatend: [],
        classatendDetail: [],
        isstudentshowbjmc: true,
        bjpopupVisible: false,
        isteachershowbjmc: false,
        isteachershowtips: false,
        teachertips: '请选择需要打分的班级',
        isbuttonokshow: false,
        isbackbuttonokshow: true,
        bjlist: [],
        studentbjdm: '',
        bjcount: 0,
        teacherbjdm: '',
        attendancenum: 0,
        outstudentlist: [],
        iskcmclengthok: false,
        iskeshiok: false,
        issubloadingshow: false,
        issubmitshow: true,
        isinputdidable: false,
        isajaxing: false
      }
    },
    created: function () {
      this.keshi = '请选择课时'
      let that = this
      var iszhuyeok = window.localStorage.getItem('iszhuyeok')
      if (iszhuyeok === 'ok') {
        that.getuserinfo()
      } else {
        bus.$off('zhuyeisok', function () {
          console.log('zhuyeisok---事件已接收')
          that.getuserinfo()
        })
      }
    },
    mounted: function () {
    },
    beforeDestroy: function () {
      bus.$off('zhuyeisok', function () {
        console.log('deszhuyeisok---事件已接收')
      })
    },
    methods: {
      onValuesChange (picker, values) {
        this.pickerkeshi = values[0]
        if (this.instudentslist.length > 0) {
          if (this.pickerkeshi !== undefined & this.pickerkeshi !== '') {
            if (this.kcmc.length > 0 && this.kcmc.length <= 30) {
              this.isbuttonokshow = true
//              alert('1')
              this.isbackbuttonokshow = false
            } else {
              this.isbuttonokshow = false
//              alert('2')
              this.isbackbuttonokshow = true
              this.issubloadingshow = false
            }
          } else {
            this.isbuttonokshow = false
//            alert('3')
            this.isbackbuttonokshow = true
            this.issubloadingshow = false
          }
        } else {
          this.isbuttonokshow = false
//          alert('4')
          this.isbackbuttonokshow = true
          this.issubloadingshow = false
        }
      },
      bjonValuesChange: function (picker, values) {
        this.classname = values[0]
        if (this.bjlist.length > 0) {
          for (var i = 0; i < this.bjlist.length; i++) {
            if (this.bjlist[i].bjmc === this.classname) {
              if (this.bjlist[i].submited === true) {
                this.teachertips = '此班级已经完成签到打分，无需操作'
              } else {
                this.teacherbjdm = this.bjlist[i].bjdm
                this.getstudentlist(this.teacherbjdm)
              }
            }
          }
        }
      },
      openPicker () {
        this.$refs.picker0.open()
      },
      showpop: function () {
        this.popupVisible = true
      },
      bjshowpop: function () {
        this.bjpopupVisible = true
      },
      showcard: function (index) {
        console.log(index)
        this.instudentslist[index].iscardbotshow = !this.instudentslist[index].iscardbotshow
      },
      fzminus: function (index) {
        event.cancelBubble = true
        this.instudentslist[index].fz = this.instudentslist[index].fz - 0.5
        if (this.instudentslist[index].fz <= -5) {
          this.instudentslist[index].fz = -5
        }
      },
      fzplus: function (index) {
        event.cancelBubble = true
        if (this.instudentslist[index].ischecked === false) {
          this.instudentslist[index].fz = 0
        } else {
          this.instudentslist[index].fz = this.instudentslist[index].fz + 0.5
          if (this.instudentslist[index].fz >= 5) {
            this.instudentslist[index].fz = 5
          }
        }
      },
      stopevent: function () {
        event.cancelBubble = true
      },
      tozero: function (index) {
        console.log(this.instudentslist[index].ischecked)
        if (this.instudentslist[index].ischecked === true) {
          this.instudentslist[index].fz = 0
        } else {
          this.instudentslist[index].fz = 0.5
        }
      },
      goback: function () {
        window.history.back()
      },
      getstudentlist: function (value) {
      //  let loadingInstance1 = Loading.service({fullscreen: true, customClass: 'loading'})
        var that = this
        var url = '/sms-wx/assessController.do?classattendList'
        axios.post(url, qs.stringify({classCode: value})).then(function (data) {
          console.log(data)
          that.instudentslist = []
          if (typeof data.data === 'object') {
            if (data.data.obj !== 'needlogin') {
              if (data.data.success === true) {
                var studentlist = data.data.msg
                studentlist = JSON.parse(studentlist)
                for (var i = 0; i < studentlist.length; i++) {
                  console.log(i)
                  // {xm: '...', xh: '...', ischecked: false, color0: 'color:#38adff', color1: 'color:#999', iscardbotshow: false, fz: 0, reason: ''}
                  var xm = studentlist[i].xm
                  var xh = studentlist[i].xh
                  var score = studentlist[i].score
                  var templist = {xm: xm, xh: xh, ischecked: true, color0: 'color:#38adff', color1: 'color:#999', iscardbotshow: false, fz: score, reason: ''}
                  that.instudentslist.push(templist)
                }
                console.log(that.instudentslist)
                that.bjcount = that.instudentslist.length
               // loadingInstance1.close()
                var usertype = window.localStorage.getItem('usertype')
                if (usertype === '0') {
                  that.isteachershowtips = false
                } else {
                  if (that.instudentslist.length > 0) {
                    that.isteachershowtips = true
                    that.teachertips = '点击左上班级名称即可切换班级'
                  } else {
                    that.isteachershowtips = true
                    that.teachertips = '当前班级暂无学生,点击左上班级名称即可切换班级'
                  }
                }
               // that.classname = window.localStorage.getItem('selfinfo')
              }
            } else {
//              window.localStorage.clear()
              window.location.reload(true)
            }
          }
        })
      },
      getteacherbjlist: function () {
        let that = this
        var url = '/sms-wx/assessController.do?getTeachteacher'
        axios.post(url).then(function (data) {
          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                if (data.data.msg.length > 0) {
                  console.log(data.data.msg)
                  var datamsg = JSON.parse(data.data.msg)
                  console.info(datamsg)
                  that.bjslots[0].values = []
                  for (var i = 0; i < datamsg.length; i++) {
                    var bjlist = {bjmc: datamsg[i].bjmc, bjdm: datamsg[i].bjdm, teachername: datamsg[i].teachername, submited: false}
                    that.bjlist.push(bjlist)
                    that.bjslots[0].values.push(datamsg[i].bjmc)
                  }
                }
              }
            }
          }
        })
      },
      pushstudentlist: function () {
        console.log('...')
        this.outstudentlist = []
        var usertype = window.localStorage.getItem('usertype')
        // 获取已签到人数
        var nochecked = []
        for (var i = 0; i < this.instudentslist.length; i++) {
          console.log(i)
          if (this.instudentslist[i].ischecked === false) {
            console.log(this.instudentslist[i].xm)
            nochecked.push(this.instudentslist[i].xm)
          }
        }
        console.log(nochecked)
        this.attendancenum = this.instudentslist.length - nochecked.length
        var kcmc = this.kcmc
        var classtime = this.classtime
        var actualnum = this.bjcount
        var attendancenum = this.attendancenum
        var jcinfo = this.keshi
        var bjmc
        var bjdm
        if (usertype === '0') {
          bjmc = this.stuclassname
          bjdm = this.studentbjdm
        } else {
          bjmc = this.classname
          bjdm = this.teacherbjdm
        }
        var classatend = [{
          kcmc: kcmc,
          classtime: classtime,
          actualnum: actualnum,
          attendancenum: attendancenum,
          jcinfo: jcinfo,
          bjmc: bjmc,
          bjdm: bjdm
        }]
        var sli = this.instudentslist
        for (var n = 0; n < sli.length; n++) {
          var xh = sli[n].xh
          var xm = sli[n].xm
          var status = sli[n].ischecked
          if (status === false) {
            status = 'N'
          } else if (status === true) {
            status = 'Y'
          }
          var score = sli[n].fz
          var remark = sli[n].reason
          var studentlist = {xh: xh, xm: xm, status: status, score: score, remark: remark}
          this.isbuttonokshow = true
          this.outstudentlist.push(studentlist)
        }
        var classatendDetail = this.outstudentlist
        //  classatendDetail: classatendDetail
        console.log(classatendDetail)
        classatendDetail = JSON.stringify(classatendDetail)
        classatend = JSON.stringify(classatend)
        var dataall = {classatend: classatend, classatendDetail: classatendDetail}
        console.log(dataall)
        var dataout = qs.stringify(dataall)
        console.log(dataout)
        this.isajaxing = true
        this.ajaxdata(dataout)
        this.classatend = []
      },
      submit: function () {
        this.pushstudentlist()
      },
      getuserinfo: function () {
        console.log('emitedfromok')
        var usertype = window.localStorage.getItem('usertype')
        var selinfo = window.localStorage.getItem('selfinfo')
        selinfo = JSON.parse(selinfo)
        console.clear()
        console.log(selinfo)
        console.log(usertype)
        if (usertype === '0') {
          console.log(selinfo.bjmc)
          this.stuclassname = selinfo.bjmc
          this.studentbjdm = selinfo.bjdm
          this.isstudentshowbjmc = true
          this.isteachershowbjmc = false
          this.isteachershowtips = false
          this.getstudentlist()
        } else {
          console.log('teacher')
          this.isstudentshowbjmc = false
          this.isteachershowbjmc = true
          this.isteachershowtips = true
          this.instudentslist = []
          this.getteacherbjlist()
        }
      },
      ajaxdata: function (dataall) {
        var usertype = window.localStorage.getItem('usertype')
        var that = this
        that.isbackbuttonokshow = false
        that.isbuttonokshow = false
        that.issubloadingshow = true
        that.isinputdidable = 'disabled'
        var url = '/sms-wx/assessController.do?addclassattend'
        axios.post(url, dataall).then(function (data) {
          console.log(data)
          setTimeout(function () {
            that.issubloadingshow = false
            that.isbuttonokshow = false
//            alert('7')
            that.isbackbuttonokshow = true
            that.isinputdidable = false
            that.isajaxing = false
            that.kcmc = ''
            console.log(usertype)
            if (usertype === '1') {
              for (var i = 0; i < that.bjlist.length; i++) {
                if (that.classname === that.bjlist[i].bjmc) {
                  that.bjlist[i].submited = true
                  that.instudentslist = []
                  if (that.bjlist.length > 1) {
                    that.teachertips = '打分成功!' + ' 点击左上角班级名称可切换班级'
                  }
                }
              }
            } else {
              that.instudentslist = []
              that.isteachershowtips = true
              that.teachertips = '打分成功!'
            }
          }, 1000)
        })
      },
      showbackbutton: function () {
        this.isbackbuttonokshow = true
      },
      islengthok: function () {
        if (this.instudentslist.length > 0) {
          if (this.kcmc.length > 0 && this.kcmc.length <= 30) {
            this.iskcmclengthok = true
            if (this.pickerkeshi !== '' && this.pickerkeshi !== undefined) {
              if (this.isajaxing === false) {
                this.isbuttonokshow = true
              } else {
                this.isbuttonokshow = false
              }
//              alert('8')
              this.isbackbuttonokshow = false
            }
          } else {
            this.isbuttonokshow = false
//            alert('9')
            this.isbackbuttonokshow = true
            this.issubloadingshow = false
          }
        } else {
          this.isbuttonokshow = false
//          alert('10')
          this.isbackbuttonokshow = true
          this.issubloadingshow = false
        }
      }
    },
    watch: {
      pickerdate: function (newval) {
        console.log(newval)
        var month = newval.getMonth() + 1
        this.classtime = newval.getFullYear() + '-' + month + '-' + newval.getDate() + ''
      },
      pickerkeshi: function (newval) {
        this.keshi = newval
      },
      issubloadingshow: function (newval) {
       // alert(newval)
      },
      isbuttonokshow: function (newval) {
//        alert(newval)
      },
      isbackbuttonokshow: function (newval) {
       // alert(newval)
      },
      isteachershowtips: function (newval) {
       // alert(newval)
      },
      kcmc: function (newval) {
       // alert(newval + '****************')
      }
    },
    components: {
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

<style scoped>
  .shangkeqiandao{
    width:100%;
    z-index:100;
    background-color:#ecedf1;
    overflow: scroll;
  }
  .classinfo{
    width:calc(100% - 30px);
    height:40px;
    background-color:#fff;
    position:relative;
    font-size:16px;
    line-height: 40px;
    padding:0px 15px;
    color:#333;
    border-bottom:1px solid #eee;
  }
  .bjname{
    width:60%;
    /*background-color:#00ff00;*/
    /*background-color:#1c8de0;*/
    float:left;
  }
  .count{
    width:40%;
    float:left;
    /*background-color:#1c8de0;*/

  }
  .bj{
    width:40px;
    height:40px;
    float: left;
    text-align: left;
    overflow:hidden;text-overflow:ellipsis;
  }
  .bjmc{
    width:calc(100% - 60px);
    height:40px;
    float: left;
    text-align: left;
    overflow:hidden;text-overflow:ellipsis;
    color:blue;
  }
  .zrs{
    width:100%;
    height:40px;
    text-align: right;
    color:#333;

    overflow:hidden;text-overflow:ellipsis;
  }
  .bhzrs{
    width:calc(100% - 45px);
    height:40px;
    float: left;
    text-align: left;
    overflow:hidden;text-overflow:ellipsis;
  }
  .lessoninfo{
    width:100%;
    height:123px;
    background-color:#fff;
    overflow: hidden;
    color:#333;
  }
  .seltime{
    width:100%;
    height:40px;
    border-bottom:1px solid #eee;
    position:relative;
  }
  .lessonname{
    width:100%;
    height:40px;
    border-bottom:1px solid #eee;
    position:relative;
  }
  .selkeshi{
    width:100%;
    height:40px;
    border-bottom:1px solid #eee;
    position:relative;
  }
  .seltimelabel{
    width:30%;
    height:40px;
    line-height: 40px;
    font-size: 16px;
    text-align: left;
    position:absolute;
    top:0px;
    left:15px;
    overflow:hidden;text-overflow:ellipsis;
  }
 .selkeshilabel{
   width:30%;
   height:40px;
   line-height: 40px;
   font-size: 16px;
   text-align: left;
   position:absolute;
   left:15px;
   overflow:hidden;text-overflow:ellipsis;
   color:#333;
 }
  .skcmclabel{
    width:30%;
    height:40px;
    line-height: 40px;
    font-size: 16px;
    text-align: left;
    position:absolute;
    left:14px;
    overflow:hidden;text-overflow:ellipsis;
    color:#333;
  }
  .seltimeinput, .selkeshinput, .kcmcinput{
    width:70%;
    text-align: right;
    right:15px;
    height:40px;
    line-height:40px;
    position:absolute;
    border:0px;
    background-color:#FFF;
    font-size: 16px;
  }


  .studentslist{
    z-index: 9;
    padding-bottom: 61px;
  }
  .studentcard{
    width:calc(100% - 30px);
    height:auto;
    margin:0px 15px;
    margin-top:15px;
    background-color:#fff;
    -webkit-border-radius: 6px;
    -moz-border-radius: 6px;
    border-radius: 6px;
    border-bottom:4px solid #ccc;
    /*-webkit-box-shadow: 1px 1px 5px 1px rgba(0,0,0,0.1);*/
    font-weight:500;
    transition: height 2s;
    -moz-transition: all 2s; /* Firefox 4 */
    -webkit-transition: all 2s; /* Safari 和 Chrome */
    -o-transition: all 2s;
  }
  .cardchecked{
    border-bottom:4px solid #38adff;
  }
  .cardtop,.cardmid{
    width:calc(100% - 30px);
    height:40px;
    border-bottom:1px solid #eee;
    /*background-color:green;*/
    border-radius: 0px;
    margin:0px 15px;
    position:relative;
  }
  .cardbot{
    width:calc(100% - 30px);
    height:50px;
    border-bottom:1px solid #eee;
    /*background-color:green;*/
    border-radius: 0px;
    margin:0px 15px;
    position:relative;
  }
  .xh{
    width:calc(40% - 5px);
    height:40px;
    line-height:40px;
    font-size:14px;
    text-align: left;
    float: left;
    margin-right:5px;
    overflow:hidden;text-overflow:ellipsis;
    color:#333;
  }
  .xm{
    width:30%;
    height:40px;
    line-height: 40px;
    font-size:14px;
    text-align: left;
    float: left;
    overflow:hidden;text-overflow:ellipsis;
    color:#333;
  }
  .sel{
    position: absolute;
    width:30%;
    height:28px;
    font-size:14px;
    text-align: left;
    right: -5px;
    top:11px;
  }
  .checked{
    color:#38adff;
  }
  .fztip{
    width:50%;
    height:40px;
    line-height: 40px;
    font-size:14px;
    text-align: left;
    float: left;
    color:#333;
    /*background-color:green;*/
  }
  .fzctrl{
    width:50%;
    height:40px;
    line-height: 40px;
    font-size:14px;
    text-align: left;
    float: left;
    /*background-color:blue;*/
    position:relative;
  }
  .fzinput{
    height:40px;
    width:100%;
    position:absolute;
    line-height:40px;
    right:0px;
    top:0;
    /*border:1px solid #38adff;*/
    overflow: hidden;
  }
  .fz{
    text-align:right;
    width:100%;
    height:40px;
    position: absolute;
    border:0px;
    right:0px;
    top:0px;


  }
  .fzinputin{
    width:100%;
    height:40px;
    position:absolute;
    top:0px;
    left:0px;
    border:0;
    text-align: right;
    font-size:14px;
    color:#38adff;
  }
  .low{
    width:26px;
    height:26px;
    /*background-color:red;*/
    position:absolute;
    left:47px;
    line-height: 26px;
    text-align: center;
    border-left:1px solid #ccc;
    font-size: 18px;
  }
  .low:active{
    width:26px;
    height:26px;
    background-color:#e9e9e9;
    position:absolute;
    left:47px;
    line-height: 26px;
    text-align: center;
    border-left:1px solid #ccc;
    font-size: 18px;
  }
  .high{
    width:26px;
    height:26px;
    /*background-color:red;*/
    position:absolute;
    left:74px;
    line-height: 26px;
    text-align: center;
    border-left:1px solid #ccc;
    font-size: 18px;
  }
  .high:active{
    width:26px;
    height:26px;
    /*background-color:red;*/
    background-color:#e9e9e9;
    position:absolute;
    left:74px;
    line-height: 26px;
    text-align: center;
    border-left:1px solid #ccc;
    font-size: 18px;
  }
  .reasontext{
    width:100%;
    height:50px;
    border:0;
    font-size:14px;
    /*background-color:red;*/
  }
  .buttons0{
    width:100%;
    height:50px;
    position: fixed;
    /*margin-bottom: 10px;*/
    bottom:0px;
    text-align: center;
    line-height:50px;
    font-size:16px;
    z-index: 99;
  }
  .buttons1{
    width:100%;
    height:50px;
    position: fixed;
    /*margin-bottom: 10px;*/
    bottom:0px;
    text-align: center;
    line-height:50px;
    font-size:16px;
    z-index: 99;
  }
  .buttons2{
    width:100%;
    height:50px;
    position: fixed;
    /*margin-bottom: 10px;*/
    bottom:0px;
    text-align: center;
    line-height:50px;
    font-size:16px;
    z-index: 99;
  }
  .gobackbuttons{
    background-color:#38adff;
    height:50px;
    width:100%;
    line-height: 50px;
    color:#fff;
  }
  .gobackbuttons:active{
    height:50px;
    background-color:#1c94e8;
    width:100%;
    line-height: 50px;
    color:#fff;
  }
  .goback{
    width:50%;
    height:50px;
    background-color:#ccc;
    color:#000;
    position: absolute;
    left:0px;
    top:0px;
  }
  .submit{
    width:50%;
    height:50px;
    background-color:#39adff;
    color:#fff;
    position: absolute;
    right:0px;top:0px;
  }
  .goback:active{
    width:50%;
    height:50px;
    background-color:#bbb;
    color:#000;
    position: absolute;
    left:0px;
    top:0px;
  }
  .submit:active{
    width:50%;
    height:50px;
    background-color:#1c94e8;
    color:#fff;
    position: absolute;
    right:0px;top:0px;
  }
  .teachertips{
    width:100%;
    height:50px;
    line-height:50px;
    color:#999;
    font-size:16px;
  }
  .selbjnput{
    border:0px;
    font-size:14px;
    line-height:45px;
    width:100px;
    float: left;
  }
  .downarrow{
    height:45px;
    width:20px;
    position:relative;
    margin-top:0px;
    margin-left:0px;
    float: left;
    line-height: 45px;
    color:#999;
    font-size: 12px;
  }
  .submiting{

  }

</style>

