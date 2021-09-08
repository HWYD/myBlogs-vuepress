<template>
  <div>
    <el-row :gutter="12" v-if="largeScreen">
      <el-col :span="16">
        <BlogsList />
      </el-col>
      <el-col :span="8">
        <BlogsDetail />
      </el-col>
    </el-row>
    <div v-else>
      <el-row>
       <el-col :span="24"><BlogsDetail /></el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><BlogsList /></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import BlogsList from "./BlogsList.vue";
import BlogsDetail from "./BlogsDetail.vue";
export default {
  components: {
    BlogsList,
    BlogsDetail,
  },
  data(){
    return{
     largeScreen:true
    }
  },
  mounted(){
    this.largeScreen=window.innerWidth<768?false:true
  }
};
</script>

<style>
</style>