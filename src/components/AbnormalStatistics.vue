<template>
      <div class="abnormal">
        <div class="abnormal-item">
          <p class="home_title home_title-blue home_title-hover" @click.stop="fnShow" style="cursor:pointer;">
            人员考勤异常情况<img src="../assets/images/icon-triangle.png" />
          </p>
          <ul class="day">
            <li>
              <span>迟到</span>
              <em class="chidao" v-if="info && info.lateNum" v-text="info.lateNum"></em>
              <em v-else>0</em>
            </li>
            <li>
              <span>早退</span>
              <em class="zaotui" v-if="info && info.leaveNum" v-text="info.leaveNum"></em>
              <em v-else>0</em>
            </li>
            <li>
              <span>旷工</span>
              <em class="kuanggong" v-if="info && info.absentNum" v-text="info.absentNum"></em>
              <em v-else>0</em>
            </li>

            <li>
              <span>调班</span>
              <em class="tiaoban" v-if="info && info.abnormalNum" v-text="info.abnormalNum"></em>
              <em v-else>0</em>
            </li>
          </ul>
        </div>
        <div class="abnormal-item">
          <p class="home_title home_title-blue">人员考勤异常月统计</p>
          <div class="month" id="month">

          </div>
        </div>
        <div class="abnormal-item">
          <p class="home_title home_title-purple">人员考勤异常年统计</p >
          <div class="year" id="year"></div>
        </div>
        <!--左侧考勤签退开始-->
				<div class="abnormal_dialog" v-show="isShow">
					<div  class="top">
            <img src="../assets/images/close.png" @click="isShow=false;" />
					</div>
					<div class="message" @click.stop="isShow=true">
						<div><span>加工中心</span><span>迟到</span><span>早退</span><span>旷工</span></div>
						<div v-if="allCenterNameArr.length" v-for="(item, index) in allCenterNameArr" :key="index">
              <span v-text="item.centername">组装工作中心</span>
              <span v-text="item.cidao">0</span>
              <span v-text="item.zaotui">0</span>
              <span v-text="item.kuanggong">0</span>
            </div>
					</div>

				</div>
				<!--左侧考勤签退结束-->
      </div>
</template>

