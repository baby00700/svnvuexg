<template>
  <div class="faqikaohe">
    <div class="boxview" style="z-index:0">

      <div class="Row">
        <div class="viewLeft">考核标题</div>
        <div class="viewRight"><input type="text" placeholder="请输入考核标题" class="inp" v-model="title"  maxlength="20" /></div>
      </div>

      <div class="Row">
        <div class="viewLeft">分值上限</div>
        <div class="viewRight"><input type="text" placeholder="请输入分值上限(数字)" class="inp" v-model="fzup" @change="isupscoreok()" maxlength="3"/></div>
      </div>
      <div class="line">
        <div class="viewLeft">发起单位</div>
        <div class="viewRight"><input type="text" placeholder="请输入发起单位" class="inp"  v-model="fqdw" maxlength="20"/></div>
      </div>
      <div class="Row">
        <div class="Left">请选择年级</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="inpView" v-model="nj" @click="openpoper2()" readonly="readonly"/></div>
            <div class="arrow"><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>
      <div class="Row">
        <div class="Left">考核开始时间</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="seltimeinput" v-model="khbegintime" icon="el-icon-search" @click="openPicker0" readonly="readonly" ></div>
            <div class="arrow"><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>
      <div class="line">
        <div class="Left">考核结束时间</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="seltimeinput" v-model="khendtime" icon="el-icon-search" @click="openPicker1" readonly="readonly" ></div>
            <div class="arrow"><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>


      <div class="Row">
        <div class="Left">是否允许追加分值</div>
        <div class="Right"><el-switch
          v-model="canzhuijia"
          on-color="#13ce66"
          off-color="#ff4949"
          on-text="是"
          off-text="否"
          on-value="1"
          off-value="2"
          class="swich">
        </el-switch></div>
      </div>
      <transition  name="custom-classes-transition"
                   enter-active-class="animated fadeInLeft"
                   leave-active-class="animated fadeOutRight">
        <div class="fanwei">
          <div class="Row">
            <div class="Left" style="font-weight: 800">请选择考核范围</div>
          </div>
          <div class="line">
            <div class="Left">请选择学院</div>
            <div class="Right">
              <div class="controlView">
                <div class="control"><input type="text" class="inpView" v-model="xymc" @click="openpoper3()" readonly="readonly"/></div>
                <div class="arrow"><i class="el-icon-arrow-right"></i></div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="Left">请选择专业</div>
            <div class="Right">
              <div class="controlView">
                <div class="control"><input type="text" class="inpView" v-model="zymc" @click="openpoper4()" readonly="readonly"/></div>
                <div class="arrow"><i class="el-icon-arrow-right"></i></div>
              </div>
            </div>
          </div>
          <div class="line">
            <div class="Left">请选择班级</div>
             <div class="Right">
              <div class="controlView">
                <div class="control"><input type="text" class="inpView" v-model="bjmc" @click="openpoper5()" readonly="readonly"/></div>
                <div class="arrow"><i class="el-icon-arrow-right"></i></div>
              </div>
            </div>
          </div>
        </div>
      </transition>


      <div class="Row">
        <div class="Left">考核栏目</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="inpView" v-model="lmmc" @click="openpoper0()" readonly="readonly"/></div>
            <div class="arrow"><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>
      <div class="line">
        <div class="Left">考核项目</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="inpView" v-model="xmmc" @click="openpoper1()" readonly="readonly"/></div>
            <div class="arrow"><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>
      <div class="line">
        <div class="Left">项目分值</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="inpView" v-model="score"  readonly="readonly"/></div>
            <!--<div class="arrow"><i class="el-icon-arrow-right"></i></div>-->
          </div>
        </div>
      </div>

      <div class="Row">
        <div class="Left">申请开始日期</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="seltimeinput" v-model="sqbegintime" icon="el-icon-search" @click="openPicker2" readonly="readonly" ></div>
            <div class="arrow"><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>
      <div class="line">
        <div class="Left">申请结束日期</div>
        <div class="Right">
          <div class="controlView">
            <div class="control"><input type="text" class="seltimeinput" v-model="sqendtime" icon="el-icon-search" @click="openPicker3" readonly="readonly" ></div>
            <div class="arrow"><i class="el-icon-arrow-right"></i></div>
          </div>
        </div>
      </div>

      <div class="txtArea"><textarea placeholder="请输入活动简介(限100字以内)" v-model="content" rows="4" class="Area" maxlength="100"></textarea></div>
    </div>
    <div class="tijiao" style="z-index:999">
      <div class="goReturn" @click="hidefaqi()">返回</div>
      <div class="goSubmit" @click="submitdata()">提交</div>
    </div>

    <mt-datetime-picker
      ref="picker0"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="selbegintime">
    </mt-datetime-picker>

    <mt-datetime-picker
      ref="picker1"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="selendintime">
    </mt-datetime-picker>
      <!--// lm 选择栏目-->
    <mt-popup
      v-model="popupVisible0"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots0" @change="onValuesChange0" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" >取消</div>
          <div class="queding bar" >确定</div>
        </slot>
      </mt-picker>
    </mt-popup>
    <!--// lm 选择项目-->
    <mt-popup
      v-model="popupVisible1"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots1" @change="onValuesChange1" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" >取消</div>
          <div class="queding bar" >确定</div>
        </slot>
      </mt-picker>
    </mt-popup>

    <!--选择年级-->
    <mt-popup
      v-model="popupVisible2"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots2" @change="onValuesChange2" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" >取消</div>
          <div class="queding bar" >确定</div>
        </slot>
      </mt-picker>
    </mt-popup>

    <!--选择学院-->
    <mt-popup
      v-model="popupVisible3"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots3" @change="onValuesChange3" :showToolbar="true" :visible-item-count="5">
        <slot>
          <div class="quxiao bar" >取消</div>
          <div class="queding bar" >确定</div>
        </slot>
      </mt-picker>
    </mt-popup>


    <!-- `选择专业` -->
     <mt-popup
      v-model="popupVisible4"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots4" @change="onValuesChange4" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" >取消</div>
          <div class="queding bar" >确定</div>
        </slot>
      </mt-picker>
    </mt-popup>



  <!-- 选择班级   -->
    <mt-popup
      v-model="popupVisible5"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots5" @change="onValuesChange5" :showToolbar="true" :visible-item-count="3">
        <slot>
          <div class="quxiao bar" >取消</div>
          <div class="queding bar" >确定</div>
        </slot>
      </mt-picker>
    </mt-popup>




    <mt-datetime-picker
      ref="picker2"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="selsqbegintime">
    </mt-datetime-picker>

    <mt-datetime-picker
      ref="picker3"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="selsqendintime">
    </mt-datetime-picker>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { DatetimePicker, Popup, Picker, Spinner, Toast } from 'mint-ui'
  import axios from 'axios'
