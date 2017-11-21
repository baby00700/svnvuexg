<template>
  <div class="kebiaochaxun">
    <div class="tips" v-show="istipsshow" style="margin-top: 100px;">暂无课表信息!</div>
    <div class="boxview"  style="overflow: hidden" v-show="isboxviewshow">
      <div class="kblist">
        <div class="kbhead" style="position: fixed;top:0px;z-index:111">
          <ul>
            <li style="border-left: none;width:50px;height:40px;float: left">节次</li>
            <li class="zhouli" :class="{active0:isactive0}">周一</li>
            <li class="zhouli" :class="{active1:isactive1}">周二</li>
            <li class="zhouli" :class="{active2:isactive2}">周三</li>
            <li class="zhouli" :class="{active3:isactive3}">周四</li>
            <li class="zhouli" :class="{active4:isactive4}">周五</li>
          </ul>
        </div>
        <div class="linewrap">
          <div class="line" v-for="item in kblist">
            <ul>
              <li style="border-left: none;width:50px;height:160px;float: left;line-height: 150px;font-weight: 800;font-size: 14px">{{item.ks}}</li>
              <li  class="lineli" v-for="items in item.kc"><p v-bind:class="items.color" v-show="items.isshow">{{items.kcmc}}</p></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="tijiao">
      <div class="goReturn" @click="goback()">返回</div>
      <div class="goSubmit" @click="showpop()">{{tips}}</div>
    </div>

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
  import {Popup, Picker} from 'mint-ui'
  import axios from 'axios'
  const qs = require('qs')
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)
  export default {
    name: 'kebiaochaxun',
    data () {
      return {
        kblist: [],
        fir: [],
        sec: [],
        thi: [],
        fou: [],
        isActive: true,
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
        sendxq: '',
        tips: '选择学期',
        isboxviewshow: false,
        isactive0: false,
        isactive1: false,
        isactive2: false,
        isactive3: false,
        isactive4: false
      }
    },
    created: function () {
      this.sendxq = ''
      this.getyear()
      this.getKbxx()
      this.getdate()
    },
    computed: {
      istipsshow: function () {
        return !this.isboxviewshow
      }
    },
    mounted: function () {
    },
    methods: {
      getKbxx (xn0) {
        var that = this
        var url = '/sms-wx/assessController.do?getKbxx'
        axios.post(url, qs.stringify({xn: xn0})).then(function (data) {
          console.log(JSON.parse(data.data.msg))
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              that.$router.push('/dist/zhuye')
              window.location.reload(true)
            } else {
              console.log(data.data.success)
              if (data.data.success === true) {
                var datamsg = JSON.parse(data.data.msg)
                if (datamsg.length <= 0) {
                  that.isboxviewshow = false
                } else {
                  that.isboxviewshow = true
                }
                var fir = {
                  ks: '1-2',
                  kc: [
                    {kcmc: datamsg[0].K11, color: 'color1', isshow: false},
                    {kcmc: datamsg[0].K21, color: 'color2', isshow: false},
                    {kcmc: datamsg[0].K31, color: 'color3', isshow: false},
                    {kcmc: datamsg[0].K41, color: 'color4', isshow: false},
                    {kcmc: datamsg[0].K51, color: 'color5', isshow: false}
                  ]
                }
                var sec = {
                  ks: '3-4',
                  kc: [
                    {kcmc: datamsg[1].K12, color: 'color1', isshow: false},
                    {kcmc: datamsg[1].K22, color: 'color2', isshow: false},
                    {kcmc: datamsg[1].K32, color: 'color3', isshow: false},
                    {kcmc: datamsg[1].K42, color: 'color4', isshow: false},
                    {kcmc: datamsg[1].K52, color: 'color5', isshow: false}
                  ]
                }
                var thi = {
                  ks: '5-6',
                  kc: [
                    {kcmc: datamsg[2].K13, color: 'color1', isshow: false},
                    {kcmc: datamsg[2].K23, color: 'color2', isshow: false},
                    {kcmc: datamsg[2].K33, color: 'color3', isshow: false},
                    {kcmc: datamsg[2].K43, color: 'color4', isshow: false},
                    {kcmc: datamsg[2].K53, color: 'color5', isshow: false}
                  ]
                }
                var fou = {
                  ks: '7-8',
                  kc: [
                    {kcmc: datamsg[3].K14, color: 'color1', isshow: false},
                    {kcmc: datamsg[3].K24, color: 'color2', isshow: false},
                    {kcmc: datamsg[3].K34, color: 'color3', isshow: false},
                    {kcmc: datamsg[3].K44, color: 'color4', isshow: false},
                    {kcmc: datamsg[3].K54, color: 'color5', isshow: false}
                  ]
                }
                that.kblist = [fir, sec, thi, fou]
                for (var i = 0; i < that.kblist.length; i++) {
                  console.log(that.kblist[i].kc)
                  for (var n = 0; n < that.kblist[i].kc.length; n++) {
                    console.log(that.kblist[i].kc[n].kcmc)
                    if (that.kblist[i].kc[n].kcmc !== null) {
                      that.kblist[i].kc[n].isshow = true
                    } else {
                      that.kblist[i].kc[n].isshow = false
                    }
                  }
                }
              }
            }
          }
        })
      },
      showpop: function () {
        this.popupVisible = true
      },
      onValuesChange (picker, values) {
//        console.log(values[0])
        this.kblist = []
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
          this.tips = this.selxq
          this.getKbxx(this.sendxq)
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
      },
      goback () {
        window.history.back()
      },
      getdate () {
        var newdate = new Date().getDate()
        console.log(newdate)
      }
    },
    watch: {
    },
    components: {
    }
  }
