<script setup>
import { getUserOrder, getMemberOrderConsignmentAPI, getMemberOrderLogisticsAPI, putMemberOrderReceiptAPI, cancelOrderAPI } from '@/apis/order.js'
import useCountDown from './useCountDown.vue';
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus';

const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "unpay", label: "待付款" },
  { name: "deliver", label: "待发货" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" }
]

// 分页参数
const orderList = ref([])
const params = ref({
  orderState: 0,
  page: 1,
  pageSize: 10
})
const total = ref()
//获取订单列表
const getOrderList = async () => {
  show.value = false;
  const res = await getUserOrder(params.value)
  orderList.value = res.result.items
  total.value = res.result.counts
  //获取假数据
  // const res = await axios.get('http://localhost:3000/result')
  // orderList.value = res.data.items
  // total.value = res.data.counts
  show.value = true
}
onMounted(() => { getOrderList(0); })
//订单分页
const handleChange = (tab) => {
  params.value.page = 1;
  params.value.orderState = tab.index;
  getOrderList()
}
const show = ref(true)
const pagesChange = (page) => {
  params.value.page = page
  getOrderList()
}
//获取订单状态
const orderStateList = [
  { id: 0, text: '' },
  { id: 1, text: '待付款' },
  { id: 2, text: '待发货' },
  { id: 3, text: '待收货' },
  { id: 4, text: '待评价' },
  { id: 5, text: '已完成' },
  { id: 6, text: '已取消' },
]

//模拟发货
const onOrderSend = async (id) => {
  await getMemberOrderConsignmentAPI(id)
  ElMessage.success('模拟发货成功')
  getOrderList()
}
//查看物流信息
const dialogVisible = ref(false)
const LogisticsList = ref([])
const LogisticsCompany = ref({})
const getLogistics = async (id) => {
  const res = await getMemberOrderLogisticsAPI(id)
  LogisticsList.value = res.result.list
  LogisticsCompany.value = res.result.company
  //假数据
  // const res = await axios.get('http://localhost:3301/result')
  // LogisticsList.value = res.data.list
  // LogisticsCompany.value = res.data.company
  dialogVisible.value = true
}

//确认收货 
const receiptOrder = async (id) => {
  await putMemberOrderReceiptAPI(id);
  getOrderList()
}
//取消订单
const cancelVisible = ref(false)
const cancelReason = ref('')
const cancelId = ref()
const cancelOrder = async () => {
  await cancelOrderAPI(cancelId.value, cancelReason.value);
  cancelVisible.value = false
  getOrderList()
  setTimeout(()=>{
    ElMessage.success('取消成功')
  },1000)

}

</script>

