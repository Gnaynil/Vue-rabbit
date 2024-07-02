<template>
  <Fixed />
  <LayoutNav />
  <LayoutHeader />
  <!-- 添加key 破坏复用机制 强制销毁重建 -->
  <!-- <RouterView :key="$route.fullPath"/> -->
  <RouterView />
  <LayoutFooter />

</template>

<script setup lang='ts'>
import LayoutNav from './components/Nav.vue'
import LayoutHeader from './components/Header.vue'
import LayoutFooter from './components/Footer.vue'
import Fixed from './components/Fixed.vue'
import { useCategoryStore } from '@/stores/category.js';
import { onMounted } from 'vue';

const categoryStore = useCategoryStore();
onMounted(() => {
  if (categoryStore.categoryList.value === void .0) {
    categoryStore.getCategory()
  }
})

</script>

<style scoped></style>