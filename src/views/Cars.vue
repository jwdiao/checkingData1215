<template>
  <div class="index">
    <!-- 头部 start -->
    <div class="index_top">
      <div class="index_imgText" @click="enterIndexPage">
      <!--<img src="../assets/images/logo.png" alt="logo">-->
      <span class="title" style="color: #fff; font-size: 48px; font-weight:bold;" >车辆门禁管理统计信息</span>
      </div>
      <em class="time" v-text="currentTime"></em>
    <div class="index_main">
      <div class="index_left">
        <div class="index_left_top">
          <p class="home_title home_title-blue">车辆门禁管理结果统计(单位:天)</p>
          <div class="index_left_top_main">
            <div class="index_left_top_main_Cars">
              <div class="index_left_top_main_Cars_img"><img src="../assets/images/cars.png" alt=""></div>
              <div class="index_left_top_main_Cars_num">1600</div>
              <p>车辆总数</p>
            </div>
            <div class="index_left_top_main_Cars">
              <div class="index_left_top_main_Cars_img"><img src="../assets/images/cars.png" alt=""></div>
              <div class="index_left_top_main_Cars_num">1600</div>
              <p>内部车辆</p>
            </div>
            <div class="index_left_top_main_Cars">
              <div class="index_left_top_main_Cars_img"><img src="../assets/images/cars.png" alt=""></div>
              <div class="index_left_top_main_Cars_num">1600</div>
              <p>外部车辆</p>
            </div>
            <div class="index_left_top_main_Cars">
              <div class="index_left_top_main_Cars_img"><img src="../assets/images/cars.png" alt=""></div>
              <div class="index_left_top_main_Cars_num">1600</div>
              <p>大货车</p>
            </div>
          </div>
        </div>
        <div class="index_left_bottom">
          <p class="home_title home_title-blue">车辆信息列表</p>
          <div class="title"><span>车牌号</span><span>标识</span><span>车辆类型</span><span>进入时间</span><span>离开时间</span></div>
          <div>

            <div class="index_left_bottom_main">
              <div class="message">
                <div class="title_message" v-for="(item,index) in historyData" :key="index">
                  <span>{{item.carNum}}</span>
                  <span>{{item.isert}}</span>
                  <span class="typeCar" :data ='item.typeCar'>{{item.typeCar}}</span>
                  <span>{{item.enterTime}}</span>
                  <span>{{item.outTime}}</span>
                </div>
              </div>
            </div>
          </div>
          <Page :total="dataCount" :page-size="pageSize" show-total @on-change="changepage" @on-page-size-change="pagesize" style="margin-top: 20px; text-align: center" />
        </div>

      </div>
      <div class="index_right">
        <CarsManage/>
    </div>
    </div>
  </div>
</template>

<script>
import CarsManage from '../components/CarsManage'
import echarts from 'echarts'
import moment from 'moment'
import http from '../api/http'
import BScroll from 'better-scroll'

