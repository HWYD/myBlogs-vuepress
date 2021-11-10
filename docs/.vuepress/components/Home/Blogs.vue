<template>
  <div>
    <el-row :gutter="12" v-if="screenSize === 'big'">
      <el-col :span="16">
        <BlogsList />
      </el-col>
      <el-col :span="8">
        <BlogsDetail />
      </el-col>
    </el-row>
    <div v-if="screenSize === 'small'">
      <el-row>
        <el-col :span="24"><BlogsDetail /></el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :class="{'list-margin': screenSize === 'small'}"><BlogsList /></el-col>
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
  data() {
    return {
      screenSize: "",
    };
  },
  mounted() {
    this.screenSize = window.innerWidth < 768 ? "small" : "big";
  },
};
</script>

<style>
.list-margin{
  margin-top: 20px;
}
</style>