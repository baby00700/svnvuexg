<template>
  <div class="dafen"  v-loading="loading" >
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
    <div class="boxview" style="z-index: 1;padding-bottom:60px;">
      <div class="count">总人数：{{count}}</div>
      <div class="rows" v-for="(item, $index) in datalist">
        <div class="cardtop">
          <div class="xh"><nobr>学号:{{item.xh}}</nobr></div>
          <div class="xm"><nobr>姓名:{{item.xm}}</nobr></div>
          <div class="df">
            <div class="dfzt" :style="item.color">{{item.statuswz}}</div>
            <!--<div class="dfcz"></div>-->
          </div>
        </div>
        <div class="cardmid">
          <div class="fz">分值:{{item.score}}</div>
          <div class="ztan">
            <div class="fzfont" v-if="item.isshowaddscore" @click="shouzhuijia($index)">追加分值<span v-if="item.isaddscorenumshow">:{{item.addscore}}</span></div>
            <div class="fzfont" v-if="item.ishideaddscore" style="color:#333">追加分值：{{item.addscore}}</div>
          </div>
        </div>
        <div class="cardbot" >
          <div class="bz" style="color:#999;"><input style="color:#888;"  type="text" class="txt" placeholder="请输入扣分或加分原因(限50个字以内)" v-model="item.remark" :change="setremark($index)"/></div>
        </div>
      </div>
      <div class="loadmore" @click="loadmore()" v-show="isloadmoreshow">加载更多...</div>
    </div >
    <div class="tijiao" style="z-index: 10" v-if="isbottomshow">
      <div class="goReturn" @click="hidechakan()">返回</div>
      <div class="goSubmit" @click="submitpagedata()">提交本页</div>
    </div>
    <div class="tijiao" style="z-index: 10" v-if="isbackbottonshow">
      <div class="goReturn" @click="hidechakan()" style="width: 100%;background-color:#1D90E6;color:#fff;">返回</div>

    </div>
    <transition  name="custom-classes-transition"
                 enter-active-class="animated slideInUp"
                 leave-active-class="animated slideOutDown">
    <div class="fixed" v-if="iszhuijiashow" @click="hidezhuijia()">
      <div class="viewWindows" @click="eventstop()" style="position:relative">
        <div class="widtitle" style="position:relative">追加分值</div>
        <div class="winline" style="position:relative">
          <div class="winleft" style="position:relative">追加栏目</div>
          <div class="winright">
            <div class="controlView">
              <div class="control"><el-select v-model="value" placeholder="请选择栏目" @change="setxmsel()">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select></div>
              <!--<div class="arrow"><i class="el-icon-arrow-right"></i></div>-->
            </div>
          </div>
        </div>
        <div class="winline" style="position:relative">
          <div class="winleft" >追加得分项目</div>
          <div class="winright" >
            <div class="controlView" style="position:relative">
              <div class="control">
                <el-select v-model="value0" placeholder="请选择项目" @change="setscore()">
                  <el-option
                    v-for="item in options0"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <!--<div class="arrow" ><i class="el-icon-arrow-right"></i></div>-->
            </div>
          </div>
        </div>
        <div class="winline" style="position:relative">
          <div class="winleft" >分数</div>
          <div class="winright" >
            <div class="controlView" style="position:relative">
                <div class="control" style="right:13px">{{tempscore}}</div>
            </div>
          </div>
        </div>
        <div class="winArea" style="position:relative"><input type="text" style="position:relative" class="inpArea" v-model="remark2"  placeholder="备注(限50字以内)" /></div>
        <div class="wintj" v-show="ifwintjshow">
          <div class="winReturn" @click="hidezhuijia()">返回</div>
          <div class="winSubmit" @click="FormatdataAndsetdata()">确定</div>
        </div>
        <div class="wintj" v-show="ifwintj0show">
          <div class="winReturn" style="color:#999" >返回</div>
          <div class="winSubmit" ><mt-spinner type="triple-bounce" color="#26a2ff"></mt-spinner></div>
        </div>
      </div>
    </div>
    </transition>
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
    name: 'dafen',
    data () {
      return {
        iszhuijiashow: false,
        selshzt: '',
        isscore: '',
        istg: '1',
        checked: false,
        istipsshow: false,
        datalist: [],
        loading: false,
        popupVisible: false,
        slots: [
          {
            flex: 1,
            values: ['未打分', '已打分'],
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
        isshowaddscore: false,
        options: [],
        value: '',
        options0: [],
        value0: '',
        tempscore: '',
        thisindex: '',
        remark2: '',
        pushdatalist: [],
        ifwintjshow: true
      }
    },
    computed: {
      isbackbottonshow: function () {
        return !this.isbottomshow
      },
      ifwintj0show: function () {
        return !this.ifwintjshow
      }
    },
    created: function () {
      this.sftg = '1'
    },
    mounted: function () {
      this.selshzt = '请选择'
    },
    props: ['chakandata'],
    methods: {
      onValuesChange (picker, values) {
        this.pageindex = 1
        this.picker = picker
        this.selshzt = values[0]
        if (values[0] === '已打分') {
          this.isscore = 1
          this.isbottomshow = false
          this.pid = this.chakandata[0].id
        } else if (values[0] === '未打分') {
          this.isscore = 0
          this.isbottomshow = true
          this.pid = this.chakandata[0].id
        }
        this.datalist = []
        this.xh = ''
        if (this.pid !== '') {
//          alert(this.isscore)
          this.getdafenlist(this.pid, this.pageindex, this.xh, this.isscore)
        }
      },
      hidechakan: function () {
        this.$emit('hidedafen')
        this.datalist = []
        this.count = 0
        this.istipsshow = false
        this.isbottomshow = false
        this.datalist = []
        this.selshzt = '请选择'
        this.options = []
        this.options0 = []
        this.value = ''
        this.value0 = ''
      },
      getdafenlist: function (id, index, xh, isscore) {
        var that = this
        if (this.datalist.length === 0) {
          this.loading = true
        } else {
          this.loading = false
        }
        var url = '/sms-wx/assessController.do?getListAccessDetailapint'
        axios.post(url, qs.stringify({isscore: isscore, xh: xh, pid: id, pageindex: index, pagesize: 10})).then(function (data) {
          console.log(data)
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
                  console.log(datamsg)
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
                    for (var i = 0; i < datamsg.length; i++) {
                      var isaddscore = 0
                      var statuswz
                      var iszhuijiashow
                      var color
                      var addscore
                      if (datamsg[i].isscore === 0) {
                        statuswz = '未打分'
                        color = 'color:#4BA8EB'
                      } else if (datamsg[i].isscore === 1) {
                        statuswz = '已打分'
                        color = 'color:#55C500'
                      }
                      if (datamsg[i].isscore === 1 || isaddscore === 1) {
                        iszhuijiashow = false
                      } else if (datamsg[i].isscore === 0 && isaddscore === 0) {
                        iszhuijiashow = true
                      }
                      if (datamsg[i].addscore === null || datamsg[i].addscore === undefined || datamsg[i].addscore === '') {
                        addscore = 0
                      } else {
                        addscore = datamsg[i].addscore
                      }
                      var singdata = {
                        score: datamsg[i].score,
                        remark: datamsg[i].remark,
                        xh: datamsg[i].xh,
                        xm: datamsg[i].xm,
                        sqrq: datamsg[i].sqrq,
                        statuswz: statuswz,
                        id: datamsg[i].id,
                        isshowaddscore: iszhuijiashow,
                        ishideaddscore: !iszhuijiashow,
                        color: color,
                        isscore: isscore,
                        addscore: addscore,
                        isaddscorenumshow: false,
                        nj: datamsg[i].sznj
                      }
                      console.log(singdata)
                      that.datalist.push(singdata)
                      that.creatpushlist()
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
        this.getdafenlist(this.pid, this.pageindex, this.xh, this.isscore)
      },
      searchbut: function () {
        this.datalist = []
        this.getdafenlist(this.pid, this.pageindex, this.xh, this.isscore)
      },
      submitpagedata: function () {
        var that = this
        alert(that.isaddscore)
        var pushdatalist = JSON.stringify(that.pushdatalist)
        var dataall = {
          tlist: pushdatalist,
          isaddscore: that.isaddscore
        }
        var url = '/sms-wx/assessController.do?saveAccessDetailapint'
        axios.post(url, qs.stringify(dataall)).then(function (data) {
          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              that.$router.push('/dist/zhuye')
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                Toast({
                  message: '本页数据提交成功！请选择条件后点击查询继续打分！',
                  position: 'middle',
                  duration: 3000
                })
              } else {
                Toast({
                  message: '本页数据提交失败！',
                  position: 'middle',
                  duration: 3000
                })
              }
            }
          }
        })
        this.datalist = []
        this.selshzt = '请选择'
        this.options = []
        this.options0 = []
        this.value = ''
        this.value0 = ''
      },
      shouzhuijia: function (index) {
        console.log(index)
        this.iszhuijiashow = true
        this.ifwintjshow = true
        this.value = ''
        this.value0 = ''
        this.tempscore = ''
        var nj = this.datalist[index].nj
        this.getlmxm('', 1, index, nj)
      },
      hidezhuijia: function () {
        this.iszhuijiashow = false
      },
      eventstop: function () {
        event.cancelBubble = true
      },
      getlmxm: function (pid0, type0, index, nj0) {
        var that = this
        this.thisindex = index
        var url = '/sms-wx/assessController.do?getExamintoMapList'
        if (pid0 === '' || pid0 === undefined) {
          that.options = []
          that.value = ''
          axios.post(url, qs.stringify({pid: pid0, type: type0, nj: nj0})).then(function (data) {
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
                      var singdata = {
                        value: datamsg[i].id,
                        label: datamsg[i].columnname,
                        index: index
                      }
                      that.options.push(singdata)
                    }
                  }
                }
              }
            }
          })
        } else {
          that.options0 = []
          that.value0 = ''
          axios.post(url, qs.stringify({pid: pid0, type: type0})).then(function (data) {
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
                      var singdata = {
                        value: datamsg[i].id,
                        label: datamsg[i].columnname,
                        index: index,
                        score: datamsg[i].score
                      }
                      that.options0.push(singdata)
                    }
                  }
                }
              }
            }
          })
        }
      },
      setxmsel: function () {
        this.getlmxm(this.value, 1, this.thisindex)
      },
      setscore: function () {
        for (var i = 0; i < this.options0.length; i++) {
          console.log(i)
          if (this.options0[i].value === this.value0) {
//            alert(i)
            this.tempscore = this.options0[i].score
          }
        }
      },
      creatpushlist: function () {
        this.pushdatalist = []
        for (var m = 0; m < this.datalist.length; m++) {
          var id = this.datalist[m].id
          var remark = this.datalist[m].remark
          var templistdata = {
            id: id,
            remark: remark,
            addcolumnid: '',
            addcolumnname: '',
            addporjectid: '',
            addporjectname: '',
            addscore: '',
            remark2: ''
          }
          this.pushdatalist.push(templistdata)
        }
      },
      setremark: function (index) {
        this.pushdatalist[index].remark = this.datalist[index].remark
      },
      FormatdataAndsetdata: function (index0) {
        var addcolumnid = this.value
        var addcolumnname
        var index
        if (this.options.length !== 0) {
          index = this.options[0].index
        } else {
          index = index0
        }
        var addporjectid = this.value0
        var addporjectname
        var remark2 = this.remark2
        var addscore = this.tempscore
        for (var i = 0; i < this.options.length; i++) {
          console.log(i)
          if (this.options[i].value === addcolumnid) {
            addcolumnname = this.options[i].label
          }
        }
        for (var n = 0; n < this.options0.length; n++) {
          console.log(n)
          if (this.options0[n].value === addporjectid) {
            addporjectname = this.options0[n].label
          }
        }
        this.datalist[index].addscore = addscore
        if (addcolumnid !== undefined && addporjectid !== '' && addcolumnid !== '' && addporjectid !== undefined) {
          this.ifwintjshow = false
          this.pushdatalist[index].addcolumnid = addcolumnid
          this.pushdatalist[index].addcolumnname = addcolumnname
          this.pushdatalist[index].addporjectid = addporjectid
          this.pushdatalist[index].addporjectname = addporjectname
          this.pushdatalist[index].addscore = addscore
          this.pushdatalist[index].remark2 = remark2
          console.log(this.pushdatalist[index].addscore)
          if (this.pushdatalist[index].addscore !== 0) {
            this.datalist[index].isaddscorenumshow = true
          }
          var that = this
          setTimeout(function () {
            this.ifwintjshow = true
          }, 300)
          setTimeout(function () {
            that.hidezhuijia()
            Toast({
              message: '操作成功',
              position: 'middle',
              duration: 2000
            })
          }, 505)
        } else {
          if (this.options.length !== 0) {
            Toast({
              message: '请选择完整！',
              position: 'middle',
              duration: 2000
            })
          }
        }
      }
    },
    watch: {
      chakandata: function (newval) {
        console.clear()
        console.log(newval)
        this.pid = newval[0].id
        this.isaddscore = newval[0].isaddscore
        if (newval[0].isaddscore === '1') {
          this.isshowaddscore = true
        } else {
          this.isshowaddscore = false
        }
      },
      datalist: function (newval) {
        if (newval.length === 0) {
          this.isloadmoreshow = false
        }
      },
      isloadmoreshow: function () {
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
  .el-select-dropdown {


    max-width: 45%;

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
  .el-input__inner{
    border:0;
    text-align: right;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input{ outline:none; -webkit-tap-highlight-color:rgba(255,0,0,0);}
  .dafen{ width:100%; height:100%;position:fixed;top:0px;left:0px; z-index:100; overflow:scroll; background:#ecedf1;}
  .boxview{ padding-bottom:50px;}
  .rows{ width:calc(100% - 30px); height:auto; overflow:hidden; background:#fff; margin:20px 15px 0px 15px; border:1px solid #d9dade; box-sizing:border-box; border-radius:6px; font-size:14px;}
  .cardtop{ width:calc(100% - 20px); height:40px; margin:0 10px; border-bottom:1px solid #eee; position:relative;}
  .cardmid{ width:calc(100% - 20px); height:40px; margin:0 10px; border-bottom:1px solid #eee; position:relative;}
  .cardbot{ width:calc(100% - 20px); height:50px; margin:0 10px; position:relative;}
  .xh{ float:left; width:40%; height:40px; line-height:40px; text-align:left; overflow:hidden; text-overflow:ellipsis;}
  .xm{ float:left; width:calc(30% - 5px); height:40px; margin-left:5px; line-height:40px; text-align:left; overflow:hidden; text-overflow:ellipsis;}
  nobr{ white-space:nowrap;}
  .df{ float:left; width:calc(30% - 5px); height:40px; margin-left:5px; line-height:40px; text-align:right; color:#38adff; position:relative;}
  .dfzt{ position:absolute; width:calc(100% - 18px); right:0px; height:40px; text-align:right;}
  .dfcz{ position:absolute; width:18px; height:18px; right:0px; top:11px; background:#38adff;}
  .fz{ float:left; width:50%; height:40px; line-height:40px; text-align:left;}
  .ztan{ float:right; width:50%; height:40px; line-height:40px; text-align:right;}
  .fzfont{ color:#38adff;}
  .fzbtn{ float:right; width:auto; height:24px; font-size:13px; display:inline-block; line-height:24px; margin-top:8px; padding:0px 12px; background:#38adff; color:#fff; border-radius:24px;}
  .bz{ width:100%; height:30px; padding:10px 0px;}
  .txt{ width:100%; height:30px; border:0px; line-height:30px; font-size:14px;}

  .fixed{ width:100%; height:100%; background:#000; background:rgba(0,0,0,0.5); position:fixed; top:0px; left:0px; z-index:999;}
  .viewWindows{ position:absolute; width:calc(100% - 30px); height:280px; top:50%; margin:0px 15px; margin-top:-140px; border-radius:6px; background:#fff;}
  .widtitle{ width:100%; height:50px; line-height:50px; text-align:center; border-bottom:1px solid #eee;}
  .widtitle strong{ color:#38adff; font-size:18px;}
  .winline{ width:100%; height:40px; border-bottom:1px solid #eee; position:relative; font-size:14px;}
  .winleft{ position:absolute; width:calc(40% - 15px); height:40px; margin-left:15px; line-height:40px; text-align:left; left:0px; top:0px;}
  .winright{ position:absolute; width:calc(60% - 15px); height:40px; margin-right:15px; line-height:40px; text-align:right; right:0px; top:0px;}
  .controlView{ width:100%; height:40px; position:relative;}
  .control{ position:absolute; width:calc(100% - 20px); height:40px; right:0px; top:0px;}
  .inpView{ width:100%; height:24px; line-height:24px; padding:8px 0px; border:0px; font-size:14px; color:#333; text-align:right;}
  .arrow{ position:absolute; width:16px; height:40px; top:0px; right:0px; text-align:right;}
  .el-icon-arrow-right{ line-height:16px;}
  .winArea{ height:40px; padding:5px 15px;}
  .inpArea{ width:100%; height:24px; line-height:24px; padding:8px 0px; border:0px; font-size:14px; color:#333; text-align:left;}
  .wintj{ position:absolute; bottom:0px; width:100%; height:45px; line-height:45px; font-size:16px; text-align:center; border-top:1px solid #eee;}
  .winReturn{ float:left; width:50%; height:45px; color:#000; border-right:1px solid #eee; box-sizing:border-box;}
  .winSubmit{ float:left; width:50%; height:45px; color:#38adff;}
  .winReturn:active{ float:left; width:50%; height:45px; color:#fff;background-color:#38adff; border-right:1px solid #eee; box-sizing:border-box;}
  .winSubmit:active{ float:left; width:50%; height:45px; color:#fff;background-color:#38adff}

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
