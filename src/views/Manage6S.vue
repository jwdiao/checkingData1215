<template>
	<div class="manage6s">
		<!-- 头部 start -->
		<div class="manage6s_top">
			<!-- <router-link to="/">home</router-link> -->
			<div class="manage6s_imgText" @click="enterIndexPage">
				<!-- <img src="../assets/images/logo.png" alt="logo"> -->
				<span class="title">北京三一桩机三现数据中心</span>
			</div>
			<!--右上角时间-->
			<em class="time" v-text="currentTime"></em>
		</div>
		<!-- 头部 end -->

		<!-- main start -->
		<div class="manage6s_main">
			<div class="manage6s_left">
				<div class="manage6s_left_top">
					<p class="home_title home_title-blue">6s统计</p>
					<div class="manage6s_left_echarts" style="position:relative">
						<div id="container" class="manage6s_highcharts"></div>
						<!--右侧三个水滴盒子-->
						<div class="right_writer_box">
							<!-- 物料乱放水滴 -->
							<div class="right_writer">
								<div id="main" class="chart_box"></div>
								<div class="right_write_message">
									<div :style="writerOne" class='count'>{{wllfnum}}</div>
									<div :style="writerOne" class='title'>物料乱放</div>
								</div>
							</div>
							<!-- 物料取走水滴 -->
							<div class="right_writer">
								<div id="main1" class="chart_box"></div>
								<div class="right_write_message">
									<div :style="writerTwo" class='count'>{{wlqznum}}</div>
									<div :style="writerTwo" class='title'>物料取走</div>
								</div>
							</div>
							<!-- 核心区域进出 -->
							<div class="right_writer">
								<div id="main2" class="chart_box"></div>
								<div class="right_write_message">
									<div :style="writerThree" class='count'>{{hxqyjcnum}}</div>
									<div :style="writerThree" class='title'>核心区域进出</div>
								</div>
							</div>
						</div>
						<!--左侧总计以及两个水滴盒子-->
						<div class="left_writer_box">
							<!-- 总计 -->
							<div class="left_writer">
								
								<div class="left_write_message" style="width:106%;text-align:center;">
									<div class='count'>{{alleventnum}}</div>
									<div class='title'>总计</div>
								</div>
							</div>
							<!-- 人员聚集水滴 -->
							<div class="left_writer">
								<div class="left_write_message">
									<div :style="writerFour" class='count'>{{ryjjnum}}</div>
									<div :style="writerFour" class='title'>人员聚集</div>
								</div>
								<div id="main3" class="chart_box"></div>
							</div>
							<!-- 物品偷走水滴 -->
							<div class="left_writer">
								<div class="left_write_message">
									<div :style="writerFive" class='count'>{{wptqnum}}</div>
									<div :style="writerFive" class='title'>物品偷走</div>
								</div>
								<div id="main4" class="chart_box"></div>
							</div>
						</div>
						<!--总计盒子-->
						<!-- <div class="total_box">
							
						</div> -->

					</div>
				</div>
				<div class="manage6s_left_bottom">
					<p class="home_title home_title-blue">实时事件抓拍</p>
					<div class="manage6s_capture">
						<!--左侧实时事件抓拍表格-->
						<div class="message">
							<div class="title"><span>事件名称</span><span>抓拍地点</span><span>抓拍时间</span></div>
							<div class="manage6s_capture-con" style="height: 90%; overflow:hidden ;">
								<div>
									<!--@click="addImg()"-->
									<div class="title_message" v-for="(item, index) in snapEventListArr" :key="item.id" @click="addImg(index)">
										<span v-text="item.eventname"></span>
										<span v-text="item.souevents"></span>
										<span v-text="item.eventstarttimestr"></span>
									</div>
								</div>
							</div>

						</div>
						<!--左侧实时事件抓拍表格-->
						<div :class="{image:true,imageBig:imageBig}" @click="bigImg" :title="titleMessage">
							<img :src="eventsnapimg" alt="">
						</div>
					</div>
				</div>
			</div>
			<div class="manage6s_right">
				<div class="attendance">
					<div class="attendance-item">
						<p class="home_title home_title-blue">6s事件日统计</p>
						<div class="day" id="manage6s-day-echarts"></div>
					</div>
					<div class="attendance-item">
						<p class="home_title home_title-yellow">6s事件月统计</p>
						<div class="month" id="manage6s-mouth-echarts"></div>
					</div>
					<div class="attendance-item">
						<p class="home_title home_title-purple">6s事件年统计</p>
						<div class="year" id="manage6s-year-echarts"></div>
					</div>
				</div>
			</div>
		</div>
		<!-- main end -->

	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import echarts from 'echarts'
	import moment from 'moment'
	import http from '../api/http'
	// 顶部环形图
	import Highcharts from 'highcharts/highstock';
	import Highcharts3D from 'highcharts/highcharts-3d';
	import HighchartsMore from 'highcharts/highcharts-more';
	import HighchartsDrilldown from 'highcharts/modules/drilldown';
	HighchartsMore(Highcharts)
	HighchartsDrilldown(Highcharts);
	Highcharts3D(Highcharts);

	import 'echarts-liquidfill'

	export default {
		name: 'home',
		data() {
			return {
				currentTime: '', // 系统当前时间
				snapEventListArr: [], // 实时事件抓拍
				eventsnapimg: '', //实时事件抓拍第一张图片
				dayEchartsDataRight: { //日统计
					datadaystr: [], // X轴数据
					suml: [], // 事件总数
					sumTrueMax: '', //真数据最大值
					lenName: '6s事件日统计'
				}, // 右侧日echarts图
				monthEchartsDataRight: {
					datadaystr: [], // X轴数据
					suml: [], // 事件总数
					sumTrueMax: '',
					lenName: '6s事件月统计'
				}, // 右侧月echarts图
				yearEchartsDataRight: {
					datadaystr: [], // X轴数据
					suml: [], // 事件总数
					sumTrueMax: '',
					lenName: '6s事件年统计'
				}, // 右侧年echarts图
				hxqyjcnum: '', //核心区域进出
				hxqyjcnuml: '', //核心区域进出百分比
				wptqnum: '', //物品偷走
				wptqnuml: '', //物品偷走百分比
				ryjjnum: '', //人员聚集
				ryjjnuml: '', //人员聚集百分比
				wlqznum: '', //物料取走
				wlqznuml: '', //物料取走百分比
				wllfuml: '', //物料乱放百分比
				wllfnum: '', //物料乱放
				alleventnum: '', //事件总数
				imageBig: false, //控制图片是否放大类名
				monthEchartsRight: [], //接收echarts初始化之后的返回对象,
				titleMessage: '点击放大',
				myChartAData: { //物料乱放水球参数
					color: ['#49d088', '#38b470', '#2aaf66'],
					borderColor: '#13FDCE',
					bgColor: 'rgba(155,243,181,.5)',
					countData: ['0.6', '0.5', '0.4', '0.3']
				},
				myChartBData: { //物料取走水球参数
					color: ['#49d088', '#38b470', '#2aaf66'],
					borderColor: 'rgb(195,110,246)',
					bgColor: 'rgba(195,110,246,.5)',
					countData: ['0.6', '0.5', '0.4', '0.3']
				},
				myChartCData: { //核心区域进出水球参数
					color: ['#49d088', '#38b470', '#2aaf66'],
					borderColor: 'rgb(1,187,255)',
					bgColor: 'rgba(1,187,255,.5)',
					countData: ['0.6', '0.5', '0.4', '0.3']
				},
				myChartDData: { //人员聚集参数
					color: ['#49d088', '#38b470', '#2aaf66'],
					borderColor: 'rgb(247,123,102)',
					bgColor: 'rgba(247,123,102,.5)',
					countData: ['0.6', '0.5', '0.4', '0.3']
				},
				myChartEData: { //物品偷走参数
					color: ['#49d088', '#38b470', '#2aaf66'],
					borderColor: 'rgb(250,89,129)',
					bgColor: 'rgba(250,89,129,.5)',
					countData: ['0.6', '0.5', '0.4', '0.3']
				},
				pieData: [ //饼图各部分所占百分比
					['物料乱放', 11],
					['物料取走', 26],
					['核心区域进出', 20],
					['物品偷走', 16],
					['人员聚集', 14]
				],
				writerOne: { //物料乱放文字颜色
					color: 'rgb(115,243,181)'
				},
				writerTwo: { //物料取走文字颜色
					color: 'rgb(195,110,246)'
				},
				writerThree: { //核心区域进出文字颜色
					color: 'rgb(1,187,255)'
				},
				writerFour: { //人员聚集文字颜色
					color: 'rgb(247,123,102)'
				},
				writerFive: { //物品偷走文字颜色
					color: 'rgb(250,89,129)'
				}
			}
		},
		watch: {

		},
		created() {},
		computed: {

		},
		mounted() {
			// 顶部日期时间
			this.currentTime = this.getCurrentDateTime();
			setInterval(() => {
				this.currentTime = this.getCurrentDateTime();
			}, 1000) 
			//左上6s统计数据
			this.getEventCount()
			/* setInterval(() => {
				this.getEventCount()			
			}, 10000) */

			// 左下6s管理表格数据
			this.getEventInfoList()
			/* setInterval(() => {
				this.getEventInfoList()			
			}, 10000) */
			// 右侧====
			this.getDayMonthYearRightData('DAY')
			this.getDayMonthYearRightData('MON')
			this.getDayMonthYearRightData('YEAR')
		  setInterval(()=>{
				this.getEventCount()
				this.getEventInfoList()			
				this.getDayMonthYearRightData('DAY')
				this.getDayMonthYearRightData('MON')
				this.getDayMonthYearRightData('YEAR') 
			},10000) 

			window.addEventListener('resize', this.handleResize); //给window对象绑定resize事件
		},
		methods: {
			handleResize() {
				this.monthEchartsRight.forEach((ele, index) => {
					ele.resize();
				})
				$('.right_write_message .count').css('font-size', $('.right_write_message').height() - 41 + 'px')
				$('.left_write_message .count').css('font-size', $('.right_write_message').height() - 41 + 'px')


			},
			bigImg() {
				this.imageBig = !this.imageBig
				this.titleMessage = this.titleMessage == "点击放大" ? "点击还原" : "点击放大"
			},
			addImg(i) {
				this.eventsnapimg = this.snapEventListArr[i].eventsnapimg
			},
			// highcharts圆环图
			generateCircle(mydata) {
				var chart = Highcharts.chart('container', {
					chart: {
						type: 'pie',
						options3d: {
							enabled: true,
							alpha: 45
						},
						backgroundColor: 'none',
						marginLeft: 0,
						marginRight: 0,
						marginTop: 0,
						marginBottom: 10
					},
					plotOptions: {
						pie: {
							innerSize: 100,
							depth: 45,
							colors: ['rgba(155,243,181,.9)', 'rgba(195,110,246,.9)', 'rgba(1,187,255,.9)', 'rgba(250,89,129,.9)',
								'rgba(247,123,102,.9)'
							],
							showInLegend: true
						}
					},
					credits: { // 去掉highcharts水印
						enabled: false
					},
					legend: { //图例的样式包括位置颜色等等
						enabled: true,
						align: 'left',
						verticalAlign: 'top',
						layout: 'vertical',
						x: 0,
						y: 10,
						itemMarginBottom: 5,
						itemStyle: {
							color: 'rgb(1,187,255)'
						}
					},
					title: '',
					series: [{
						name: '货物金额',
						dataLabels: {
							enabled: false
						},
						data: mydata,
						animation: false
					}]
				});
			},
			// 水球
			//a
			generateWaterBall(myChart, dataObj) {
				var option = {
					backgroundColor: 'rgba(1,1,1,0)',
					series: [{
						type: 'liquidFill',
						data: dataObj.countData,
						radius: '90%',
						// 水球颜色
						color: 'white',
						// center: ['25%', '50%'],
						// outline  外边
						outline: {
							// show: false
							borderDistance: 0,
							itemStyle: {
								borderWidth: 5,
								borderColor: dataObj.borderColor, //元边框的颜色
							},
						},
						label: {
							normal: {
								textStyle: {
									color: '#fff',
									insideColor: 'yellow',
									fontSize: 40
								}
							}
						},
						// 内图 背景色 边
						backgroundStyle: {
							color: dataObj.bgColor,
							// borderWidth: 5,
							// borderColor: 'red',
						}
					}]
				};
				myChart.setOption(option);
			},
			enterIndexPage() {
				// 路径从state中获取
				window.location.href = `${this.$store.state.baseUrl}/sanyShebei` //测试
			},
			// 时间格式化
			getCurrentDateTime() {
				return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
			},
			// 右侧人员考勤日/月/年统计
			async getDayMonthYearRightData(querySign) {
				const res = await http.post('/sanySanyEventInfor/getEventInforStatis', {
					querySign: querySign
				})
				if (res.data && res.data.ret == 200) {
					console.log("获取的数据是：", res.data)
					if (querySign === 'DAY') {
						this.dayEchartsDataRight.datadaystr = res.data.datadaystr // x轴
						this.dayEchartsDataRight.suml = res.data.suml //总数	
						this.dayEchartsDataRight.sumTrueMax = Math.max.apply(null, res.data.suml) //真数据最大值
						var dayEchartsRight = echarts.init(document.getElementById("manage6s-day-echarts"));
						this.monthEchartsRight.push(dayEchartsRight)
						this.renderEcharts(dayEchartsRight, this.dayEchartsDataRight)
					}

					if (querySign === 'MON') {
						this.monthEchartsDataRight.datadaystr = res.data.datadaystr // x轴
						this.monthEchartsDataRight.suml = res.data.suml //总数
						this.monthEchartsDataRight.sumTrueMax = Math.max.apply(null, res.data.suml)
						var monthEchartsRight = echarts.init(document.getElementById("manage6s-mouth-echarts"));
						this.monthEchartsRight.push(monthEchartsRight)
						this.renderEcharts(monthEchartsRight, this.monthEchartsDataRight)
					}
					if (querySign === 'YEAR') {
						this.yearEchartsDataRight.datadaystr = res.data.datadaystr // x轴
						this.yearEchartsDataRight.suml = res.data.suml //总数
						this.yearEchartsDataRight.sumTrueMax = Math.max.apply(null, res.data.suml)
						var yearEchartsRight = echarts.init(document.getElementById("manage6s-year-echarts"));
						this.monthEchartsRight.push(yearEchartsRight)
						this.renderEcharts(yearEchartsRight, this.yearEchartsDataRight)
					}
				}
			},
			// 左侧数据
			async getEventInfoList() {
				const res = await http.get('/sanySanyEventInfor/getEventInforList')
				if (res.data && res.data.ret == 200) {
					var listArr = res.data.list
					this.snapEventListArr.splice(0, this.snapEventListArr.length)
					for (var i = 0; i < listArr.length; i++) {
						var currentItemObj = {
							id: listArr[i].id + Math.random(),
							eventname: listArr[i].eventtype, //事件名称
							souevents: listArr[i].souevents, // 抓拍地点
							eventstarttimestr: listArr[i].eventstarttimestr, //抓拍时间
							eventsnapimg: listArr[i].eventimgurl
						}
						this.snapEventListArr.push(currentItemObj)
					}
					this.eventsnapimg = res.data.eventsnapimg
					new BScroll('.manage6s_capture-con', function() {
						scrollY = true
					})
				}

			},
			//统计数据
			async getEventCount() {
				const res = await http.get('/sanySanyEventInfor/getEventInforList')
				if (res.data && res.data.ret == 200) {
					this.hxqyjcnum = res.data.hxqyjcnum //核心区域进出
					this.hxqyjcnuml = res.data.hxqyjcnuml //核心区域进出百分比
					this.wptqnum = res.data.wptqnum //物品偷走
					this.wptqnuml = res.data.wptqnuml //物品偷走百分比
					this.ryjjnum = res.data.ryjjnum //人员聚集
					this.ryjjnuml = res.data.ryjjnuml //人员聚集百分比
					this.wlqznum = res.data.wlqznum //物料取走
					this.wlqznuml = res.data.wlqznuml //物料取走百分比
					this.wllfuml = res.data.wllfuml / 100, //物料乱放百分比
						this.wllfnum = res.data.wllfnum, //物料乱放
						this.alleventnum = res.data.alleventnum //事件总数
					this.myChartAData.countData[0] = res.data.wllfuml / 100 //水球物料乱放百分比0.96
					this.myChartBData.countData[0] = res.data.wlqznuml / 100 //水球物料取走百分比0.96
					this.myChartCData.countData[0] = res.data.hxqyjcnuml / 100 //水球核心区域进出百分比0.96
					this.myChartDData.countData[0] = res.data.ryjjnuml / 100 //水球人员聚集百分比0.96
					this.myChartEData.countData[0] = res.data.wptqnuml / 100 //水球物品偷走百分比0.96
					this.pieData[0][1] = res.data.wllfnum //饼图物料乱放
					this.pieData[1][1] = res.data.wlqznum //饼图物料取走
					this.pieData[2][1] = res.data.hxqyjcnum //饼图核心区域进出
					this.pieData[3][1] = res.data.wptqnum //饼图物品偷走
					this.pieData[4][1] = res.data.ryjjnum //饼图人员聚集
					// 水球
					var myChartA = echarts.init(document.getElementById('main')); //物料乱放水球
					var myChartB = echarts.init(document.getElementById('main1')); //物料取走水球
					var myChartC = echarts.init(document.getElementById('main2')); //核心区域进出水球
					var myChartD = echarts.init(document.getElementById('main3')); //物品偷走水球
					var myChartE = echarts.init(document.getElementById('main4')); //人员聚集水球
					this.monthEchartsRight.push(myChartA)
					this.monthEchartsRight.push(myChartB)
					this.monthEchartsRight.push(myChartC)
					this.monthEchartsRight.push(myChartD)
					this.monthEchartsRight.push(myChartE)
					this.generateWaterBall(myChartA, this.myChartAData);
					this.generateWaterBall(myChartB, this.myChartBData);
					this.generateWaterBall(myChartC, this.myChartCData);
					this.generateWaterBall(myChartD, this.myChartDData);
					this.generateWaterBall(myChartE, this.myChartEData);
					// 顶部highcharts圆环图
					this.generateCircle(this.pieData);
				}
			},
			renderEcharts(myChart, data) {
				var option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							crossStyle: {
								color: '#999'
							}
						},
						/* formatter:'{a0}' */
						formatter: `{b0}<br/>
						<span style="display:inline-block;width:10px;height:10px;border-radius:5px;background:rgba(1, 187, 255, 1);">
						</span>&nbsp;{a1} : {c1}`


					},
					grid: {
						bottom: 20
					},
					legend: {
						data: [{
								name: '6s事件统计走势',
								icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAMAAACDi47UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjQ3NjZBN0JGNDY5MTFFOEJCNjM4QzFDNjc4NzQyM0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjQ3NjZBN0NGNDY5MTFFOEJCNjM4QzFDNjc4NzQyM0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNDc2NkE3OUY0NjkxMUU4QkI2MzhDMUM2Nzg3NDIzRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNDc2NkE3QUY0NjkxMUU4QkI2MzhDMUM2Nzg3NDIzRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Po8SnNMAAAA/UExURf/LF//NF//eHP/KFv/SGf/OGP/aG//UGf/WGv/jHv/rIP/IFv/QGP/YGv/lHv/pH//cHP/nH//hHf/tIP///9HlZOcAAAAVdFJOU///////////////////////////ACvZfeoAAAAqSURBVHjaYhDBAhiIFxTm4hfk4xRiEmDj5WBn4WFlZGDmplSQMicBBBgAF/kMWUwXodQAAAAASUVORK5CYII='
							},
							data.lenName
						],
						show: true,
						itemWidth: 20, //设置图例的宽高
						itemHeight: 10,
						textStyle: {
							fontWeight: "normal", //标题颜色
							color: "#fff"
						},
						top: 10,
						bottom: 0
					},
					xAxis: [{
						type: 'category',
						data: data.datadaystr, // x轴数据
						axisLine: { // 控制x轴线的样式
							lineStyle: {
								type: 'solid',
								color: '#56affb',
								width: '1'
							}
						},
						axisPointer: {
							type: 'shadow'
						},
						axisTick: { // 控制x轴坐标刻度不显示
							show: false
						},
						axisLabel: {
							// formatter: '{value}',
							textStyle: {
								color: '#2DD7EC'
							}
						},
					}],
					yAxis: [{
							type: 'value',
							name: '',
							max: data.sumTrueMax + parseInt(data.sumTrueMax / 3),
							axisLine: { // 控制y轴线的样式
								lineStyle: {
									type: 'solid',
									color: '#56AFFB',
									width: '1'
								}
							},
							axisLabel: {
								formatter: '{value} ',
								textStyle: {
									color: '#556BA2'
								}
							},
							splitLine: { //网格线
								show: false,
								lineStyle: {
									color: ['#56AFFB'],
									width: 1,
									type: 'dotted'
								}
							}
						},
						{
							type: 'value',
							name: '',
							max: data.sumTrueMax,
							show: false, //是否显示y轴
							// max: function(value) {return value.max - 1}, 
							// min: function(value) {return value.min - 1},
							smooth: true,
							nameGap: 40,
							axisLabel: {
								formatter: '{value}',
								textStyle: {
									color: '#556BA2'
								}
							},
							axisLine: { // 控制y轴线%的样式
								lineStyle: {
									type: 'solid',
									color: '#23BBEC',
									width: '1'
								}
							},
							splitLine: {
								show: false,
								lineStyle: {
									color: ['#56AFFB'],
									width: 1,
									type: 'dotted'
								}
							}
						},
					],
					series: [{
							name: '6s事件统计走势',
							icon: 'rect',
							type: 'line',
							yAxisIndex: 1,
							smooth: true,
							symbol: 'none',
							data: data.suml,
							clipOverflow: false, //超出不裁剪
							itemStyle: {
								normal: {
									color: 'rgba(255,235,12, 1)', //这里修改了柱子的颜色以及透明度，注意如果要修改透明度，一定要配置在itemStyle里面，直接写在外面不起作用。
									lineStyle: { // 系列级个性化折线样式
										width: 3,
										type: 'solid',
									}
								}
							}
						},
						{
							name: data.lenName,
							type: 'bar',
							radius: '10%',
							data: data.suml,
							itemStyle: {
								normal: {
									barBorderRadius: [4, 4, 4, 4],
									color: new echarts.graphic.LinearGradient(
										0, 0, 0, 1,
										[{
												offset: 0,
												color: '#2cd3ec'
											},
											{
												offset: 0.5,
												color: '#32a6e9'
											},
											{
												offset: 1,
												color: '#387de6'
											}
										])
								}
							},
							barWidth: 8, // 控制柱子的宽度
							barGap: '50%', // 控制柱子的间隔
						}
					]
				};
				myChart.setOption(option, true);
			}
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.handleResize)
		},
		destroyed() {},

	}