//  import bus from '@/components/bus.js'   // 事件总线
  // import { Loading } from 'element-ui'
  const qs = require('qs')
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)
  Vue.component(DatetimePicker.name, DatetimePicker)
  Vue.component(Spinner.name, Spinner)
  export default {
    name: 'faqikaohe',
    data () {
      return {
        title: '',
        fzup: '',
        fqdw: '',
        lmmc: '',
        xmmc: '',
        lmid: '',
        xmid: '',
        score: '',
        content: '',
        khbegintime: '',
        khendtime: '',
        sqbegintime: '',
        sqendtime: '',
        nj: '',
        xymc: '',
        zymc: '',
        bjmc: '',
        xyids: [],
        xyid: '',
        zyids: [],
        zyid: '',
        bjids: [],
        bjid: '',
        selbegintime: new Date(),
        selendintime: new Date(),
        selsqbegintime: new Date(),
        selsqendintime: new Date(),
        popupVisible0: false,
        popupVisible1: false,
        popupVisible2: false,
        popupVisible3: false,
        popupVisible4: false,
        popupVisible5: false,
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
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        slots3: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        slots4: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        slots5: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'center'
          }
        ],
        lmids: [],
        xmids: [],
        canzhuijia: 2,
        canshenqing: true,
        picker2: ''
      }
    },
    created: function () {
      console.clear()
      this.initialize()
    },
    mounted: function () {
      this.nj = new Date().getFullYear().toString()
      this.getlmxm('', this.nj)
      this.slots2[0].values = []
      var year = new Date().getFullYear().toString()
      for (var i = 0; i < 5; i++) {
        var xx = year - i
        this.slots2[0].values.push(xx)
      }
      this.picker2.setSlotValue(0, year)
    },
    computed: {
      isfanweishow: function () {
        var isfaweishowxx
        if (this.canshenqing === 'true') {
          isfaweishowxx = true
        } else {
          isfaweishowxx = false
        }
        return isfaweishowxx
      }
    },
    methods: {
      isupscoreok: function () {
        if (this.fzup <= 0 || isNaN(this.fzup)) {
          this.fzup = ''
          Toast({
            message: '分值上限格式错误',
            position: 'middle',
            duration: 5000
          })
        } else {
          if (this.fzup <= 1) {
            alert('jjj')
            if (this.fzup.length > 3) {
              this.fzup = ''
              Toast({
                message: '分值上限格式错误',
                position: 'middle',
                duration: 5000
              })
            }
          } else {
//            alert('oo')
            if (this.fzup.length > 2) {
              this.fzup = ''
              Toast({
                message: '分值上限格式错误',
                position: 'middle',
                duration: 5000
              })
            }
          }
        }
      },
      onValuesChange0 (picker, values) {
//        console.log(picker)
//        console.log(values[0] + '1111')
        if (values[0] === undefined) {
//          alert('undefined')
//          alert('ooo')
        } else {
//          console.log(this.lmids + '//')
          this.lmmc = values[0]
          for (var i = 0; i < this.slots0[0].values.length; i++) {
            if (this.lmmc === this.slots0[0].values[i]) {
//              console.log(this.lmids)
              var pid = this.lmids[i]
              this.lmid = pid
              this.getlmxm(pid, this.nj)
            }
          }
        }
      },
      onValuesChange1 (picker, values) {
        if (values[0] === undefined) {
//          alert('undefined')
        } else {
          console.log(this.lmids + '//')
          this.xmmc = values[0]
        }
      },
      onValuesChange2 (picker, values) {
        if (values[0] === undefined) {
          this.picker2 = picker
          picker.setSlotValue(0, '2017')
        } else {
//          console.log(this.lmids + '//')
          this.nj = values[0]
          this.getBaseinfo('1', '', this.nj)
        }
      },
      onValuesChange3 (picker, values) {
        if (values[0] === undefined) {
        } else {
//          console.log(this.lmids + '//')
          this.xymc = values[0]
        }
      },
      onValuesChange4 (picker, values) {
        if (values[0] === undefined) {
        } else {
//          console.log(this.lmids + '//')
          this.zymc = values[0]
        }
      },
      onValuesChange5 (picker, values) {
        if (values[0] === undefined) {
        } else {
//          console.log(this.lmids + '//')
          this.bjmc = values[0]
        }
      },
      openpoper0: function () {
        this.popupVisible0 = true
      },
      openpoper1 () {
        this.popupVisible1 = true
      },
      openpoper2 () {
        this.popupVisible2 = true
      },
      openpoper3 () {
        this.popupVisible3 = true
      },
      openpoper4 () {
        this.popupVisible4 = true
      },
      openpoper5 () {
        this.popupVisible5 = true
      },
      hidefaqi: function () {
        this.$emit('hidefaqi')
      },
      openPicker0 () {
        this.$refs.picker0.open()
      },
      openPicker1 () {
        this.$refs.picker1.open()
      },
      openPicker2 () {
        this.$refs.picker2.open()
      },
      openPicker3 () {
        this.$refs.picker3.open()
      },
      getlmxm (pid0, nj0) {
        var that = this
        console.log(pid0)
        var url = '/sms-wx/assessController.do?getExamintoMapList'
        axios.post(url, qs.stringify({pid: pid0, type: '1', nj: nj0})).then(function (data) {
//          console.log(data)
          if (typeof data.data === 'object') {
            if (typeof data.data === 'object') {
              if (data.data.obj === 'needlogin') {
//                window.localStorage.clear()
                window.location.reload(true)
              } else {
                if (data.data.success === true) {
//                  console.log(data.data.msg)
                  var datamsg = JSON.parse(data.data.msg)
                  console.log(pid0 + '///////')
                  if (pid0 === '' || pid0 === undefined) {
//                    alert('kkkk')
                    that.slots0[0].values = []
                    for (var i = 0; i < datamsg.length; i++) {
                      that.slots0[0].values.push(datamsg[i].columnname)
                      that.lmids.push(datamsg[i].id)
                      setTimeout(function () {
                      }, 200)
                    }
                  } else {
//                    alert('9999')
                    that.slots1[0].values = []
                    for (var n = 0; n < datamsg.length; n++) {
                      that.slots1[0].values.push(datamsg[n].columnname)
                      that.xmids.push({id: datamsg[n].id, score: datamsg[n].score})
                      setTimeout(function () {
                      }, 200)
                    }
                  }
                }
              }
            }
          }
        })
      },
      getBaseinfo: function (type, pid, nj) {
        console.log(type, pid, nj)
        var that = this
        var url = '/sms-wx/assessController.do?getBaseinfo'
        axios.post(url, qs.stringify({type: type, pid: pid, nj: nj})).then(function (data) {
          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              that.$router.push('/dist/zhuye')
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                var datamsg = JSON.parse(data.data.msg)
                if (type === '1') {
                  that.slots3[0].values = []
                  for (var i = 0; i < datamsg.length; i++) {
                    console.log(datamsg[i])
                    that.slots3[0].values.push(datamsg[i].departname)
                    that.xyids.push(datamsg[i].id)
                  }
                } else if (type === '2') {
                  that.slots4[0].values = []
                  for (var n = 0; n < datamsg.length; n++) {
                    console.log(datamsg[n])
                    that.slots4[0].values.push(datamsg[n].zymc)
                    that.zyids.push(datamsg[n].id)
                  }
                } else if (type === '3') {
                  that.slots5[0].values = []
                  for (var m = 0; m < datamsg.length; m++) {
                    console.log(datamsg[m])
                    that.slots5[0].values.push(datamsg[m].bjmc)
                    that.bjids.push(datamsg[m].id)
                  }
                }
              }
            }
          }
        })
      },
      submitdata: function () {
        var that = this
        if (this.title !== '' && this.fzup !== '' && this.fqdw !== '' & this.content !== '') {
          var url = '/sms-wx/assessController.do?addOrUpdateAccess'
          axios.post(url, qs.stringify({
            title: this.title,
            upscore: this.fzup,
            depent: this.fqdw,
            startdate: this.khbegintime,
            enddate: this.khendtime,
            fprojectcode: this.lmid,
            fprojectname: this.lmmc,
            projectcode: this.xmid,
            projectname: this.xmmc,
            isaddscore: this.canzhuijia,
            applystartdate: this.sqbegintime,
            applystartend: this.sqendtime,
            nj: this.nj,
            bjdm: this.bjid,
            content: this.content
          })).then(function (data) {
            console.log(data)
            if (typeof data.data === 'object') {
              if (data.data.obj === 'needlogin') {
//                window.localStorage.clear()
                that.$router.push('/dist/zhuye')
                window.location.reload(true)
              } else {
                if (data.data.success === true) {
                  Toast({
                    message: '操作成功！',
                    position: 'middle',
                    duration: 3000
                  })
                  that.hidefaqi()
                } else {
                  Toast({
                    message: '操作失败！',
                    position: 'middle',
                    duration: 3000
                  })
                  that.hidefaqi()
                }
              }
            }
          })
        } else {
          Toast({
            message: '所有项目都是必填项！',
            position: 'middle',
            duration: 3000
          })
        }
      },
      initialize: function () {
        console.log(this.$data)
//        this.$data = [{
//          title: '',
//          fzup: '',
//          fqdw: '',
//          lmmc: '',
//          xmmc: '',
//          lmid: '',
//          xmid: '',
//          score: '',
//          content: '',
//          khbegintime: '',
//          khendtime: '',
//          sqbegintime: '',
//          sqendtime: '',
//          nj: '',
//          xymc: '',
//          zymc: '',
//          bjmc: '',
//          xyids: [],
//          xyid: '',
//          zyids: [],
//          zyid: '',
//          bjids: [],
//          bjid: '',
//          selbegintime: new Date(),
//          selendintime: new Date(),
//          selsqbegintime: new Date(),
//          selsqendintime: new Date(),
//          popupVisible0: false,
//          popupVisible1: false,
//          popupVisible2: false,
//          popupVisible3: false,
//          popupVisible4: false,
//          popupVisible5: false,
//          slots0: [
//            {
//              flex: 1,
//              values: ['...'],
//              className: 'slot1',
//              textAlign: 'center'
//            }
//          ],
//          slots1: [
//            {
//              flex: 1,
//              values: ['...'],
//              className: 'slot1',
//              textAlign: 'center'
//            }
//          ],
//          slots2: [
//            {
//              flex: 1,
//              values: [],
//              className: 'slot1',
//              textAlign: 'center'
//            }
//          ],
//          slots3: [
//            {
//              flex: 1,
//              values: [],
//              className: 'slot1',
//              textAlign: 'center'
//            }
//          ],
//          slots4: [
//            {
//              flex: 1,
//              values: [],
//              className: 'slot1',
//              textAlign: 'center'
//            }
//          ],
//          slots5: [
//            {
//              flex: 1,
//              values: [],
//              className: 'slot1',
//              textAlign: 'center'
//            }
//          ],
//          lmids: [],
//          xmids: [],
//          canzhuijia: 2,
//          canshenqing: true,
//          picker2: ''
//        }]
      }
    },
    watch: {
      selbegintime: function (newval) {
        var month = newval.getMonth() + 1
        this.khbegintime = newval.getFullYear() + '-' + month + '-' + newval.getDate() + ''
      },
      selendintime: function (newval) {
        var month = newval.getMonth() + 1
        this.khendtime = newval.getFullYear() + '-' + month + '-' + newval.getDate() + ''
      },
      selsqbegintime: function (newval) {
        var month = newval.getMonth() + 1
        this.sqbegintime = newval.getFullYear() + '-' + month + '-' + newval.getDate() + ''
      },
      selsqendintime: function (newval) {
        var month = newval.getMonth() + 1
        this.sqendtime = newval.getFullYear() + '-' + month + '-' + newval.getDate() + ''
      },
      xmmc: function () {
//        alert(this.xmmc)
        console.info(this.slots1[0].values)
        for (var i = 0; i < this.slots1[0].values.length; i++) {
          if (this.xmmc === this.slots1[0].values[i]) {
            var pid = this.xmids[i].id
            this.xmid = pid
            this.score = this.xmids[i].score
          }
        }
      },
      xymc: function () {
        // alert(this.xymc + '///')
        for (var i = 0; i < this.slots3[0].values.length; i++) {
          if (this.xymc === this.slots3[0].values[i]) {
            this.xyid = this.xyids[i]
            // alert(this.xyid)
            this.getBaseinfo('2', this.xyid, this.nj)
          }
        }
      },
      zymc: function () {
        for (var i = 0; i < this.slots4[0].values.length; i++) {
          if (this.zymc === this.slots4[0].values[i]) {
            this.zyid = this.zyids[i]
            // alert(this.xyid)
            this.getBaseinfo('3', this.zyid, this.nj)
          }
        }
      },
      bjmc: function () {
        for (var i = 0; i < this.slots5[0].values.length; i++) {
          if (this.bjmc === this.slots5[0].values[i]) {
            this.bjid = this.bjids[i]
          }
        }
      }
    }
  }
