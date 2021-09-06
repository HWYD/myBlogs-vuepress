<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="16">
        <BlogsList />
      </el-col>
      <el-col :span="8">
        <BlogsDetail />
      </el-col>
    </el-row>
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
};
</script>

<style>
</style>