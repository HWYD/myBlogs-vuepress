<template>
  <div>
    <el-card shadow="hover" v-for="item in blogsList" :key="item.title" @click="toBlog(item.link)">
      <!-- <router-link :to="item.link"> -->
        <div class="blog-title">{{ item.title }}</div>
        <div>
          <i class="el-icon-user"></i>
          <span class="item-desc">{{ item.author }}</span>
          <i class="el-icon-time"></i>
          <span class="item-desc">{{ item.createTime }}</span>
        </div>
      <!-- </router-link> -->
    </el-card>
  </div>
</template>

<script>
import { blogsList } from "../../data";
export default {
  name: "BlogsList",
  data() {
    return {
      blogsList: blogsList,
    };
  },
  methods:{
    toBlog(link){
      // console.log(link)
      this.$router.push(link)
    }
  }
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
</style>