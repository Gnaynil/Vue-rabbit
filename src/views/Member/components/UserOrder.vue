<script setup>
import useCountDown from './useCountDown.vue';
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus';
import { useOrderStore } from '@/stores/order.js'

const orderStore = useOrderStore()
//Tab栏
const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "unpay", label: "待付款" },
  { name: "deliver", label: "待发货" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" }
]
//获取订单列表
const getOrderList = async () => {
  await orderStore.updateNewOrderList(orderStore.orderParamsState)
}
onMounted(() => { getOrderList() })
//切换Tabs标签页
const handleChange = (tab) => {
  orderStore.handleTabsChange(tab)
}
//切换分页
const pagesChange = (page) => {
  orderStore.handlePagesChange(page)
}
//订单状态
const orderStateList = [
  { id: 0, text: '' },
  { id: 1, text: '待付款' },
  { id: 2, text: '待发货' },
  { id: 3, text: '待收货' },
  { id: 4, text: '待评价' },
  { id: 5, text: '已完成' },
  { id: 6, text: '已取消' },
]
//查看物流信息
const dialogVisible = ref(false)
const logisticsSkeleton = ref(true)
const getLogistics = async (id) => {
  logisticsSkeleton.value = true
  dialogVisible.value = true
  await orderStore.getLogistics(id)
  logisticsSkeleton.value = false
}
//取消订单
const cancelVisible = ref(false)
const cancelReason = ref('')
const cancelId = ref()
const cancelOrder = async () => {
  await orderStore.handleCancelOrder(cancelId.value, cancelReason.value)
  cancelVisible.value = false
  setTimeout(() => {
    ElMessage.success('取消成功')
  }, 1000)
}
</script>

<template>
  <div class="order-container">
    <el-tabs @tab-click="handleChange" v-model='tabTypes[orderStore.orderParamsState].name'>
      <!-- tab切换 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" :name="item.name" />
      <div class="main-container">
        <XtxLoading v-if="orderStore.showLoading" :code="orderStore.getdataState" />
        <div v-else>
          <div class="holder-container" v-if="!orderStore.orderList[orderStore.orderParamsState]?.length > 0">
            <el-empty description="暂无订单数据" />
          </div>
          <div v-else>
            <!-- 订单列表 -->
            <div class="order-item" v-for="order in orderStore.orderList[orderStore.orderParamsState]" :key="order.id">
              {{ orderStore.orderList[orderStore.orderParamsState].items }}
              <div class="head">
                <span>下单时间：{{ order.createTime }}</span>
                <span>订单编号：{{ order.id }}</span>
                <!-- 未付款，倒计时时间还有 -->
                <span class="down-time" v-if="order.orderState === 1">
                  <i class="iconfont icon-down-time"></i>
                  <useCountDown :count="order.countdown" :payLatestTime="order.payLatestTime" />
                </span>
              </div>
              <div class="body">
                <div class="column goods">
                  <ul>
                    <li v-for="item in order.skus" :key="item.id">
                      <a class="image" :href="`/detail/${item.spuId}`">
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
                    <a class="green" @click="orderStore.onOrderSend(order.id)">模拟发货</a>
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
                  <el-button v-if="order.countdown !== -1 && order.orderState === 1" type="primary"
                    @click="$router.push(`/pay?id=${order.id}`)" size="small">
                    立即付款
                  </el-button>
                  <el-button v-if="order.orderState === 3" type="primary" size="small"
                    @click="orderStore.receiptOrder(order.id)">
                    确认收货
                  </el-button>
                  <p><a :href="`/orderdetail/${order.id}`">查看详情</a></p>
                  <p v-if="[2, 3, 4, 5].includes(order.orderState)">
                    <a :href="`/checkout/${order.id}`">再次购买</a>
                  </p>
                  <!-- <p v-if="[4, 5].includes(order.orderState)">
                    <a href="javascript:;">申请售后</a>
                  </p> -->
                  <p v-if="order.orderState === 1">
                    <a @click="cancelVisible = true; cancelId = order.id" class="green">取消订单</a>
                  </p>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination background layout="prev, pager, next"
                :total="parseInt(orderStore.total[orderStore.orderParamsState])" :page-size="10" :pager-count="11"
                @current-change="pagesChange" :current-page="orderStore.params.page" />
            </div>
          </div>
        </div>
      </div>
    </el-tabs>
    <el-dialog v-model="dialogVisible" title="物流信息" width="600px" style="border-radius: 10px;">
      <el-skeleton :rows="5" v-show="logisticsSkeleton" />
      <div class="company" v-show="!logisticsSkeleton">
        <div class="name">{{ orderStore.orderLogisticsCompany.name }}
          <b v-copy="orderStore.orderLogisticsCompany.number" id="text-content">
            <el-tooltip content="复制快递单号" placement="top-start">
              {{ orderStore.orderLogisticsCompany.number }}
            </el-tooltip>
          </b>
        </div>
        <p class="tel">联系电话：
          <b v-copy="orderStore.orderLogisticsCompany.tel">
            <el-tooltip content="复制联系电话" placement="bottom">
              {{ orderStore.orderLogisticsCompany.tel }}
            </el-tooltip>
          </b>
        </p>
      </div>
      <el-timeline class="shipment" v-show="!logisticsSkeleton">
        <el-timeline-item v-for="item in orderStore.orderLogisticsList" :key="item.id" :timestamp="item.time"
          placement="top">
          {{ item.text }}
        </el-timeline-item>
      </el-timeline>
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

.company {
  display: flex;
  position: relative;

  .name {
    font-size: 14px;
    color: #666,
  }

  .tel {
    position: absolute;
    right: 0;
  }

  b {
    text-decoration: underline;
    cursor: pointer;
  }
}

.shipment {
  max-width: 600px;
  background-color: #fff;
  min-height: 200px;
  margin: 20px 0 0 10px;

  .message {
    margin-left: 10px;
    font-size: 20px;
    color: #444
  }
}
</style>