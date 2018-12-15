<template>
  <div class="abnormal">
    <div class="abnormal-item">
      <p class="home_title home_title-blue">车辆门禁管理天统计</p>
      <div class="day" id="day">
      </div>
    </div>
    <div class="abnormal-item">
      <p class="home_title home_title-blue">车辆门禁管理月统计</p>
      <div class="month" id="month">
      </div>
    </div>
    <div class="abnormal-item">
      <p class="home_title home_title-blue">车辆门禁管理年统计</p>
      <div class="year" id="year"></div>
    </div>

  </div>
</template>

<script>
  import echarts from 'echarts'
  import http from '../api/http'

  export default {
    name: 'carsManage',
    data() {
      return {
        chartsAData: {  //日
          xData: [],
          insideCars: [],  //内部车辆
          externalCars: [], //外部车辆
          bigTruck: []  //大货车
        },
        chartsBData: { // 月
          xData: [],
          insideCars: [],
          externalCars: [],
          bigTruck: []
        },
        chartsCData: { //年
          xData: [],
          insideCars: [],
          externalCars: [],
          bigTruck: []
        },
      }
    },
    watch: {},
    mounted() {
      var myEChartsDay = echarts.init(document.getElementById('day'))
      // console.log(myEChartsDay)
      this.chartsAData.xData = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日'] // X轴
      this.chartsAData.insideCars = ['100', '50', '100', '50', '100', '50', '100', '50', '100', '50'] // 内部
      this.chartsAData.externalCars = ['60', '50', '60', '50', '60', '50', '60', '50', '60', '50'] // 外部
      this.chartsAData.bigTruck = ['20', '80', '20', '80', '20', '80', '20', '80', '20', '80'] //大货车

      // 月echarts图
      // var myEChartsMouth = echarts.init(document.getElementById('mouth'))


      //年echarts图
      // var myEChartsYear = echarts.init(document.getElementById('year'))
      this.renderEchartsA(myEChartsDay, this.chartsAData)
    },
    methods: {
      // async getAllCenterNameData () {
      //   var res = await http.post('/sanyAttendanceData/getAttendanceData')
      //   if (res.data && res.data.ret == 200) {
      //     // console.log(res.data)
      //     var obj = res.data.titledata
      //     var currentData = {
      //       insideCars: obj.lateNum,
      //       externalCars: obj.leaveNum,
      //       bigTruck: obj.absentNum
      //     }
      //   }
      // },

  renderEchartsA(myChart, data){
    var option = {
      legend: {
        data: ['内部车辆', '外部车辆', '大货车'],
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
      // grid: { top: '25%', left: '12%', right: '2%',  },
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
          axisLabel: {
            formatter: '{value}',
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
              color: '#2fdaeb'
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
          name: '内部车辆',
          type: 'bar',
          data: data.insideCars,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#fd87a7'},
                  {offset: 0.5, color: '#e45a88'},
                  {offset: 1, color: '#c82867'}
                ]
              ),
              barBorderRadius: 10
            }
          },
          barWidth: 10, // 控制柱子的宽度
          barGap: '20%' // 控制柱子的间隔
        },
        {
          name: '外部车辆',
          type: 'bar',
          data: data.externalCars,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#e8e31a'},
                  {offset: 0.5, color: '#fbbd07'},
                  {offset: 1, color: '#f8920e'}
                ]
              ),
              barBorderRadius: 10
            }
          },
          barWidth: 10,  // 控制柱子的宽度
          barGap: '20%' // 控制柱子的间隔
        },
        {
          name: '大货车',
          type: 'bar',
          data: data.bigTruck,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#2cd3ec'},
                  {offset: 0.5, color: '#31aee9'},
                  {offset: 1, color: '#387de6'}
                ]
              ),
              barBorderRadius: 10
            }
          },
          barWidth: 10,  // 控制柱子的宽度
          barGap: '20%' // 控制柱子的间隔
        }
      ]
    }
    myChart.setOption(option)
  },
  }
}
</script>
<style lang="scss" scoped>
  .abnormal {
    height: 100%;
    display: flex;
    flex-direction: column;
    &-item {
      flex: 1;
      overflow: hidden;
      position: relative;
      background: rgba(39,69,111,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      margin-top: 15px;
      padding-top: 15px;
      padding-left: 5px;
      .home_title {
        width: 100%;
        height: 24px;
      }
      .day {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(100% - 24px);
        li {
          flex: 1;
          text-align: center;
        }
      }
      .month {
        width: 100%;
        height: calc(100% - 24px);
      }
      .year {
        width: 100%;
        height: calc(100% - 24px);
      }
    }

  }
</style>
