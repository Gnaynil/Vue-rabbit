<template>
    <b>付款截止:
        <b v-if="count === -1">已超时</b>
        <b v-else>{{ countDown.formatTime }}</b>
    </b>
</template>

<script setup>
import { useCountDown } from "@/components/useCountDown";
const countDown = useCountDown();
const props = defineProps({
    count: {
        type: Number,
    }
});
countDown.start(props.count)


</script>