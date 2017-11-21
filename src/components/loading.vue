<template>
  <div class="loading">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>

    <div class="tip">正在注销...</div>
  </div>
</template>

<script>
  export default {
    name: 'bar',
    mounted: function () {
    },
    methods: {
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading{
    height:100%;
    width:100%;
    background-color:rgba(255,255,255,0.95);
    z-index:999;
    color:#2c3e50;
  }

  .spinner {
    width: 60px;
    height: 60px;
    position:fixed;
    top:calc(50% - 150px);
    left:calc(50% - 30px);
  }

  .double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #38adff;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    -webkit-animation: bounce 2.0s infinite ease-in-out;
    animation: bounce 2.0s infinite ease-in-out;
  }

  .double-bounce2 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  @-webkit-keyframes bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 50% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
      }
  }

  .tip{
    width:100%;
    height:25px;
    position:fixed;
    top:calc(50% + 50px);
    display:none;
  }
</style>
