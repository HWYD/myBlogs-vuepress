<template>
  <el-card shadow="hover">
    <el-row class="flex-center">
      <img class="face-img" src="/images/face.jpg" />
    </el-row>
    <el-row class="flex-center"> dylan </el-row>
    <el-row>
      <el-col :span="12">
        <el-row class="flex-center"> 50 </el-row>
        <el-row class="flex-center"> 文章 </el-row>
      </el-col>
      <el-col :span="12">
        <el-row class="flex-center"> 10 </el-row>
        <el-row class="flex-center"> 标签 </el-row>
      </el-col>
    </el-row>
  </el-card>
  <el-carousel height="200px" direction="vertical" :autoplay="true">
    <el-carousel-item v-for="item in imgList" :key="item" >
      <img :src="item" alt="前端博客">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "BlogsDetail",
  data(){
    return{
      imgList:['/images/1.jpg','/images/2.jpg','/images/3.jpg','/images/4.jpg']
    }
  }
};
</script>

<style scoped>
.el-card{
  margin-bottom: 20px;
}
.user-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.flex-center {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.face-img {
  width: 80px;
  height: 80px;
}
.blogs-desc {
  display: flex;
  width: 100%;
  background-color: red;
}
.article-box {
  border-right: 1px solid rgb(0, 0, 0);
}
 .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>