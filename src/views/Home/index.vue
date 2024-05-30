<template>
  <div class="container">
    <HomeCategory />
    <HomeBanner />
  </div>
  <HomeNew />
  <HomeHot />
  <homeProduct />
</template>
  
  <script setup lang='ts'>
import HomeCategory from "./components/Category.vue";
import HomeBanner from "./components/Banner.vue";
import HomeNew from "./components/New.vue";
import HomeHot from "./components/Hot.vue";
import homeProduct from "./components/Product.vue";

</script>
  
  <style scoped>
</style>