</script>
<style>
  .el-icon-arrow-right{
    color:#ccc;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input{ outline:none; -webkit-tap-highlight-color:rgba(255,0,0,0);}
  .faqikaohe{ width:100%; height:100%; position:fixed; z-index:100; overflow:scroll; background:#ecedf1;top:0px;}
  .boxview{ padding-bottom:50px; max-height:759px;transition: max-height 2s;
    -moz-transition: max-height 2s;	/* Firefox 4 */
    -webkit-transition: max-height 2s;	/* Safari 和 Chrome */
    -o-transition: max-height 2s;}
  .Row{ width:100%; height:44px; background:#fff; position:relative; font-size:16px; margin-top:15px;}
  .line{ width:100%; height:44px; background:#fff; position:relative; font-size:16px; border-top:1px solid #eee;}
  .viewLeft{ position:absolute; left:15px; width:85px; height:44px; line-height:44px; color:#333; text-align:left;}
  .viewRight{ position:absolute; left:100px; width:calc(100% - 115px); height:44px; line-height:44px; color:#333; text-align:left;}
  .Left{ position:absolute; left:15px; width:calc(50% - 15px); height:44px; line-height:44px; text-align:left;}
  .Right{ position:absolute; right:15px; width:calc(50% - 15px); height:44px; line-height:44px; color:#333; text-align:right;}
  .controlView{ width:100%; height:44px; position:relative;}
  .control{ position:absolute; width:calc(100% - 26px); height:44px;}
  .arrow{ position:absolute; width:16px; height:44px; top:0px; right:0px;}
  .inp{ width:100%; height:24px; line-height:24px; padding:10px 0px; border:0px; font-size:16px; color:#333; text-align:left;}
  .inpView{ width:100%; height:24px; line-height:24px; padding:10px 0px; border:0px; font-size:16px; color:#333; text-align:right;}
  .txtArea{ padding:10px 15px; background:#fff; overflow:hidden; margin:15px 0px;}
  .Area{ width:100%; height:auto; line-height:24px; font-size:16px; border:0px; outline:none; -webkit-tap-highlight-color:rgba(255,0,0,0);}
  .tijiao{ position:fixed; bottom:0px; width:100%; height:50px; line-height:50px; font-size:16px; text-align:center;}
  .goReturn{ float:left; width:50%; height:50px; background:#ccc; color:#000;}
  .goSubmit{ float:left; width:50%; height:50px; background:#1d90e6; color:#fff;}
  .seltimeinput{
    border: 0;
    width:calc(100%);
    text-align: right;
    height:42px;
    position:absolute;
    left:0px;
    /*background-color:red;*/
    font-size: 15px;
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
</style>
