<template>
  <div>
    <el-card
      shadow="hover"
      v-for="item in blogsList"
      :key="item.title"
      @click="toBlog(item.link)"
    >
      <div class="blog-title">{{ item.title }}</div>
      <div>
        <i class="el-icon-user"></i>
        <span class="item-desc">{{ item.author }}</span>
        <i class="el-icon-time"></i>
        <span class="item-desc">{{ item.createTime }}</span>
      </div>
    </el-card>
    <div class="pagination-box">
      <el-pagination
        layout="prev, pager, next"
        :total="totalPages"
        :page-size="pageSize"
        @current-change="pageChange"
        background 
      >
      </el-pagination>
    </div>
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
    this.blogsList = blogsList.slice(0, this.pageSize);
  },
  methods: {
    toBlog(link) {
      this.$router.push(link);
    },
    pageChange(e) {
      console.log(e)
      const startIndex = (e - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.blogsList = blogsList.slice(startIndex, endIndex);
    },
  },
};
</script>

<style scoped>
.blog-title {
  margin-bottom: 15px;
}
.el-card {
  margin-bottom: 20px;
  cursor: pointer;
}
.item-desc {
  margin: 0 20px 0 5px;
}
.pagination-box{
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>