</script>
<style lang="scss" scoped>
	.manage6s {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-image: url(../assets/images/index_bg.png);
		background-size: cover;
		color: rgb(255, 255, 255);
		background-repeat: no-repeat;
		overflow: hidden;

		&_top {
			text-align: center;
			height: 125px;
			padding-top: 20px;
			box-sizing: border-box;

			&_imgText {
				display: inline-block;
				cursor: pointer;
			}

			img {
				display: inline-block;
				vertical-align: middle;
				width: 50px;
			}

			.title {
				font-size: 30px;
				color: #0ccfeb;
				display: inline-block;
				vertical-align: middle;
				font-size: 44px;
				color: #fff;
				cursor: pointer;
				font-weight: bold;
			}

			.time {
				font-size: 35px;
				color: #ababab;
				display: inline-block;
				vertical-align: middle;
				position: fixed;
				top: 60px;
				right: 70px;
				z-index: 10;
				font-family: fontnameUnidreamLED;
			}
		}

		&_main {
			height: calc(100% - 125px);

			/*右侧三个水滴盒子*/
			.right_writer_box {
				position: absolute;
				right: 20px;
				top: 0px;
				width: 340px;
				overflow: hidden;
				height: 100%;

				.right_writer {
					height: 30%;
					overflow: hidden;
					margin-bottom: 15px;

					.right_write_message {
						float: left;
						height: 100%;

						.count {
							height: 64%;
							font-size: 72px;
							color: rgb(155, 243, 181);
						}

						.title {
							height: 36%;
							font-size: 24px;
							color: rgb(155, 243, 181);
							text-align: center;
						}
					}

					.chart_box {
						width: 50%;
						height: 100%;
						float: left;
						margin-right: 0px;
					}



				}
			}

			/*左侧两个水滴盒子*/
			.left_writer_box {
				position: absolute;
				left: 80px;
				top: 0px;
				width: 340px;
				overflow: hidden;
				height: 100%;

				.left_writer {
					overflow: hidden;
					margin-bottom: 15px;
					height: 30%;

					.left_write_message {
						float: left;
						height: 100%;

						.count {
							height: 64%;
							font-size: 72px;
							color: rgb(155, 243, 181);
						}

						.title {
							height: 36%;
							font-size: 24px;
							color: rgb(155, 243, 181);
							text-align: center;
						}
					}

					.chart_box {
						width: 50%;
						height: 100%;
						float: left;
						margin-left: 0px;
					}

					/* .chart_box_count {
						width: 34%;
						height: 100%;
						float: left;
						margin-right: 0px;
					} */

				}
			}

		}

		/*6s页面左侧盒子*/
		&_left {
			width: 67.2%;
			float: left;
			height: 100%;
			padding-right: 40px;

			/*6s页面左侧上部*/
			&_top {
				width: 100%;
				height: 51%;
				background: rgba(39, 69, 111, 0.3);
				border: 1px solid rgba(255, 255, 255, 0.1);
				padding: 20px;
				margin-bottom: 20px;
				margin-left: 20px;

			}

			&_echarts {
				width: 100%;
				height: calc(100% - 24px);
			}

			/*6s页面左侧下部*/
			&_bottom {
				background: rgba(39, 69, 111, 0.3);
				border: 1px solid rgba(255, 255, 255, 0.1);
				width: 100%;
				height: calc(49% - 40px);

				margin-left: 20px;
				padding: 20px;
			}
		}

		/*6s页面右侧盒子*/
		&_right {
			width: 31.9%;
			float: left;
			height: 100%;

			.attendance {
				height: 100%;
				display: flex;
				flex-direction: column;

				&-item {
					flex: 1;
					background: rgba(39, 69, 111, 0.3);
					border: 1px solid rgba(255, 255, 255, 0.1);
					padding: 20px;
					margin-bottom: 20px;

					.day {
						width: 100%;
						height: calc(100% - 37px);
					}

					.month {
						width: 100%;
						height: calc(100% - 37px);
					}

					.year {
						width: 100%;
						height: calc(100% - 37px);
					}
				}
			}
		}


		// 顶部
		/* &_highcharts{width:100%;height:100%;} */
		&_capture {
			width: 100%;
			height: calc(100% - 30px);
			overflow: hidden;

			/*左侧表格信息*/
			.message {
				float: left;
				width: 60%;
				margin-top: 10px;
				padding-right: 20px;
				height: calc(100% - 10px);

				/*表格表头*/
				.title {
					color: white;
					height: 30px;

					span {
						display: inline-block;
						width: 33.3%;
						height: 30px;
						padding-left: 30px;
						box-sizing: border-box;
						line-height: 30px;
					}
				}

				/*表格内容*/
				.title_message {
					height: 8%;

					span {
						display: inline-block;
						width: 33.3%;
						height: 30px;
						padding-left: 30px;
						box-sizing: border-box;
						line-height: 30px;
						color: #31a0ff;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						cursor: pointer;
					}
				}

				/*基数行有背景颜色*/
				.title_message:nth-child(odd) {
					background: rgba(56, 142, 237, 0.2);
				}
			}

			.image {
				float: left;
				width: 40%;
				padding: 10px;
				background: rgba(56, 142, 237, 0.4);
				border: 1px solid rgba(49, 160, 255, 0.6);
				height: 350px;
				margin-top: 40px;
				height: 86%;
				cursor: pointer;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.image.imageBig {
				position: fixed;
				top: 0px;
				left: 0px;
				bottom: 0px;
				right: 0px;
				margin: auto;
				width: 100%;
				height: 100%;
				z-index: 1000;
				background: rgba(8, 33, 60, 0.9);
				text-align: center;

				img {
					width: 90%;
					height: 100%;
				}
			}
		}
	}
</style>
