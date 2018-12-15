<template>
  <div class="maching-center">
    <div class="home_head-btn" @click="bostmachcenter">
      {{currentCenterName}}
      <img v-show="flag" src="../assets/images/icon_arrow-down.png" />
      <img v-show="!flag" src="../assets/images/icon_arrow-up.png" />
    </div>
    <div class="home_container" :class="{off:flag}">
      <header class="home_container_title" @click="getCenterInfo('')">
        三一桩机
      </header>
      <img class="close" src="../assets/images/close.png" @click="close" />
      <ul class="home_container_list">
        <li v-for="(centerItem,index) in centername" :key="index" :ref="index" @click="getCenterInfo(centerItem)">{{centerItem}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MachingCenter",
    data () {
      return{
        flag:true,  // 加工中心显示
        currentCenterName: '三一桩机',
        centername:['组装工作中心', '钻具工作中心', '机加工作中心', '变幅工作中心', '备料工作中心', '桅杆工作中心', '调试工作中心', '设备工作中心', '仓储配送工作中心', '部件涂装工作中心']
      }
    },
    mounted () {},
    methods: {
      bostmachcenter () {
        this.flag = false
      },
      close () {
        this.flag = true
      },
      getCenterInfo (item) {
        //调用发请求
        this.flag = true
        if (item === '') {
          this.currentCenterName = '三一桩机'
        }
        if (item.indexOf('工作中心') > -1) {
          this.currentCenterName = item.substring(0,item.length-4)
        }
        this.$emit('selectName',item)
      }
    }

  }
</script>

<style lang="scss" scoped>
  .maching-center{
    width:25%;
    .home_head-btn{
      position: fixed;right:24px;top:50px;width:140px;height:40px;text-align: center;line-height: 40px;
      background: gradient(linear, left top, left bottom, from(#4CDDED), to(#0088FE));
      background: linear-gradient(top,  #4CDDED,  #0088FE);
      background: -ms-linear-gradient(top,  #4CDDED,  #0088FE);
      color:#fff;font-size:22px;border-radius: 5px;cursor: pointer;
      img{vertical-align: middle}
    }
    .home_container{
      width: 24%;
      background-color: #0e2154;
      opacity: 0.9;
      position: absolute;
      top:120px;bottom:30px;
      right: 15px;
      z-index:100;
      text-align: center;
      &.off{
        display: none;
        transition: 1s;
      }
      &_title{
        color: yellow;
        font-size: 24px;
        margin-top: 60px;
        cursor: pointer;
      }
      .close{
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 30px;
        color: #1578CF;
        &:hover{
          cursor: pointer;
        }
      }
      &_list{
        width: 80%;
        margin: 0 auto;
        &>li{
          background:rgba(12,51,103,0.1);
          height: 40px;line-height: 40px;border: 1px solid rgba(0,136,255,0.6);
          margin-top: 20px;
          color: #50b4ff;
          border-radius: 5px;
          &:hover{
            background:rgba(08,72,158,1);
            cursor: pointer;
            color:#fff
          }
        }
      }
    }
    .currentTime{
      position: fixed;right:24px;top:10px;color:#ababab;font-size:32px;
    }
  }

</style>