export default {
  name: 'home',
  components: {
    CarsManage,
  },
  data() {
    return {
      carArr : [
        {carNum:'京AG6019',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6029',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6039',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6049',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6059',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6069',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6079',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6089',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6099',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6021',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6012',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6013',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6014',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6015',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6016',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6017',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6018',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6019',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6030',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6030',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6032',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6033',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6034',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6035',isert:'内部车辆',typeCar:'大货车',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'},
        {carNum:'京AG6036',isert:'内部车辆',typeCar:'小型车辆',enterTime:'2018-10-11 10:30',outTime:'2018-10-11 10:50'}
      ],
      timerId: '', // 定时器
      timerIdHour: '', // 中间小时的定时器
      currentTime: '', // 系统当前时间
      //分页
      dataCount: 0,  //初始化信息条数
      pageSize:10,//每页显示条数
      page:1, //当前页码
      historyData:[],
    }
  },
  created() {
    this._handleListApproveHistory()
  },
  mounted() {
    // 顶部日期时间
    this.currentTime = this.getCurrentDateTime();
    setInterval(() => {
      this.currentTime = this.getCurrentDateTime();
    }, 1000)
    // 定时器刷新
    // this.timerId = setInterval(() => {
    // }, 10000)
    //列表滑动
    new BScroll('.index_left_bottom_main',{
      scrollY : true
    })
    //大货车变色
   this._changeColor()

  },
  methods: {
    _handleListApproveHistory(){
      this.dataCount = this.carArr.length
      if(this.carArr.length<this.pageSize){
        this.historyData = this.carArr
      }else{
        this.historyData = this.carArr.slice(0,this.pageSize)
      }
    },
    changepage(index){  //当前页码
      this.page = index
      let _start = (index - 1)*this.pageSize
      let _end = index*this.pageSize
      this.historyData = this.carArr.slice(_start,_end)
    },
    pagesize(index){
      let _start = (this.page -1)*index
      let _end = this.page*index
      this.historyData = this.carArr.slice(_start,_end)
      this.pageSize = index
    },

    _changeColor(){
      const {carArr} = this
      var carNewArr = []
      for (var i = 0; i < carArr.length; i++) {
        if(carArr[i].typeCar === '大货车'){
          carNewArr.push(carArr[i])
          // console.log(carNewArr)
          $('span[data="大货车"]').parent().css({
            'background':'#2861A5',
          })
          $('span[data="大货车"]').parent().children().css({
            'color':'#E7D526',
          })
        }
      }
    },

    enterIndexPage() {
      // 路径从state中获取
      window.location.href = `${this.$store.state.baseUrl}/sanyShebei` //测试
    },
    // 时间格式化
    getCurrentDateTime() {
      return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },


    destroyed() {
      // clearInterval(this.timerId)
    }
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
    text-align: center;position: fixed;top:0;left:30px;right:30px;height:120px;padding-top:20px;box-sizing: border-box;
    .index_imgText{display: inline-block;cursor: pointer;}
    img{display:inline-block;vertical-align: middle;width:50px;}
    .title{font-size:30px;color:#0ccfeb;display:inline-block;vertical-align: middle;margin-left:10px;}
    .time{
      font-size:34px;color:#ababab;display: inline-block;vertical-align: middle;position: fixed;top:70px;right:30px;z-index: 10;
      font-family: fontnameUnidreamLED;
    }
  }
  &_main{
    position: fixed;top:120px;left:30px;right:30px;bottom:15px;
    // border-top:1px solid red;
  }
  /*6s页面左侧盒子*/
  &_left{
    width: 63%;float: left;height:100%;padding-right: 15px;
    display: flex;flex-direction: column;flex-shrink: 0;
	/*6s页面左侧上部*/
	&_top{
    flex: 4;width:100%;
    background: rgba(39,69,111,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    margin-top: 15px;
    padding-top: 15px;
    padding-left: 5px;
    &_main{
      height: calc(100% - 50px);display: flex;
      margin: 0 80px;
      &_Cars:nth-child(1){
        color: #02BBFE;
      }
      &_Cars:nth-child(2){
        color: #49E664;
      }
      &_Cars:nth-child(3){
        color: #FF3566;
      }
      &_Cars:nth-child(4){
        color: #FBD603;
      }
      &_Cars{
        width: 25%;
        height: 100%;
        /*border: 1px solid #fff;*/
        &_img{
          width: 100%;height: 60%;text-align: center;display: flex;align-items: center;justify-content: center;
        }
        &_num{
          text-align: center;font-size: 60px;font-family: fontnameRegular;
        }
        &>p{
          text-align: center;font-size: 24px;
        }
      }
    }
    /*background-color: #eee;*/
	}
	/*cars页面左侧下部*/
	&_bottom{
    flex: 6;width:100%;overflow:hidden;
    background: rgba(39,69,111,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    margin-top: 15px;
    padding-top: 15px;
    padding-left: 5px;
    padding-bottom: 15px;
    .pagesInfo{
      text-align: center;
    }

    .title{
      color:white;
      height:30px;
      margin-top: 15px;
      span{
        display:inline-block;
        width:20%;
        height:32px;
        padding-left: 30px;
        box-sizing:border-box;
        line-height:30px;
        font-size: 18px;
      }
    }
    &_main{
      height: calc(100% - 24px);
      overflow: hidden;
      //padding-bottom: 20px;
      .message{
        float:left;
        width:100%;
        margin-top:10px;
        padding-right:20px;
        .title_message{
          height:32px;
          margin-bottom: 5px;
          span{
            display:inline-block;
            width:20%;
            height:34px;
            padding-left: 30px;
            font-size: 18px;
            box-sizing:border-box;
            line-height:32px;
            color:#31a0ff;
            background:rgba(56,142,237,0.2);
          }
          /*span[data="大货车"]{*/
            /*background-color: #fff;*/
          /*}*/
        }
        /*.title_message:nth-child(even){*/
          /*background:rgba(56,142,237,0.2);*/
        /*}*/
      }
    }
    /*background-color: #ccc;*/
	}
    // border:1px solid #ff0;
  }
  /*cars页面右侧盒子*/
  &_right{
    width: 37%;float: left;height:100%;
  }
}
</style>
