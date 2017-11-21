<template>
  <div class="qiandaoliebiao">
    <div class="wrap0" v-show="isdefaultshow">
      <div class="topinfo">
        <div class="xm0"><nobr>姓名:<span style="color:#1d90e6">{{xm}}</span></nobr></div>
        <div class="xh"><nobr>{{usertypename}}:<span style="color:#1d90e6">{{hm}}</span></nobr></div>
      </div>
      <div class="listwrap">
        <transition-group  name="list" tag="p">
        <div class="historycard" v-for="(item, $index) in historylist" @click="lookmore($index)" v-bind:key="item.kcmc">
          <div class="baseline">
            <div class="kcmc"><nobr>课程名称:&nbsp;<span >{{item.kcmc}}</span></nobr></div>
          </div>
          <div class="baseline">
            <div class="bjmc"><nobr>班级:&nbsp;<span >{{item.bjmc}}</span></nobr></div>
            <div class="rs"><nobr>总人数:&nbsp;<span style="color:#38adff">{{item.zrs}}</span>&nbsp;实到人数:&nbsp;<span style="color:#38adff">{{item.rs}}</span></nobr></div>
          </div>
          <div class="baseline" style="border-bottom: none">
            <div class="time"><nobr><span>{{item.classtime}}</span></nobr></div>
            <div class="jc"><nobr>节次:&nbsp;<span style="color:#38adff">{{item.jcinfo}}</span></nobr></div>
          </div>
        </div>
        </transition-group>
        <div class="loadmore" @click="loadmore()" v-show="isloadmoreshow">点击加载更多</div>
      </div>
      <div class="bottons" @click="goBack()">返回</div>
    </div>

    <div class="xxlist" v-show="isxxlistshow">
      <div class="xxtop" v-for="item in xxtopinfo">
        <div class="xxtopline">
          <div class="con">班级:</div>
          <div class="con1"><nobr>{{item.xxbjmc}}</nobr></div>

        </div>

        <div class="xxtopline">
          <div class="xxtoprs">
            <div class="con">课程名称:</div>
            <div class="con1"><nobr>{{item.xxkcmc}}</nobr></div>
          </div>
        </div>
        <div class="xxtopline">
          <div class="xxtoprs">
            <div class="con">课程时间:</div>
            <div class="con1"><nobr>{{item.xxkcsj}}</nobr></div>
          </div>
        </div>
        <div class="xxtopline">
          <div class="xxtoprs">
            <div class="con">节次:</div>
            <div class="con1"><nobr>{{item.xxjcinfo}}</nobr></div>
          </div>
        </div>
        <div class="xxtopline" style="border-bottom: none">
          <div class="xxtoprs">
            <div class="con">总人数:{{item.xxzrs}}</div>
            <div class="con1">实到人数:{{item.xxrs}}</div>
          </div>
        </div>
      </div>
      <div class="xxlistwrap">
          <div class="studentcard" v-for="(item, $index) in studentlistcard" v-bind:class="{ active: item.isActive }" @click="toggleactive($index)">
            <div class="xxcardline">
              <div class="cardcon"><nobr>姓名:{{item.xm}}</nobr></div>
              <div class="cardcon1"><nobr>学号:{{item.xh}}</nobr></div>
            </div>
            <div class="xxcardline" >
              <div class="cardcon" style="color:#38adff">得分:{{item.score}}</div>
              <div class="cardcon1" :style="item.color"><nobr>{{item.status}}</nobr></div>
            </div>
            <textarea rows="3" cols="20" v-model="item.remark"  class="textarea" readonly="readonly" v-show="item.isActive">
            </textarea>
          </div>
      </div>
      <div class="hidexxlist" @click="hidexxlist()">返回</div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {Toast} from 'mint-ui'
  const qs = require('qs')
  export default {
    name: 'qiandaoliebiao',
    data () {
      return {
        xm: '',
        usertypename: '',
        hm: '',
        historylist: [],
        isxxlistshow: false,
        pageindex: 1,
        isloadmoreshow: true,
        isdefaultshow: true,
        xxtopinfo: [],
        studentlistcard: [
        ]
      }
    },
    mounted: function () {
      this.getselfinfo()
      this.gethistorulist(1)
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
      gethistorulist: function (index) {
        var that = this
        var url = '/sms-wx/assessController.do?getclassattendList'
        axios.post(url, qs.stringify({pageindex: index, pagesize: 4})).then(function (data) {
//          console.log(data)
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
//                console.log(data.data.msg)
                var datamsg = JSON.parse(data.data.msg)
                console.log(datamsg)
//                var timed = 0
//                var ii = 0
//                var a = function () {
//                  var singledata = {
//                    bjmc: datamsg[ii].bjmc,
//                    classtime: datamsg[ii].classtime,
//                    jcinfo: datamsg[ii].jcinfo,
//                    kcmc: datamsg[ii].kcmc,
//                    zrs: datamsg[ii].actualnum,
//                    rs: datamsg[ii].attendancenum,
//                    id: datamsg[ii].id
//                  }
//                  that.historylist.push(singledata)
//                  ii += 1
//                  if (ii === datamsg.length) {
//                  } else {
//                    setInterval(function () {
//                      a()
//                    })
//                  }
//                }
                for (var i = 0; i < datamsg.length; i++) {
                  console.info(datamsg[i])
                  var singledata = {
                    bjmc: datamsg[i].bjmc,
                    classtime: datamsg[i].classtime,
                    jcinfo: datamsg[i].jcinfo,
                    kcmc: datamsg[i].kcmc,
                    zrs: datamsg[i].actualnum,
                    rs: datamsg[i].attendancenum,
                    id: datamsg[i].id
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
        })
      },
      loadmore: function () {
        this.pageindex++
        this.gethistorulist(this.pageindex)
      },
      lookmore: function (index) {
        var that = this
        this.isxxlistshow = true
        this.isdefaultshow = false
        var topinfo = {
          xxbjmc: this.historylist[index].bjmc,
          xxkcmc: this.historylist[index].kcmc,
          xxkcsj: this.historylist[index].classtime,
          xxjcinfo: this.historylist[index].jcinfo,
          xxrs: this.historylist[index].rs,
          xxzrs: this.historylist[index].zrs
        }
        this.xxtopinfo = []
        this.studentlistcard = []
        this.xxtopinfo.push(topinfo)
        var pid = this.historylist[index].id
        console.log(pid)
        var url = '/sms-wx/assessController.do?getattendDetail'
        axios.post(url, qs.stringify({pid: pid})).then(function (data) {
          console.log(data)
          // studentlistcard
          if (typeof data.data === 'object') {
            if (data.data.obj === 'needlogin') {
//              window.localStorage.clear()
              window.location.reload(true)
            } else {
              if (data.data.success === true) {
                var datamsg = JSON.parse(data.data.msg)
                for (var i = 0; i < datamsg.length; i++) {
                  console.log(datamsg[i])
                  var status
                  var color
                  var remark
                  if (datamsg[i].status === 'Y') {
                    status = '已签到'
                    color = 'color:#1d90e6'
                  } else {
                    status = '未签到'
                    color = 'color:red'
                  }
                  if (datamsg[i].remark === '') {
                    remark = '未说明原因'
                  } else {
                    remark = datamsg[i].remark
                  }
                  var singdata = {
                    xm: datamsg[i].xm,
                    xh: datamsg[i].xh,
                    remark: remark,
                    score: datamsg[i].score,
                    color: color,
                    status: status,
                    isActive: false
                  }
                  that.studentlistcard.push(singdata)
                }
              }
            }
          }
        })
      },
      toggleactive: function (index) {
        this.studentlistcard[index].isActive = !this.studentlistcard[index].isActive
      },
      hidexxlist: function () {
        this.isdefaultshow = true
        this.isxxlistshow = false
      },
      goBack: function () {
        window.history.back()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .active{
    border:1px solid #1d90e6 !important;
    -webkit-box-shadow: 1px 1px 10px 2px rgba(29,144,230,.3) !important;
  }

  .qiandaoliebiao{
  width:100%;
  z-index:100;
  background-color:#ecedf1;
  overflow: scroll;

}
.topinfo{
  height:45px;
  width:100%;
  background-color:#fff;
  border-bottom: 1px solid #eee;
  line-height: 45px;
  font-size: 16px;
  position: fixed;
  top:0px;
  color: #333;
}
.xm0{
  position: absolute;
  top:0px;
  height:45px;
  width:calc(45% - 15px);
  /*background-color:red;*/
  left:15px;
  text-align: left;
  overflow:hidden;text-overflow:ellipsis;
}
.xh{
  position: absolute;
  top:0px;
  height:45px;
  width:calc(55% - 15px);
  /*background-color:green;*/
  right:15px;
  text-align: right;
  overflow:hidden;text-overflow:ellipsis;
}
  .listwrap{
    padding-top: 45px;
    width:100%;
    height:auto;
    /*background-color:red;*/
    padding-bottom:60px;
  }
  .historycard{
    width:calc(100% - 32px);
    background-color:#fff;
    border-bottom:3px solid #38adff;
    margin:0px 15px;
    margin-top:15px;
    border-radius:6px;
    overflow: hidden;
   }
  .baseline{
    height:40px;
    width:calc(100% - 30px);
    border-bottom:1px solid #eee;
    margin:0px 15px;
    font-size: 14px;
  }
  .kcmc{
    height:40px;
    width:100%;
    line-height:40px;
    text-align: left;
    overflow:hidden;text-overflow:ellipsis;
    font-size: 16px;
    color: #333;
  }
  .bjmc{
    width:40%;
    height:40px;
    line-height:40px;
    float: left;
    text-align: left;
    color: #333;
    overflow:hidden;text-overflow:ellipsis;
    font-size: 14px;
  }
.rs{
  width:calc(60% - 10px);
  height:40px;
  line-height:40px;
  float: left;
  text-align: right;
  margin-left: 10px;
  color: #999;
  overflow:hidden;text-overflow:ellipsis;
  font-size: 14px;
}
 .time{
    width:40%;
    height:40px;
    line-height:40px;
    float: left;
    text-align: left;
    color: #999;
    overflow:hidden;text-overflow:ellipsis;
    font-size: 14px;
  }
.jc{
  width:calc(60% - 10px);
  height:40px;
  line-height:40px;
  float: left;
  text-align: right;
  margin-left: 10px;
  color: #999;
  overflow:hidden;text-overflow:ellipsis;
  font-size: 14px;
}
  .bottons{
    height:50px;
    width:100%;
    background-color: #38adff;
    position:fixed;
    bottom:0px;
    line-height: 50px;
    color:#FFF;
  }
  .loadmore{
    width:100%;
    height:50px;
    font-size:16px;
    line-height: 50px;
    color:#1d90e6;
  }
  .xxlist{
    width:100%;
    height:100%;
    background-color:#ecedf1;
    z-index:110;
    position:fixed;
    top:0px;
    overflow: scroll;
  }
  .xxtop{
    width:100%;
    height:auto;
    border-bottom:1px solid #eee;
  }
.xxtopline{
  width:100%;
  height:40px;
  background-color:#fff;
  border-bottom:1px solid #eee;
  line-height: 40px;
  font-size: 16px;

}
.con{
  height:40px;
  width:80px;
  margin-left:15px;
  text-align: left;
  float: left;
  color: #333;
}
.con1{
  height:40px;
  width:calc(100% - 110px);
  margin-right:15px;
  text-align: right;
  float: left;
  overflow:hidden;text-overflow:ellipsis;
  color: #999;
}
.xxlistwrap{
  width:100%;
  height:auto;
  padding-bottom: 60px;
}
.studentcard{
  width:calc(100% - 30px);
  margin:0px 15px;
  margin-top:15px;
  border-bottom:4px solid #38adff;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  background-color:#fff;
  overflow: hidden;
}
.xxcardline{
  height:40px;
  width:calc(100% - 30px);
  margin: 0px 15px;
  border-bottom:1px solid #eee;
  font-size:14px;
}
.cardcon{
  height:40px;
  width:40%;
  text-align: left;
  float: left;
  overflow:hidden;text-overflow:ellipsis;
  line-height: 40px;
  color: #333;
}
.cardcon1{
  height:40px;
  width:60%;
  text-align: right;
  float: left;
  overflow:hidden;text-overflow:ellipsis;
  line-height: 40px;
  color: #999;
}
.textarea{
  width: 100%;
  border:0;
  height:60px;
  resize:none;
  color:#666;
}
  .hidexxlist{
    width:100%;
    height:50px;
    background-color: #1d90e6;
    line-height: 50px;
    color:#fff;
    position: fixed;
    bottom:0px;
  }

  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active 在低于 2.1.8 版本中 */ {
    opacity: 0;
    transform: translateY(30px);
  }
</style>
