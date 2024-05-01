//封装分类数据业务相关代码
import { getTopCategoryAPI } from "@/apis/category";

import { onBeforeUpdate, onMounted, ref } from "vue";
import { onBeforeRouteUpdate,useRoute } from "vue-router";

export function useCategory() {
    const categoryData = ref([]);
    const route = useRoute();
    const getCategoryData = async (id = route.params.id) => {
        const res = await getTopCategoryAPI(id);
        categoryData.value = res.result;
    };
    onMounted(() => {
        getCategoryData();
    });
    // 目标:路由参数变化的时候 可以把分类数据接口重新发送
    // onBeforeUpdate(() => {
    //     if (route.params.id !== categoryData.value.id) {
    //         getCategoryData(route.params.id);
    //     }
    //     // console.log(route.params.id);
    //     // getCategoryData(to.params.id);
    // });
    onBeforeRouteUpdate((to) => { 
        getCategoryData(to.params.id);
    });
    return { categoryData }
}