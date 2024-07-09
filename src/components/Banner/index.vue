<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  width: Number,
  bannerList: Array,
  type: Number
})
const router = useRouter()
const caroIndex = ref(0)
//切换记录当前的幻灯片索引值
const onChange = (now) => {
  caroIndex.value = now
}
//实现滑动切换
//获取走马灯实例
const carousel = ref(null);
//定义鼠标位置
let startX = 0;
let endX = 0;
const onMouseDown = (event) => {
  //鼠标点击时候记录初始位置
  startX = event.clientX;
};
const onMouseUp = (event) => {
  //鼠标释放记录结束位置
  endX = event.clientX;
  //往右滑动下一页
  if (startX - endX > 50) {
    carousel.value.next();
  }
  //往左滑动上一页
  else if (endX - startX > 50) {
    carousel.value.prev();
  }
  else {
    router.push(props.bannerList[caroIndex.value].hrefUrl)
  }
};

</script>



<template>
  <div :class="{ banner_home: type === 1, banner_category: type === 2 }" v-show="visible"
    :style="{ height: '500px', width: width + 'px' }">
    <el-carousel height="500px" ref="carousel" :interval="3000" arrow="never" trigger="click" @mousedown="onMouseDown"
      @mouseup="onMouseUp" @change="onChange">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <img :src="item.imgUrl">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>



<style scoped lang='scss'>
//首页的样式
.banner_home {
  margin-left: 250px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
    pointer-events: none; //禁止鼠标事件
    user-select: none;
  }
}

//分类的样式
.banner_category {
  width: 1240px;
  height: 500px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 500px;
    pointer-events: none; //禁止鼠标事件
    user-select: none;
  }
}
</style>