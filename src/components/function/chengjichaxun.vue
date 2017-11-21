<template>
  <div class="chengjichaxun" >
    <div class="selfinfo">
      <div class="topinfo">
        <div class="xm0">姓名:<span style="color:#1d90e6">{{xm}}</span></div>
        <div class="xh">{{usertypename}}:<span style="color:#1d90e6">{{hm}}</span></div>
      </div>
      <div class="selxq" @click="showpop">
        <div class="xm0">选择学年学期:</div>
        <div class="xh"><input type="text" placeholder="请选择学年学期" v-model="selxq" class="selxqinput" readonly="readonly"></div>
      </div>
    </div>
    <div class="listwrap">
      <div class="baseline" v-for="item in datalist">
        <div class="linetop">
          <div class="left"><nobr>课程：{{item.kcmc}}</nobr></div>
          <div class="right">得分:{{item.cj}}分</div>
        </div>
        <div class="linebottom">{{item.kclb1}}</div>
      </div>
    </div>
    <div class="bottons" @click="goback()">返回</div>

    <mt-popup
      v-model="popupVisible"
      position="bottom"
      style="width:100%">
      <mt-picker :slots="slots" @change="onValuesChange" :visibleItemCount="3" :showToolbar="true"><slot>
        <div class="quxiao bar" @click="hidepop0">取消</div>
        <div class="queding bar" @click="hidepop0">确定</div>
      </slot></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import {Popup, Picker, Toast} from 'mint-ui'
  const qs = require('qs')
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)
  export default {
    name: 'chengjichaxun',
    data () {
      return {
        xm: '',
        usertypename: '',
        hm: '',
        datalist: [],
        popupVisible: false,
        slots: [
          {
            flex: 1,
            values: [],
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: ['上学期', '下学期'],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        dqyear: '',
        years: [],
        selxq: '',
        sendxq: ''
      }
    },
    created: function () {
      this.sendxq = ''
      this.getyear()
      this.getselfinfo()
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
      getcjinfo: function (year) {
        var that = this
        this.datalist = []
        var url = '/sms-wx/assessController.do?getCj'
        axios.post(url, qs.stringify({xn: year})).then(function (data) {
//          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
//                console.log(data.data.msg)
                var datamsg = JSON.parse(data.data.msg)
                if (datamsg.length === 0) {
                  Toast({
                    message: '暂无成绩信息!',
                    position: 'middle',
                    duration: 3000
                  })
                } else {
                  for (var i = 0; i < datamsg.length; i++) {
//                    console.log(datamsg[i])
                    that.datalist.push(datamsg[i])
                  }
                }
//                console.log(that.datalist)
              }
            }
          }
        })
      },
      goback: function () {
        window.history.back()
      },
      showpop: function () {
        this.popupVisible = true
      },
      onValuesChange (picker, values) {
//        console.log(values[0])
        if (values[0] === undefined || values[1] === undefined) {
          this.selxq = ''
        } else {
          this.selxq = values[0] + '' + values[1]
          var xn = this.selxq.substring(0, 4)
          var xq
          if (values[1] === '上学期') {
            xq = 0
          } else {
            xq = 1
          }
          this.sendxq = xn + xq
          this.getcjinfo(this.sendxq)
        }
      },
      getyear: function () {
        var myDate = new Date()
        this.dqyear = myDate.getFullYear()
        this.setselvalues()
      },
      setselvalues: function () {
        var dqyear = this.dqyear + 1
        var newyear = this.dqyear + 2
        var years
        for (var i = 5; i > 0; i--) {
//          console.log(i)
          dqyear = dqyear - 1
          newyear = newyear - 1
          years = dqyear + '-' + newyear
          this.slots[0].values.push(years)
        }
      },
      hidepop0: function () {
        this.popupVisible = false
      }
    },
    watch: {
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
  .chengjichaxun{
    width:100%;
    height:100%;
    z-index:100;
    overflow: scroll;
    background-color:#ecedf1;
  }
  .topinfo{
    height:40px;
    width:100%;
    background-color:#fff;
    /*border-bottom: 1px solid #ccc;*/
    line-height: 40px;
    font-size: 15px;
    position: fixed;
    top:0px;
  }
  .selxq{
    height:40px;
    width:100%;
    background-color:#fff;
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    font-size: 15px;
    position: fixed;
    top:40px;
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
  .listwrap{
    width:100%;
    height:auto;
    overflow: scroll;
    padding-bottom:60px;
    margin-top:86px;
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
    overflow:hidden;text-overflow:ellipsis;
  }
  .right{
    width:50%;
    float: left;
    text-align: right;
  }
  .linebottom{
    height:30px;
    width:90%;
    overflow: hidden;
    font-size:14px;
    color:#999;
    text-align: left;
    margin-left: 5%;
    line-height: 30px;
  }
  textarea{
    width:90%;
    height:50px;
    border:none;
    font-size: 15px;
    color:#999;
    resize: none;
  }
  .selxqinput{
    width:100%;
    height:36px;
    border:0;
    text-align: right;
    font-size:15px;
    color:#1d90e6;
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
