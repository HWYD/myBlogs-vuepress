<template>
  <div class="time-wrap">
  <el-timeline>
    <el-timeline-item  placement="top" v-for="blog in blogsList" :key="blog.link">
      <el-card>
        <h4>{{blog.title}}</h4>
        <p>HWYD {{blog.createTime}}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</div>
</template>

<script>
import { blogsList } from "../../data";
export default {
  name: "BlogsList",
  data() {
    return {
      blogsList: [],
      currentPage: 1,
      pageSize: 5,
      totalPages: blogsList.length,
    };
  },
  mounted() {
    this.blogsList = blogsList
  },
  methods: {
    toBlog(link) {
      this.$router.push(link);
    },
    // pageChange(e) {
    //   console.log(e)
    //   const startIndex = (e - 1) * this.pageSize;
    //   const endIndex = startIndex + this.pageSize;
    //   this.blogsList = blogsList.slice(startIndex, endIndex);
    // },
  },
};
</script>

<style scoped>
.time-wrap{
  margin-top: 30px;
}
</style>