<template>
  <div class="container">
    <HomeCategory :onHover="handleHover"/>
    <HomeBanner :visible="visible"/>
  </div>
  <HomeNew />
  <!-- <HomeHot /> -->
  <homeProduct />
</template>

<script setup lang='ts'>
import HomeCategory from "./components/Category.vue";
import HomeBanner from "./components/Banner.vue";
import HomeNew from "./components/New.vue";
import HomeHot from "./components/Hot.vue";
import homeProduct from "./components/Product.vue";
import { ref } from "vue";
const visible = ref(true);
const handleHover = () => {
  visible.value = !visible.value
}

</script>

<style lang="scss">

</style>