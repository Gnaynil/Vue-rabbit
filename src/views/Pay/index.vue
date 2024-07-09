<script setup>
import { getOrderAPI, payMockAPI } from "@/apis/pay";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCountDown } from "@/components/useCountDown";
import router from "@/router";
const countDown = useCountDown();
// const {start,formatTime} = useCountDown()

const route = useRoute();
const payInfo = ref({});
const show = ref(false)

const getPayInfo = async () => {
  show.value = false
  const res = await getOrderAPI(route.query.id);
  payInfo.value = res.result;
  //初始化倒计时秒数
  countDown.start(payInfo.value.countdown);
  show.value = true
};
onMounted(() => getPayInfo());

//跳转支付
//1.携带订单id 以及 回调地址跳转到支付地址(get)
// 支付地址
const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
const backURL = "http://localhost:5173/paycallback";
const redirectUrl = encodeURIComponent(backURL);
const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.id}&redirect=${redirectUrl}`;

//模拟支付
const payMock = async () => {
  await payMockAPI(route.query.id);
  router.push({
    path: '/paycallback',
    query: {
      orderId: route.query.id,
      payResult: true
    }
  })
}
</script>

<template>

  <div class="xtx-pay-page" v-show="show">
    <div class="pay-timeout" v-if="payInfo.countdown < 0">
      <span class="iconfont icon-shanchu red"></span>
      <p>支付超时</p>
    </div>
    <div class="container" v-else>
      <!-- 付款信息 -->
      <div class="pay-info">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>支付还剩 <span>{{ countDown.formatTime }}</span>, 超时后将取消订单</p>
        </div>
        <div class="amount">
          <span>应付总额：</span>
          <span>¥{{ payInfo.payMoney?.toFixed(2) }}</span>
        </div>
      </div>
      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a class="btn alipay" :href="payUrl"></a>
          <a class="btn wx disabled"></a>
          <a class="btn mock" @click="payMock">模拟支付</a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn disabled">招商银行</a>
          <a class="btn disabled">工商银行</a>
          <a class="btn disabled">建设银行</a>
          <a class="btn disabled">农业银行</a>
          <a class="btn disabled">交通银行</a>
        </div>
      </div>
    </div>
  </div>
  <XtxLoading v-show="!show"></XtxLoading>
</template>

<style scoped lang="scss">
.xtx-pay-page {
  margin-top: 20px;
}

.pay-timeout {
  padding: 100px 0;
  background: #fff;
  text-align: center;
  margin-top: 20px;

  .iconfont {
    font-size: 60px;
  }

  .red {
    color: $priceColor;
  }
}

.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;

  .icon {
    font-size: 80px;
    color: #1dc779;
  }

  .tip {
    padding-left: 10px;
    flex: 1;

    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }

      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }

  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }

      &:last-child {
        color: $priceColor;
        font-size: 20px;
      }
    }
  }
}

.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;

  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;

    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;

    &.active,
    &:hover {
      border-color: $xtxColor;
    }

    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
    }

    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
    }

    &.mock {
      position: relative;
      cursor: pointer;
      top: -20px
    }

    // &.disabled {
    //   opacity: 0.3;
    //   border-color: #f5f5f5;
    //   background-color: #F0F0F0;
    //   cursor: not-allowed;
    // }
  }
}
</style>