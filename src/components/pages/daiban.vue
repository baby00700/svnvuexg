<template>
  <div class="xiaoxi">

    <ul>
      <li v-for="item in uselist">
        <div class="linewrap">
          <div class="icons" :class="listiconcolorclass[item.ww]">请</div>
          <div class="infos">
            <div class="titleinfo">
              <div class="title"><nobr>请点击查看待办</nobr></div>
              <div class="cont"><nobr>请点击查看待办详情...</nobr></div>
            </div>
            <div class="timeinfo">9月10日</div>
            <div class="refdot" >未读</div>
          </div>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
  // Math.floor(Math.random()*10)
  import Vue from 'vue'
  import { Loadmore } from 'mint-ui'
  Vue.component(Loadmore.name, Loadmore)
  export default {
    name: 'daiban',
    data () {
      return {
        list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        listiconcolorclass: ['color0', 'color1', 'color2', 'color3'],
        colorindex: -1,
        uselist: []
      }
    },
    mounted: function () {
      console.log('zy')
      this.$emit('mountedcomplete')
      this.setbgcolorrandom()
    },
    methods: {
      setbgcolorrandom: function () {
        var ran = Math.floor(Math.random() * 3)
        this.colorindex = ran
        for (var i = 0; i < this.list.length; i++) {
          console.log(this.list[i])
          var qq = this.list[i]
          this.colorindex = this.colorindex + 1
          var ww = this.colorindex
          if (this.colorindex >= 3) {
            this.colorindex = -1
          }
          var xx = {qq, ww}
          this.uselist.push(xx)
        }
        console.log(this.uselist)
      }
    },
    watch: {
      colorindex: function (newval, oldval) {
        if (newval > 3) {
          this.colorindex = 0
          // alert(newval)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .xiaoxi{
    width:100%;
    padding-bottom:60px;
    overflow: scroll;
    /*background-color: #1c8de0;*/

  }
  li{
    width:100%;
    height:81px;
    position: relative;
  }
  .loadmore{
    width:100%;
    height:100%;
    position: relative;
    /*background-color: red;*/
  }
  .linewrap{
    height:80px;
    width:100%;
    background-color:#fff;
    border-bottom: 1px solid #eee;
    position:absolute;
    top:0px;
  }
  .linewrap:active{
    height:80px;
    width:100%;
    background-color:#fff;
    border-bottom: 1px solid #eee;
    position:absolute;
    top:0px;
    -webkit-box-shadow: 0px 0px 18px 1px rgba(0,0,0,0.3) inset;
  }
  .icons{
    height:60px;
    width:60px;
    background-color:red;
    position: absolute;
    top:10px;
    left:10px;
    border-radius:30px;
    line-height:60px;
    font-size:24px;
    color:#fff;
    font-weight: 300;
  }
  .color0{
    background-color:#37ACFE;
  }
  .color1{
    background-color:#82CB2A;
  }
  .color2{
    background-color:#1AC4BA;
  }
  .color3{
    background-color:#488AFB;
  }
  .infos{
    width:calc(100% - 80px);
    height:60px;
    /*background-color:#00ffff;*/
    position:absolute;
    top:10px;
    left:80px;
  }
  .titleinfo{
    height:60px;
    width:calc(100% - 70px);
    /*background-color:#00ff00;*/
    position:relative;
  }
  .title{
    width:100%;
    height:30px;
    /*background-color:#1c8de0;*/
    position:absolute;
    text-align: left;
    line-height: 30px;
    font-size:18px;
    overflow:hidden;text-overflow:ellipsis;
  }
  .cont{
    width:100%;
    height:30px;
    /*background-color:#0000ff;*/
    position:absolute;
    top:30px;
    text-align: left;
    line-height: 30px;
    font-size:14px;
    color:#999;
    overflow:hidden;text-overflow:ellipsis;
  }
  .timeinfo{
    width:70px;
    height:30px;
    /*background-color:#00ff00;*/
    position:absolute;
    top:0px;
    right:0px;
    line-height: 30px;
    font-size:14px;
    color:#999;
  }
  .refdot{
    width:70px;
    height:30px;
    position: absolute;
    top:30px;
    right:0px;
    border-radius:7px;
    color:#37ACFE;
    font-size:13px;
    line-height:30px;
    font-weight: 100;
  }
</style>