<script>
import echarts from 'echarts'
import http from '../api/http'
export default {
  name: 'AbnormalStatistics',
  props: ['info','monthYearData'],
  data () {
    return {
	    chartsAData: {
        xData:[],
        cidao: [],
        zaotui: []
      },
	    chartsBData: {
        xData: [],
        cidao: [],
        zaotui: []
      },
      isShow:false, // 左侧弹窗是否显示
      allCenterNameArr: [],
      EchartsArr: []
    }
  },
  created () {

  },
  watch: {
    monthYearData (val) {
      // 如果从后台返回数据成功开始渲染数据
      if (this.monthYearData.ret == 200) {
        // 异常月echarts图
        var myEChartsMonth = echarts.init(document.getElementById('month'))
        this.chartsAData.xData = val.xAxis // X轴
        this.chartsAData.cidao = val.lateArr // 迟到
        this.chartsAData.zaotui = val.leaveNumArr // 早退
        this.chartsAData.kuanggong = val.absenNumArr //矿工
        this.EchartsArr.push(myEChartsMonth)

        // 异常年echarts图
        var myEChartsYear = echarts.init(document.getElementById('year'))
        this.chartsBData.xData = val.xxAxis // X轴
        this.chartsBData.cidao = val.xxlateArr // 迟到
        this.chartsBData.zaotui = val.xxleaveNumArr // 早退
        this.chartsBData.kuanggong = val.xxabsenNumArr //矿工
        this.EchartsArr.push(myEChartsYear)

        // 渲染echarts图
        this.renderEcharts(myEChartsMonth, this.chartsAData)
        this.renderEchartsB(myEChartsYear, this.chartsBData)
      }
    }
  },
  mounted () {
    // 获取弹窗加工中心数据
    var dataDialog = ['组装工作中心', '钻具工作中心', '机加工作中心', '变幅工作中心', '备料工作中心', '桅杆工作中心', '调试工作中心', '设备工作中心', '仓储配送工作中心', '部件涂装工作中心']
    this.allCenterNameArr = this.getAllCenterNameData(dataDialog)

    document.addEventListener('click', (e) => {
      this.isShow = false
    })

    window.addEventListener('resize',this.handleResize);//给window对象绑定resize事件
  },
  methods: {
    handleResize(){
      this.EchartsArr.forEach((ele,index)=>{
              ele.resize();
      })
    },
    async getAllCenterNameData (dataArr) {
      var allCenterNameArray = []
      for(var i=0; i<dataArr.length; i++) {
        var index = i
        var res = await http.post('/sanyAttendanceData/getAttendanceData', {centername: dataArr[index]})
        if (res.data && res.data.ret == 200) {
          // console.log(res.data)
          var obj = res.data.titledata
          var currentData = {
            centername: obj.centerName,
            cidao: obj.lateNum,
            zaotui: obj.leaveNum,
            kuanggong: obj.absentNum
          }
          allCenterNameArray.push(currentData)
        }
        this.allCenterNameArr = allCenterNameArray
        // console.log('allCenterNameArr:',allCenterNameArray)
      }
    },
    fnShow(){
			this.isShow=true
		},
    renderEcharts (myChart, data) {
      var option = {
        legend: {
          data: ['迟到', '早退','旷工'],
          show: true,
          itemWidth: 20, // 设置图例的宽高
          itemHeight: 10,
          textStyle: { // 标题颜色
            color: '#fff'
          },
          top: 10,
          bottom: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          bottom: 20
        },
        xAxis: [
          {
            type: 'category',
            data: data.xData,
            axisLine: { // 控制x轴线的样式
              lineStyle: {
                type: 'solid',
                color: '#56aefb',
                width: '1'
              }
            },
            axisLabel : {
              // formatter: '{value}',
              textStyle: {
                color: '#2fdaeb'
              },
              interval: 3
              // showMaxLabel: true, //是否显示最大 tick 的 label
            },
            axisTick: { // 控制x轴坐标刻度不显示
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: data.maxY,
            // interval: data.intervalY,
            axisLine: { // 控制y轴线的样式
              lineStyle: {
                type: 'solid',
                color: '#55aefb',
                width: '1'
              }
            },
            axisLabel: {
              formatter: '{value} ',
              textStyle: {
                color: '#556BA2'
              },
              showMinLabel: true, // 是否显示最小 tick 的 label
              showMaxLabel: true, // 是否显示最大 tick 的 label
              verticalAlign: 'middle'
            },
            splitLine: { // 网格线
              show: false,
              lineStyle: {
                color: ['#2DD7EC'],
                width: 1,
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '迟到',
            type: 'bar',
            data: data.cidao,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    {offset: 0, color: '#fd87a7' },
                    {offset: 0.5, color: '#e45a88' },
                    {offset: 1, color: '#c82867' }
                  ]
                ),
				        barBorderRadius: 3
              }
            },
            barWidth: 3, // 控制柱子的宽度
            barGap: '20%' // 控制柱子的间隔
          },
          {
            name: '早退',
            type: 'bar',
            data: data.zaotui,
            itemStyle: {
              normal: {
				        color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#e8e31a' },
                    { offset: 0.5, color: '#fbbd07' },
                    { offset: 1, color: '#f8920e' }
                  ]
                ),
				        barBorderRadius: 3
              }
            },
            barWidth: 3,  // 控制柱子的宽度
            barGap: '20%' // 控制柱子的间隔
          },
          {
            name: '旷工',
            type: 'bar',
            data: data.kuanggong,
            itemStyle: {
              normal: {
				        color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#2cd3ec' },
                    { offset: 0.5, color: '#31aee9' },
                    { offset: 1, color: '#387de6' }
                  ]
                ),
				        barBorderRadius: 3
              }
            },
            barWidth: 3,  // 控制柱子的宽度
            barGap: '20%' // 控制柱子的间隔
          }
        ]
      }
      myChart.setOption(option)
    },
	  renderEchartsB (myChart, data) {
      var option = {
        legend: {
          data: ['迟到', '早退', '旷工'],
          show: true,
          itemWidth: 20, // 设置图例的宽高
          itemHeight: 10,
          textStyle: { // 标题颜色
            color: '#fff'
          },
          top: 10,
          bottom: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          bottom: 20
        },
        xAxis: [
          {
            type: 'category',
            data: data.xData,
            axisLine: { // 控制x轴线的样式
              lineStyle: {
                type: 'solid',
                color: '#56aefb',
                width: '1'
              }
            },
            axisLabel : {
              // formatter: '{value}',
              textStyle: {
                color: '#2fdaeb'
              },
              interval: 0,
              showMaxLabel: true // 是否显示最大 tick 的 label
            },
            axisTick: { // 控制x轴坐标刻度不显示
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: data.maxY,
            // interval: data.intervalY,
            axisLine: { // 控制y轴线的样式
              lineStyle: {
                type: 'solid',
                color: '#55aefb',
                width: '1'
              }
            },
            axisLabel: {
              formatter: '{value} ',
              textStyle: {
                color: '#556BA2'
              },
              showMinLabel: true, // 是否显示最小 tick 的 label
              showMaxLabel: true, // 是否显示最大 tick 的 label
              verticalAlign: 'middle'
            },
            splitLine: { // 网格线
              show: false,
              lineStyle: {
                color: ['#2DD7EC'],
                width: 1,
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: '迟到',
            type: 'bar',
            data: data.cidao,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#fd87a7' },
                    { offset: 0.5, color: '#e45a88' },
                    { offset: 1, color: '#c82867' }
                  ]
                ),
                barBorderRadius: 6
              }
            },
            barWidth: 6, // 控制柱子的宽度
            barGap: '10%' // 控制柱子的间隔
          },
          {
            name: '早退',
            type: 'bar',
            data: data.zaotui,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#e4aa00' },
                    { offset: 0.5, color: '#dd9000' },
                    { offset: 1, color: '#d67600' }
                  ]
                ),
                barBorderRadius: 6
              }
            },
            barWidth: 6, // 控制柱子的宽度
            barGap: '20%' // 控制柱子的间隔
          },
          {
            name: '旷工',
            type: 'bar',
            data: data.kuanggong,
            itemStyle: {
              normal: {
				        color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#2cd3ec' },
                    { offset: 0.5, color: '#31aee9' },
                    { offset: 1, color: '#387de6' }
                  ]
                ),
				        barBorderRadius: 6
              }
            },
            barWidth: 6, // 控制柱子的宽度
            barGap: '20%' // 控制柱子的间隔
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.abnormal {
  height:100%;display:flex;flex-direction: column;position: relative;
  &>:nth-child(2){
    margin: 15px 0px;
  }
  &-item{
    flex:1;overflow: hidden;position:relative;
    background-color: rgba(39,69,111,0.3);padding:15px;
    border:1px solid rgba(255,255,255,0.1);
    .home_title{
      width:100%;
      img{margin-left: 10px;vertical-align: -2px;width: 12px;}
    }
    .day{
      display:flex;justify-content: center;align-items: center;flex-wrap: wrap;//如果一条轴线排不下，如何换行，wrap换行
      width:100%;height: calc(100% - 36px - 40px);margin: 25px 0;
      li{
        text-align: center;
        text-align: center;width:50%;
        span{
          font-size: 25px;display: inline-block;vertical-align: middle;
        }
        em{
          font-size:42px;color:#00c7fa;display: inline-block;vertical-align: middle;
          font-weight: bold;margin-left:8px;
          width: 100px;text-align: left;
          font-family: fontnameRegular;
        }
      }
    }
    .month{
      width:100%;height: calc(100% - 36px);
    }
    .year{
      width:100%;height: calc(100% - 36px);
    }
  }
  .home_title-hover:hover{color:#50b4ff}
  /* 左侧考勤模态框 */
  &_dialog{
    width: 100%;
    background-color: #032046;
    opacity: 0.9;
    position: absolute;
    top: 60px;
    bottom: 0px;
    left: 0px;
    right: 0;
    z-index: 100;
    text-align: center;
    .top{
      text-align:right;
      padding: 10px;
      img{cursor: pointer;}
    }
    .message{
      width:100%;
      padding:10px;
      div{
        height:32%;
        span{
          display:inline-block;
          width:22%;
          font-size: 18px;
          height:50px;
          text-align: center;
          line-height: 36px;
        }
        /*第一列的span需要宽一些*/
        span:nth-of-type(1){
          display:inline-block;
          width:34%;
          height:36px;
        }
      }
    }
  }
}
</style>
