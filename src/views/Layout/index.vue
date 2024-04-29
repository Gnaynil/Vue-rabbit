<template>
    <Fixed/>
    <LayoutNav/>
    <LayoutHeader/>
    <RouterView/>
    <LayoutFooter/>

</template>

<script setup lang='ts'>
  import LayoutNav from './components/Nav.vue'
  import LayoutHeader from './components/Header.vue'
  import LayoutFooter from './components/Footer.vue'
  import Fixed from './components/Fixed.vue'
import { useCategoryStore } from '@/stores/category.js';
import { onMounted } from 'vue';

  const categoryStore = useCategoryStore();
  onMounted(()=>{
    categoryStore.getCategory()
  })

</script>

<style scoped>

</style>