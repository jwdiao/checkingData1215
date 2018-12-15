<template>
	<div class="capture_box">
		<!--左侧实时事件抓拍表格-->			
		<div class="message">
			<div class="title"><span>事件名称</span><span>抓拍地点</span><span>抓拍时间</span></div>
			<div class="title_message" v-for="item in 11"><span>物料取走</span><span>智能1号厂房</span><span>21:11</span></div>
		</div>
		<!--左侧实时事件抓拍表格-->
		<div class="image">
			<img src="../assets/images/TP.png" alt="">
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Capture',
		data() {
			return {				
			};
		}
	}
</script>

<style lang="scss" scoped>
     .capture_box{
		 width:100%;
		 overflow:hidden;
		 height:94%;
		 .message{
			 float:left;
			 width:60%;
			 height:80%;
			 margin-top:10px;
			 padding-right:20px;
			 .title{
				 color:white;
				 height:9%;
				 span{
					 display:inline-block;
					 width:33.3%;
					 height:30px;
					 padding-left: 30px;
					 box-sizing:border-box;
					 line-height:30px;
				 }
			 }
			 .title_message{
				 height:10%;				 
				 span{
					 display:inline-block;
					 width:33.3%;
					 height:10%;
					 padding-left: 30px;
					 box-sizing:border-box;
					 line-height:32px;
					 color:#31a0ff;
				 }
			 }
			 .title_message:nth-child(even){
				 background:rgba(56,142,237,0.2);
				 
			 }
		 }
		 .image{
			 float:left;
			 width:40%;
			 padding: 10px;
			 background:rgba(56,142,237,0.4);	 
			 border:1px solid rgba(49,160,255,0.6);
			 height:90%;
			 margin-top:40px;
			 img{
				 width:100%;
				 height:100%;
			 }
		 }
	 }
</style>
