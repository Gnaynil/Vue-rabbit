<template>
  <div class="container">
    <HomeCategory :onHover="handleHover" />
    <XtxBanner :visible="visible" :width="990" :bannerList="bannerList" :type='1' />
  </div>
  <HomeNew />
  <!-- <HomeHot /> -->
  <homeProduct />
</template>

<script setup>
import HomeCategory from "./components/Category.vue";
// import HomeBanner from "./components/Banner.vue";
import HomeNew from "./components/New.vue";
import HomeHot from "./components/Hot.vue";
import homeProduct from "./components/Product.vue";

import { getBannerAPI } from "@/apis/home";
import { ref, onMounted } from "vue"
const visible = ref(true);
const handleHover = () => {
  visible.value = !visible.value
}
const bannerList = ref([]);
const getBanner = async () => {
  const res = await getBannerAPI();
  bannerList.value = res.result;
};
onMounted(() => {
  getBanner();
});

</script>

<style lang="scss"></style>