</script>


<style scoped>
  *{ padding:0px; margin:0px;}
  .kebiaochaxun{ width:100%; height:100%; z-index:100; overflow:scroll; background:#ecedf1;background-image:url("../../../static/img/kbbg.png");background-repeat: no-repeat;background-size: 100% 100%}
  .boxview{ padding-bottom:70px;}
  .kblist{ position:fixed; width:100%; height:100%;  background-size:100%; overflow:scroll; padding-bottom: 70px;}
  /*.tabs{ border-collapse:collapse; color:#333; font-size:14px; table-layout:fixed; margin-bottom:60px;}*/
  /*.tabs th{ border:0px; line-height:24px; text-align:center; padding:10px 0px; background:#b6d6ff; border:1px solid #92c2fe; word-wrap:break-word;overflow: scroll}*/
  /*.tabs td{ border:0px; height:auto; text-align:center; padding:5px 5px; border:1px solid #add8f8; word-wrap:break-word;overflow: scroll}*/
  /*.cor1{ width:auto; height:100%; display:block; background:rgba(119,107,248,0.7); color:#fff; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; overflow-y: auto; padding:5px;font-size: 9px;text-overflow:ellipsis;}*/
  /*.cor2{ width:auto; height:100%; display:block; background:rgba(131,204,42,0.7); color:#fff; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; overflow-y: auto; padding:5px;font-size: 9px;text-overflow:ellipsis;}*/
  /*.cor3{ width:auto; height:100%; display:block; background:rgba(55,173,255,0.7); color:#fff; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; overflow-y: auto; padding:5px;font-size: 9px;text-overflow:ellipsis;}*/
  /*.cor4{ width:auto; height:100%; display:block; background:rgba(253,174,19,0.7); color:#fff; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; overflow-y: auto; padding:5px;font-size: 9px;text-overflow:ellipsis;}*/
  /*.cor5{ width:auto; height:100%; display:block; background:rgba(180,100,205,0.7); color:#fff; -moz-border-radius:5px; -webkit-border-radius:5px; border-radius:5px; overflow-y: auto; padding:5px;font-size: 9px;text-overflow:ellipsis;}*/
  .tijiao{ position:fixed; bottom:0px; width:100%; height:50px; line-height:50px; font-size:16px; text-align:center;}
  .goReturn{ float:left; width:calc(50% - 1px); height:50px; background:#1d90e6; color:#ddd;border-right:1px solid #4BA7EB;}
  .goSubmit{ float:left; width:50%; height:50px; background:#1d90e6; color:#fff;}

  .kbhead{
    height: 40px;
    width:100%;
    background-color:#B6D6FF;
    line-height:40px;
    font-size: 14px;
    border-bottom:1px solid #83B9FF;
    font-weight: 700;
  }
li{
  list-style: none;
}
.linewrap{
  margin-top:41px;
  padding-bottom: 50px;
  z-index:1;
}
  .zhouli{
    width:calc((100% - 55px) / 5);
    height:40px;
    float: left;

    border-left:1px solid #83B9FF;
  }
  .line{
    width:100%;
    height:160px;
    font-size: 11px;
    /*border-bottom:1px solid #83B9FF;*/
  }
  .lineli{
    width:calc((100% - 61px) / 5);
    height:160px;
    float: left;
    /*border-left:1px solid #83B9FF;*/
    position:relative;
    margin-left:1px;
  }
  .lineli p {
    width:90%;
    height:98%;
    position: absolute;
    top:1%;
    left:5%;
    /*background-color:red;*/
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
    border-radius: 4px;
    padding-left:2%;
  }

  .color1{  background:rgba(119,107,248,0.8); color:#fff;}
  .color2{  background:rgba(131,204,42,0.8); color:#fff;}
  .color3{  background:rgba(55,173,255,0.8); color:#fff;}
  .color4{  background:rgba(253,174,19,0.8); color:#fff;}
  .color5{  background:rgba(180,100,205,0.8); color:#fff;}
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
