<script setup>
import { getBannerAPI } from "@/apis/home";
import { ref, onMounted } from "vue";

const bannerList = ref([]);
const getBanner = async () => {
  const res = await getBannerAPI();
  bannerList.value = res.result;
};
onMounted(() => {
  getBanner();
});
defineProps({
  visible: Boolean
})
</script>



<template>
  <div class="home-banner" v-show="visible">
    <el-carousel height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <a :href="item.hrefUrl"><img :src="item.imgUrl" alt=""></a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>



<style scoped lang='scss'>
.home-banner {
  margin-left: 250px;
  width: 990px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>