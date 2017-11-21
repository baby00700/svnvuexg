<template>
  <div class="lianxiren">
    <div class="lxrwrap">
    <div class="lxrcardwrap" v-for="item in lxrlist">
      <div class="cardtop">
        <div class="cardleft">
          <div class="cardtxl"></div>
          <div class="xm"><nobr>{{item.xm}}</nobr></div>
        </div>
        <div class="cardright">
          <div class="cardtxr"></div>
          <div class="xb">{{item.xb}}</div>
        </div>
      </div>
      <div class="cardbottom">
        <div class="phoneicon"></div>
        <div class="phone"><a :href='item.lxdh'></a><nobr>{{item.lxdh}}</nobr></div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import bus from '@/components/bus.js'   // 事件总线
  export default {
    name: 'lianxiren',
    data () {
      return {
        lxrlist: [
          {xm: '...', xb: '...', lxdh: '...'},
          {xm: '...', xb: '...', lxdh: '...'},
          {xm: '...', xb: '...', lxdh: '...'},
          {xm: '...', xb: '...', lxdh: '...'},
          {xm: '...', xb: '...', lxdh: '...'}
        ],
        loading2: true
      }
    },
    created: function () {
      window.localStorage.setItem('step', 'self')
      var islogin = window.localStorage.getItem('isloginsuccess')
      var that = this
      bus.$on('loginsuccessfromroot', function () {  // 从app触发 从login触发
        that.getlxrlist()
      })
      if (islogin === 'true') {
        that.getlxrlist()
      }
    },
    beforeDestroy: function () {
      let that = this
      bus.$off('loginsuccessfromroot', function () {
        that.newslist.splice(0, that.newslist.length)
        that.getnewslistdata()
      })
    },
    mounted: function () {
    },
    methods: {
      getlxrlist: function () {
        console.log('ll')
        var that = this
        var url = '/sms-wx/smsUserController.do?getContacts'
        axios.post(url).then(function (data) {
          console.log(data)
          if (data.data.obj !== 'needlogin') {
            var lxrlist = JSON.parse(data.data.msg)
            console.log(lxrlist)
            for (var i = 0; i < lxrlist.length; i++) {
              var xb = lxrlist[i].xb
              if (xb === '1') {
                xb = '男'
              } else if (xb === '2') {
                xb = '女'
              }
              var phoneisopen = lxrlist[i].phoneisopen
              if (phoneisopen === '0') {
                lxrlist[i].lxdh = '未公开'
              }
              lxrlist[i].xb = xb
            }
            that.lxrlist = lxrlist
            that.loading2 = false
          } else {
            that.$router.push('/dist/zhuye')
            window.location.reload(true)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

  .lianxiren{
    width: 100%;
    padding-bottom:76px;
    overflow: scroll;
  }
  .lxrwrap{
    width:100%;
    height:100%;
  }
.lxrcardwrap{
  height:85px;
  width:calc(100% -30px);
  background-color:#fff;
  border-bottom:4px solid #38adff;
  margin: 0px 15px;
  margin-top: 15px;
  border-radius: 6px;
}
  .cardtop{
    width:calc(100% - 30px);
    height:42px;
    border-bottom:1px solid #eee;
    margin:0px 15px;
    text-align: left;
  }
  .cardbottom{
    width:calc(100% - 30px);
    height:42px;
    margin:0px 15px;
    text-align: left;
  }
  .cardleft{
    width:65%;
    height:42px;
    /*background-color:red;*/
    float: left;
  }
  .cardtxl{
    width:16px;
    height:16px;
    /*background-color: gray;*/
    float: left;
    margin-top:13px;
    background-image: url(../../../static/img/tx.png);
    background-size: 100% 100%;
  }
  .xm{
    width:calc(100% - 30px);
    height:42px;
    line-height: 42px;
    float: left;
    margin-left:8px;
    color:#333;
    font-size:16px;
    overflow:hidden;text-overflow:ellipsis;
  }
  .cardright{
    width:35%;
    height:42px;
    /*background-color:blue;*/
    float: left;
    position: relative;
  }
  .cardtxr{
    width:16px;
    height:16px;
    position: absolute;
    right: 24px;
    top:13px;
    background-image: url(../../../static/img/xb.png);
    background-size: 100% 100%;
  }
  .xb{
    width:24px;
    height:42px;
    float: right;
    text-align: right;
    color:#999;
    line-height: 40px;
  }
  .phoneicon{
    width:16px;
    height:16px;
    /*background-color: gray;*/
    float: left;
    margin-top:13px;
    background-image: url(../../../static/img/phone.png);
    background-size: 100% 100%;
  }
  .phone{
    width:calc(100% - 24px);
    height: 42px;
    line-height: 42px;
    margin-left: 24px;
    color:#38adff;
    font-size: 16px;
    overflow:hidden;text-overflow:ellipsis;
  }
</style>
