<template>
    <b>付款截止:
        <b v-if="count < 0">已超时</b>
        <b v-else>{{ countDown.formatTime }}</b>
    </b>
</template>

<script setup>
import { useCountDown } from "@/components/useCountDown";
const countDown = useCountDown();
const props = defineProps({
    payLatestTime:{
        type:String
    },
});
//获取当前时间戳
const nowDate = Math.round(new Date().getTime()/1000)
//获取截止时间的时间戳
const LatestDate = Date.parse(props.payLatestTime)/1000
//倒计时
const count = LatestDate- nowDate
// console.log(count);
countDown.start(count)


</script>