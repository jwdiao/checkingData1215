<template>
  <div class="index">
    <!-- 头部 start -->
    <div class="index_top">
      <span class="title" @click="enterIndexPage">北京三一桩机三现数据中心</span>
      <em class="time" v-text="currentTime"></em>
      <div class="dayOrnight">
        <img v-show="dayOrNightStatus ==='白班'" src="../assets/images/index_sun.png" />
        <img v-show="dayOrNightStatus ==='夜班'" src="../assets/images/index_moon.png" />
        <span v-text="dayOrNightStatus">白班</span>
      </div>
    </div>
    <!-- 头部 end -->
    <!-- main start -->
    <div class="index_main">
      <div class="index_left">
        <AbnormalStatistics :info="baseInfo" :monthYearData="monthYearDataLeft" />
      </div>
      <div class="index_con">
        <Checking :info="baseInfo" :hourEchartsDataBetween="hourEchartsDataBetween" />
      </div>
      <div class="index_right">
        <attendance :dayInfo="dayEchartsDataRight" :monthInfo="monthEchartsDataRight" :yearInfo="yearEchartsDataRight" />
      </div>
    </div>
    <!-- main end -->
    <!-- 加工中心 start -->
    <MachingCenter @selectName="selectedCenterName" />
    <!-- 加工中心 end -->

  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'
import AbnormalStatistics from '@/components/AbnormalStatistics'
import Attendance from '@/components/Attendance'
import Checking from '@/components/checking'
import http from '../api/http'
export default {
  name: 'home',
  components:{
	AbnormalStatistics,
    Attendance,
    Checking
  },
  data () {
    return {
      centername: '', // 加工中心
      baseInfo: {}, // 基本信息
      monthYearDataLeft: {}, // 左侧异常年和月数据
      dayEchartsDataRight: {}, // 右侧日echarts图
      monthEchartsDataRight: {}, // 右侧月echarts图
      yearEchartsDataRight: {}, // 右侧年echarts图
      hourEchartsDataBetween: {}, // 中间一小时考勤
      timerId: '', // 定时器
      timerIdHour: '', // 中间小时的定时器
      currentTime: '', // 系统当前时间
      dayOrNightStatus: ''
    }
  },
  created () {
  },
  mounted () {
    // 顶部日期时间
    this.currentTime = this.getCurrentDateTime();
    this.cutTimeFun();
    setInterval(() => {
      this.currentTime = this.getCurrentDateTime();
      this.cutTimeFun()
    },1000)

    // 基本信息顶部
    this.getBaseInfoData(this.centername)

    // 左侧异常月和异常年
    this.getMonthYearLeftData (this.centername)

    // 右侧日/月/年统计
    this.getDayMonthYearRightData(this.centername, 'DAY')
    this.getDayMonthYearRightData(this.centername, 'MON')
    this.getDayMonthYearRightData(this.centername, 'YEAR')

    // 中间一小时echart图
    this.HourBetweenData(this.centername)



    // 定时器刷新
    this.timerId = setInterval(() =>{
      this.getBaseInfoData(this.centername)
      this.getMonthYearLeftData (this.centername)
      this.getDayMonthYearRightData(this.centername, 'DAY')
      this.getDayMonthYearRightData(this.centername, 'MON')
      this.getDayMonthYearRightData(this.centername, 'YEAR')
    },10000)
    this.timerIdHour = setInterval(() =>{
      this.HourBetweenData(this.centername)
    }, 30000)
  },
  methods: {
    enterIndexPage () {
      // 路径从state中获取
      window.location.href=`${this.$store.state.baseUrl}/sanyShebei` //测试
    },
    // 时间格式化
    getCurrentDateTime () {
      return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    cutTimeFun () {
      var timeY = this.currentTime.substring(11,13)
      if (timeY>=8 && timeY<20) {
        this.dayOrNightStatus = '白班'
      } else {
        this.dayOrNightStatus = '夜班'
      }
    },
    // 基本信息顶部
    async getBaseInfoData (centername) {
      const res = await http.post('/sanyAttendanceData/getAttendanceData', {centername: centername})
      if (res.data && res.data.ret == 200) {
        this.baseInfo = res.data.titledata
      }
    },
    // 左侧异常月和异常年
    async getMonthYearLeftData (centername) {
      const res = await http.post('/sanyUserPushRecord/getLateEchartsData', {centername: centername})
      if (res.data && res.data.ret == 200) {
        this.monthYearDataLeft = res.data
      }
    },
    // 右侧人员考勤日/月/年统计
    async getDayMonthYearRightData (centername, querySign) {
      const res = await http.post('/sanyUserPushRecord/getWorkEchartsData', {centername: centername, querySign: querySign})
      if (res.data && res.data.ret == 200) {
        if (querySign === 'DAY') {
          this.dayEchartsDataRight = res.data
        }
        if (querySign === 'MON') {
          this.monthEchartsDataRight = res.data
        }
        if (querySign === 'YEAR') {
          this.yearEchartsDataRight = res.data
        }
      }
    },
    // 中间一小时echart图
    async HourBetweenData (centername) {
      const res = await http.post('/sanyAttendanceData/getWorkIngEchartsData', {centername: centername})
      if (res.data && res.data.ret == 200) {
        // console.log('between:',res.data)
        this.hourEchartsDataBetween = res.data
      }
    },
    // 点击加工中心重新请求数据
    selectedCenterName (centername) {
      console.log('uu:',centername)
      this.centername = centername
      // 重新加载数据
      this.getBaseInfoData(this.centername)
      this.getMonthYearLeftData (this.centername)
      this.getDayMonthYearRightData(this.centername, 'DAY')
      this.getDayMonthYearRightData(this.centername, 'MON')
      this.getDayMonthYearRightData(this.centername, 'YEAR')
      this.HourBetweenData(this.centername)
    }
  },
  destroyed () {
    clearInterval(this.timerId)
    clearInterval(this.timerIdHour)
  }
}
</script>
<style lang="scss" scoped>
.index{
  height:100%;
  background-image: url(../assets/images/index_bg.png);
  background-size: cover;
  color: rgb(255, 255, 255);
  background-repeat: no-repeat;overflow: hidden;
  &_top{
    position: fixed;top:0;left:15px;right:15px;box-sizing: border-box;
    height: 106px;line-height: 106px;text-align: center;
    .title{font-size:44px;color:#fff;cursor: pointer;font-weight:bold;}
    .time{
      font-size:32px;
      color:#ababab;position: fixed;top:20px;right:190px;z-index: 10;width: 225px;text-align: left;
      font-family: fontnameUnidreamLED !important;
    }
    .dayOrnight{
      position: absolute;top:20px;left:0;
      img{vertical-align: middle;width: 86px;}
      span{
        font-size:38px;color:#ababab;
        vertical-align: middle;margin-left:-10px;
      }
    }
  }
  &_main{
    position: fixed;top:120px;left:15px;right:15px;bottom:15px;
    // bottom:15px;
    // border-top:1px solid red;
  }
  &_left{
    width: 24%;float: left;height:100%;
    // border:1px solid #ff0;
  }
  &_con{
    width: 51%;
    padding-left: 15px;
    padding-right: 15px;
    float: left;
    height: 100%;
    // border:1px solid #ff0;
  }
  &_right{
    width: 25%;float: left;height:100%;
    // border:1px solid #ff0;
  }

}
</style>
