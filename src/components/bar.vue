<template>
  <div class="bar">
    <ul id="barname">

      <li v-for="(item, $index) in barnames" @click="topage($index)">
          <div class="barcon">
            <div class="bartb">
              <img :src='item.imgpath1' :alt="item.name"  v-show="item.showpath1">
              <img :src='item.imgpath2' :alt="item.name"  v-show="item.showpath2">
            </div>
            {{item.name}}
          </div>
      </li>

    </ul>
  </div>
</template>

<script>
  export default {
    name: 'bar',
    data () {
      return {
        barnames: [
          {name: '消息', value: 'xiaoxi', imgpath1: '../static/img/xiaoxi1.png', imgpath2: '../static/img/xiaoxi2.png', showpath1: true, showpath2: false},
          {name: '课表', value: 'daiban', imgpath1: '../static/img/daiban1.png', imgpath2: '../static/img/daiban2.png', showpath1: true, showpath2: false},
          {name: '主页', value: 'zhuye', imgpath1: '../static/img/zhuye1.png', imgpath2: '../static/img/zhuye2.png', showpath1: true, showpath2: false},
          {name: '联系人', value: 'lianxiren', imgpath1: '../static/img/lianxiren1.png', imgpath2: '../static/img/lianxiren2.png', showpath1: true, showpath2: false},
          {name: '我的', value: 'wode', imgpath1: '../static/img/wode1.png', imgpath2: '../static/img/wode2.png', showpath1: true, showpath2: false}
        ],
        barcons: ['xiaoxi', 'daiban', 'zhuye', 'lianxiren', 'wode'],
        DangQianPath: ''
      }
    },
    mounted: function () {
      this.DangQianPath = this.$route.path
      this.DangQianPath = this.DangQianPath.split('/')
      //  console.log(this.DangQianPath)
      var pathindex = 2
      for (var i = 0; i < this.barcons.length; i++) {
        if (this.barcons[i] === this.DangQianPath[2]) {
          pathindex = i
        }
      }
      // console.log(pathindex)
      this.topage(pathindex)
    },
    methods: {
      topage: function (index) {
        // console.log(window.history)
        this.$router.push('/dist/' + this.barnames[index].value)    // 默认进入主页
        // console.log(index)
        this.$el.childNodes[0].childNodes[index].style.color = '#38adff'
        this.barnames[index].showpath1 = false
        this.barnames[index].showpath2 = true
        for (var i = 0; i < this.barnames.length; i++) {
          if (i !== index) {
            this.barnames[i].showpath1 = true
            this.barnames[i].showpath2 = false
            this.$el.childNodes[0].childNodes[i].style.color = '#666666'
          }
        }
      }
    },
    watch: {
      '$route' (to, from) {                    // 控制动画方向
        // console.log(to.path + '**************')
        var pathass = to.path
        console.log(pathass)
        if (pathass === '/dist/' || pathass === '/') {
          this.$router.push('/dist/zhuye')
        }
        if (pathass !== '/') {
          pathass = pathass.split('/')
          console.log(pathass.length)
          // console.log(pathass)
          if (pathass.length === 3) {
            pathass = pathass[2]
            console.log(pathass.length + '******')
            for (var i = 0; i < this.barcons.length; i++) {
              if (this.barcons[i] === pathass) {
                console.log(i + '//**//')
                this.topage(i)
                break
              }
            }
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin:0px;
    padding:0px;
    -webkit-tap-highlight-color:rgba(255,0,0,0);
  }
  .bar{
    width:100%;
    height:60px;
    /*background-color:#fff;*/
    /*-wenkit-backdrop-filter: blur(10px);*/
    /*-wenkit-backdrop-filter: blur(10px);*/
    position: fixed;
    bottom:0px;
    /*-webkit-box-shadow: 0 -1px 10px 2px rgba(0,0,0,0.2);*/
    border-top:1px solid #eee;
    z-index:1;

  }
  li{
      width:20%;
      height:60px;
      background-color:#f7f7f7;
      /*background-color:rgba(255,255,255,0.1);*/
      /*backdrop-filter: blur(1px);*/
      /*-webkit-backdrop-filter: blur(10px);*/
      /*filter: blur(1px);*/
      float:left;
      list-style-type:none;
      color:#666666;
      font-size:12px;

    -webkit-backdrop-filter: blur(8px); /* Safari for macOS & iOS*/
    backdrop-filter: blur(8px); /* Google Chrome */
    background: rgba(250, 250, 250, 0.9); /* 设置背景半透明黑色 */


    }
  /*li:after{*/
    /*content: '';*/
    /*width:20%;*/
    /*height:60px;*/
    /*!*background-color:#f7f7f7;*!*/
    /*background-color:rgba(255,255,255,0.1);*/
    /*backdrop-filter: blur(1px);*/
    /*-webkit-backdrop-filter: blur(10px);*/
    /*filter: blur(1px);*/
    /*float:left;*/
    /*list-style-type:none;*/
    /*color:#666666;*/
    /*font-size:12px;*/
    /*z-index:-1;*/
  /*}*/
  .bartb{
    height:38px;
    width:100%;
    /*border:1px solid blue;*/
    position:relative;
  }

  .bartb img{
    width:24px;
    height:24px;
    position:absolute;
    top:7px;
    left:calc(50% - 12px);
  }
</style>
