<template>

  <div class="qingjia" style="background-color:#ecedf1">
    <div class="qingjiatype" @click="showpop()">
      请假类型{{selmonth}}-{{seldate}}
    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom" style="width:100%">
      <mt-picker :slots="slots" @change="onValuesChange" style="width:100%" :showToolbar="true"><slot><div class="selslot">
        <div class="left">月份</div>
        <div class="right">日期</div>
      </div></slot></mt-picker>
    </mt-popup>
  </div>
</template>

<script type="text/babel">
  import Vue from 'vue'
  import {Popup, Picker} from 'mint-ui'
  Vue.component(Popup.name, Popup)
  Vue.component(Picker.name, Picker)

  export default {
    name: 'qingjia',
    data () {
      return {
        popupVisible: false,
        selmonth: '',
        seldate: '',
        slots: [
          {
            flex: 1,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            className: 'slot1',
            textAlign: 'right',
            defaultIndex: 3
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [1, 2, 3],
            className: 'slot3',
            textAlign: 'left',
            defaultIndex: 3
          }
        ],
        datetime0: '',
        timepicker: ''
      }
    },
    created: function () {
      var currentMonth = new Date().getMonth()
      var currentDate = new Date().getDate()
      this.selmonth = currentMonth + 1
      this.seldate = currentDate
    },
    mounted: function () {
    },
    methods: {
      showpop: function () {
        this.popupVisible = true
        var currentMonth = new Date().getMonth()
        var currentDate = new Date().getDate()
        console.log(currentDate)
        this.selmonth = currentMonth + 1
        this.seldate = currentDate
        this.timepicker.setSlotValue(0, currentMonth + 1)
        this.timepicker.setSlotValue(1, currentDate)
      },
      onValuesChange (picker, values) {
        this.timepicker = picker
        this.selmonth = values[0]
        this.seldate = values[1]
        this.getdate(2017, values[0])
      },
      getdate: function (year, month) {
        this.slots[2].values = []
        var currentYear = new Date().getFullYear()
        var selMonthfirstdate = new Date(year, month - 1, 1).getDate()
        var selMonthlastdate = new Date(currentYear, month, 0).getDate()
        for (var i = selMonthfirstdate; i <= selMonthlastdate; i++) {
          this.slots[2].values.push(i)
         //  console.log(this.slots[2].values)
        }
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
    text-align: center;
  }
</style>
<style scoped>
  .qingjia{
    width:100%;
    height:100%;
    z-index:10000;
  }
  .selslot{
    width:100%;
    height:40px;
    border-bottom:1px solid #eee;
  }
  .left{
    width:50%;
    height:30px;
    margin-top:5px;
    float:left;
    line-height:30px;
    font-size:14px;
  }
  .right{
    width:calc(50% - 1px);
    height:30px;
    margin-top:5px;
    float:left;
    line-height:30px;
    border-left: 1px solid #eee;
    font-size:14px;
  }
</style>