<template>
  <div class="order-container">
    <el-tabs @tab-click="handleChange">
      <!-- tab切换 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" />

      <div class="main-container">
        <XtxLoading v-show="!show" />
        <div v-show="show">
          <div class="holder-container" v-if="orderList.length === 0">
            <el-empty description="暂无订单数据" />
          </div>
          <div v-else>
            <!-- 订单列表 -->
            <div class="order-item" v-for="order in orderList" :key="order.id">
              <div class="head">
                <span>下单时间：{{ order.createTime }}</span>
                <span>订单编号：{{ order.id }}</span>
                <!-- 未付款，倒计时时间还有 -->
                <span class="down-time" v-if="order.orderState === 1">
                  <i class="iconfont icon-down-time"></i>
                  <useCountDown :count="order.countdown" />
                </span>
              </div>
              <div class="body">
                <div class="column goods">
                  <ul>
                    <li v-for="item in order.skus" :key="item.id">
                      <a class="image" href="javascript:;">
                        <img :src="item.image" alt="" />
                      </a>
                      <div class="info">
                        <p class="name ellipsis-2">
                          {{ item.name }}
                        </p>
                        <p class="attr ellipsis">
                          <span>{{ item.attrsText }}</span>
                        </p>
                      </div>
                      <div class="price">¥{{ item.realPay?.toFixed(2) }}</div>
                      <div class="count">x{{ item.quantity }}</div>
                    </li>
                  </ul>
                </div>
                <div class="column state">
                  <p>{{ orderStateList.find(e => e.id === order.orderState).text }}</p>
                  <p v-if="order.orderState === 2">
                    <a class="green" @click="onOrderSend(order.id)">模拟发货</a>
                  </p>
                  <p v-if="[3, 4, 5].includes(order.orderState)">
                    <a @click="getLogistics(order.id)" class="green">查看物流</a>
                  </p>
                  <!-- <p v-if="order.orderState === 4">
                    <a href="javascript:;" class="green">评价商品</a>
                  </p>
                  <p v-if="order.orderState === 5">
                    <a href="javascript:;" class="green">查看评价</a>
                  </p> -->
                </div>
                <div class="column amount">
                  <p class="red">¥{{ order.payMoney?.toFixed(2) }}</p>
                  <p>（含运费：¥{{ order.postFee?.toFixed(2) }}）</p>
                  <p>{{ order.payType === 1 ? '在线支付' : '货到付款' }}</p>
                </div>
                <div class="column action state">
                  <el-button v-if="order.countdown !== -1 && order.orderState === 1" type="primary" @click="$router.push(`/pay?id=${order.id}`)" size="small">
                    立即付款
                  </el-button>
                  <el-button v-if="order.orderState === 3" type="primary" size="small" @click="receiptOrder(order.id)">
                    确认收货
                  </el-button>
                  <p><a :href="`/orderdetail/${order.id}`">查看详情</a></p>
                  <!-- <p v-if="[2, 3, 4, 5].includes(order.orderState)">
                    <a href="javascript:;">再次购买</a>
                  </p>
                  <p v-if="[4, 5].includes(order.orderState)">
                    <a href="javascript:;">申请售后</a>
                  </p> -->
                  <p v-if="order.orderState === 1">
                    <a @click="cancelVisible = true;cancelId=order.id" class="green">取消订单</a>
                  </p>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination background layout="prev, pager, next" :total="total" :page-size="params.pageSize"
                :pager-count="11" @current-change="pagesChange" />
            </div>
          </div>
        </div>

      </div>

    </el-tabs>
    <el-dialog v-model="dialogVisible" title="物流信息" width="600px">
      <div v-for="item in LogisticsList" :key="item.id" class="shipment">
        <div class="time">{{ item.time }}</div>
        <div class="message">{{ item.text }}</div>
      </div>
    </el-dialog>
    <el-dialog v-model="cancelVisible" title="取消订单" width="600px">
      <p>取消订单原因:</p><input v-model="cancelReason" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="cancelOrder()">取消订单</el-button>
        </span>
      </template>
    </el-dialog>

  </div>

</template>

<style scoped lang="scss">
.order-container {
  padding: 10px 20px;

  .pagination-container {
    display: flex;
    justify-content: center;
  }

  .main-container {
    min-height: 500px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;

  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;

    span {
      margin-right: 20px;

      &.down-time {
        margin-right: 0;
        float: right;

        i {
          vertical-align: middle;
          margin-right: 3px;
        }

        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }

    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }

  .body {
    display: flex;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;

      >p {
        padding-top: 10px;
      }

      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;

        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;

            &:last-child {
              border-bottom: none;
            }

            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }

            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;

              p {
                margin-bottom: 5px;

                &.name {
                  height: 38px;
                }

                &.attr {
                  color: #999;
                  font-size: 12px;

                  span {
                    margin-right: 5px;
                  }
                }
              }
            }

            .price {
              width: 100px;
            }

            .count {
              width: 80px;
            }
          }
        }
      }

      &.state {
        width: 120px;

        .green {
          color: $xtxColor;
          cursor: pointer;
        }
      }

      &.amount {
        width: 200px;

        .red {
          color: $priceColor;
        }
      }

      &.action {
        width: 140px;

        a {
          display: block;

          &:hover {
            color: $xtxColor;
          }
        }
      }
    }
  }
}

.shipment {
  display: flex;
  border-radius: 10px;
  background-color: #fff;
  height: 16px;
  line-height: 16px;
  margin: 20px;

  .message {
    margin-left: 10px;
    font-size: 20px;
    color: #444
  }

  .time {
    font-size: 16px;
    color: #666
  }
}
</style>