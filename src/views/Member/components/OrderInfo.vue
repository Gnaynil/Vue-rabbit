<script setup>
import { getOrderInfoAPI } from "@/apis/order.js";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const orderInfo = ref({}); // 订单对象
const visiabled = ref(false)

const getOrderInfo = async () => {
    visiabled.value = false
    const res = await getOrderInfoAPI(route.params.id);
    orderInfo.value = res.result;
    console.log(orderInfo.value);
    visiabled.value = true
};
onMounted(() => getOrderInfo());
</script>

<template>
    <div class="xtx-pay-checkout-page">
        <div class="container" v-if="visiabled">
            <div class="wrapper">
                <!-- 收货地址 -->
                <h3 class="box-title">收货地址</h3>
                <div class="box-body">
                    <div class="address">
                        <div class="text">
                            <ul >
                                <li><span>收<i />货<i />人：</span>{{ orderInfo.receiverContact }}</li>
                                <li><span>联系方式：</span>{{ orderInfo.receiverMobile }}</li>
                                <li><span>收货地址：</span>{{ orderInfo.receiverAddress }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- 商品信息 -->
                <h3 class="box-title">商品信息</h3>
                <div class="box-body">
                    <table class="goods">
                        <thead>
                            <tr>
                                <th width="520">商品信息</th>
                                <th width="170">单价</th>
                                <th width="170">数量</th>
                                <th width="170">实付</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in orderInfo.skus" :key="i.id">
                                <td>
                                    <a :href="`/detail/${i.id}`" class="info">
                                        <img :src="i.image" alt="">
                                        <div class="right">
                                            <p>{{ i.name }}</p>
                                            <p>{{ i.attrsText }}</p>
                                        </div>
                                    </a>
                                </td>
                                <td>&yen;{{ i.curPrice }}</td>
                                <td>{{ i.quantity }}</td>
                                <td>&yen;{{ i.realPay }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 金额明细 -->
                <h3 class="box-title">金额明细</h3>
                <div class="box-body">
                    <div class="total">
                        <dl>
                            <dt>商品件数：</dt>
                            <dd>{{ orderInfo.totalNum }}件</dd>
                        </dl>
                        <dl>
                            <dt>商品总价：</dt>
                            <dd>¥{{ orderInfo.totalMoney.toFixed(2) }}</dd>
                        </dl>
                        <dl>
                            <dt>运<i></i>费：</dt>
                            <dd>¥{{ orderInfo.postFee.toFixed(2) }}</dd>
                        </dl>
                        <dl>
                            <dt>实付总额：</dt>
                            <dd class="price">{{ orderInfo.payMoney.toFixed(2) }}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
        <XtxLoading v-else/>
    </div>
</template>

<style scoped lang="scss">
.xtx-pay-checkout-page {
    margin-top: 20px;

    .wrapper {
        background: #fff;
        padding: 0 20px;

        .box-title {
            font-size: 16px;
            font-weight: normal;
            padding-left: 10px;
            line-height: 70px;
            border-bottom: 1px solid #f5f5f5;
        }

        .box-body {
            padding: 20px 0;
        }
    }
}

.address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;

    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;

        .none {
            line-height: 90px;
            color: #999;
            text-align: center;
            width: 100%;
        }

        >ul {
            flex: 1;
            padding: 20px;

            li {
                line-height: 30px;

                span {
                    color: #999;
                    margin-right: 5px;

                    >i {
                        width: 0.5em;
                        display: inline-block;
                    }
                }
            }
        }

        >a {
            color: $xtxColor;
            width: 160px;
            text-align: center;
            height: 90px;
            line-height: 90px;
            border-right: 1px solid #f5f5f5;
        }
    }

    .action {
        width: 420px;
        text-align: center;

        .btn {
            width: 140px;
            height: 46px;
            line-height: 44px;
            font-size: 14px;

            &:first-child {
                margin-right: 10px;
            }
        }

    }
}

.goods {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    .info {
        display: flex;
        text-align: left;

        img {
            width: 70px;
            height: 70px;
            margin-right: 20px;
        }

        .right {
            line-height: 24px;

            p {
                &:last-child {
                    color: #999;
                }
            }
        }
    }

    tr {
        th {
            background: #f5f5f5;
            font-weight: normal;
        }

        td,
        th {
            text-align: center;
            padding: 20px;
            border-bottom: 1px solid #f5f5f5;

            &:first-child {
                border-left: 1px solid #f5f5f5;
            }

            &:last-child {
                border-right: 1px solid #f5f5f5;
            }
        }
    }
}

.box-content {
    display: flex;


    .my-btn {
        width: 228px;
        height: 50px;
        border: 1px solid #e4e4e4;
        text-align: center;
        line-height: 48px;
        margin-right: 25px;
        color: #666666;
        // display: inline-block;

        &.active,
        &:hover {
            border-color: $xtxColor;
        }

        &.disabled {
            opacity: 0.6;
            border-color: #f5f5f5;
            background-color: #F0F0F0;
            cursor: not-allowed;
        }
    }
}


.total {
    dl {
        display: flex;
        justify-content: flex-end;
        line-height: 50px;

        dt {
            i {
                display: inline-block;
                width: 2em;
            }
        }

        dd {
            width: 240px;
            text-align: right;
            padding-right: 70px;

            &.price {
                font-size: 20px;
                color: $priceColor;
            }
        }
    }
}

.submit {
    text-align: right;
    padding: 60px;
    border-top: 1px solid #f5f5f5;
}

.addressWrapper {
    max-height: 500px;
    overflow-y: auto;
}

.text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    &.item {
        border: 1px solid #f5f5f5;
        margin-bottom: 10px;
        cursor: pointer;

        &.active,
        &:hover {
            border-color: $xtxColor;
            background: lighten($xtxColor, 50%);
        }

        >ul {
            padding: 10px;
            font-size: 14px;
            line-height: 30px;
        }
    }
}
</style>