<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import url(./assets/css/reset.css);
@import url(./assets/css/font.css);
#app {
  height:100%;
}
.home_title{
  padding-left: 24px;font-weight:bold;
  font-size:26px;
  &-yellow{
    background:url('./assets/images/index_title-yellow.png') no-repeat left center;
  }
  &-blue{
    background:url('./assets/images/index_title-blue.png') no-repeat left center;
  }
  &-purple{
    background:url('./assets/images/index_title-purple.png') no-repeat left center;
  }
  img{margin-left:5px;}
}

</style>
