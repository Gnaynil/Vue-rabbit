<script setup>
import { getCheckoutInfoAPI, createOrderAPI } from "@/apis/checkout";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart.js";
import { addAddressAPI } from '@/apis/address.js'
//获取地区级联
import { regionData, codeToText } from 'element-china-area-data'
import { ElMessage } from "element-plus";
const cartStore = useCartStore();

const router = useRouter()
const checkInfo = ref({}); // 订单对象
const curAddress = ref({}); // 地址对象
const getCheckInfo = async () => {
  const res = await getCheckoutInfoAPI();
  checkInfo.value = res.result;
  //适配默认地址
  // 从默认地址中筛选出来 isDefault ===0那一项
  const item = checkInfo.value.userAddresses.find(
    (item) => item.isDefault === 0
  );
  curAddress.value = item;
};
onMounted(() => getCheckInfo());
//表单规则
const rules = {
  receiver: {
    required: true, message: '请输入收货人姓名'
  },
  contact: [
    { required: true, message: '请输入联系方式' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
  countyCode: [{ required: true, message: '请选择所在地区' }],
  address: [{ required: true, message: '请输入详细地址' }],
}

//控制弹框打开
const showSwitchDialog = ref(false);
//切换地址
const activeAddress = ref([]);
const switchAddress = (item) => {
  activeAddress.value = item;
};
const confirm = () => {
  curAddress.value = activeAddress.value;
  showSwitchDialog.value = false;
};
//添加地址
const showAddDialog = ref(false)
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})
//表单组件实例
const formRef = ref()
const addAddress = async () => {
  try {
    await formRef.value.validate()
    await addAddressAPI(form.value)
    ElMessage.success('添加成功')
    showAddDialog.value = false
    getCheckInfo()
  } catch (e) {
    ElMessage.error('请填写完整信息')
  }

}
const regionChange = (e) => {
  e.forEach((v) => {
    form.value.fullLocation += codeToText[v] + ' '
  })
  form.value.provinceCode = e[0] + '0000'
  form.value.cityCode = e[1] + '00'
  form.value.countyCode = e[2]
}

//提交订单
const creteOrder = async () => {
  const res = await createOrderAPI({
    deliveryTimeType: activeDelivery.value,
    payType: activePay.value,
    payChannel: 1,
    buyerMessage: "",
    goods: checkInfo.value.goods.map((item) => {
      return {
        skuId: item.skuId,
        count: item.count,
      };
    }),
    addressId: curAddress.value.id,
  });
  const orderId = res.result.id
  if (activePay.value === 2) {
    console.log('货到付款');
    ElMessage.success('订单提交成功')
    setTimeout(() => {
      router.push('/member/order')
    }, 1000)
  }
  else {
    router.push({
      path: '/pay',
      query: {
        id: orderId
      }
    })
  }
  //更新购物车
  cartStore.updateNewList()
};
const activeDelivery = ref(1)
const deliveryList = [
  { active: 1, name: '不限送货时间：周一至周日' },
  { active: 2, name: '工作日送货：周一至周五' },
  { active: 3, name: '双休日、假日送货：周六至周日' },
]
const activePay = ref(1)

const PayTypeList = [
  { active: 1, name: '在线支付' },
  { active: 2, name: '货到付款' },
]
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="showSwitchDialog = true">切换地址</el-button>
              <el-button size="large" @click="showAddDialog = true">添加地址</el-button>
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
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a :href="`/detail/${i.id}`" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.count }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body box-content">
          <a class="my-btn" v-for="(item, index) in deliveryList" :key="deliveryList[index].active"
            :class="{ active: activeDelivery === deliveryList[index].active }" @click="() => {
              activeDelivery = deliveryList[index].active
            }">{{ item.name }}</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body box-content">
          <a class="my-btn" v-for="(item, index) in PayTypeList" :key="PayTypeList[index].active"
            :class="{ active: activePay === PayTypeList[index].active }" @click="() => {
              activePay = PayTypeList[index].active
            }">{{ item.name }}</a>
          <span style="color:#999;height: 45px;line-height: 45px;">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button type="primary" size="large" @click="creteOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog title="切换收货地址" width="40%" center v-model="showSwitchDialog">
    <div class="addressWrapper">
      <div class="text item " :class="{ active: activeAddress.id === item.id }" @click="switchAddress(item)"
        v-for="item in checkInfo.userAddresses" :key="item.id">
        <ul>
          <li><span>收<i />货<i />人：</span>{{ item.receiver }} </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
        </ul>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="() => showSwitchDialog = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 添加地址 -->
  <el-dialog title="添加收货地址" width="40%" center v-model="showAddDialog">
    <div class="addressWrapper">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" style="max-width: 600px">
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="form.receiver" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" />
        </el-form-item>
        <el-form-item label="所在地区" prop="countyCode">
          <el-cascader size="large" v-model="form.countyCode" :options="regionData" @change="regionChange"
            placeholder="请选择省/市/区(县)" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" type="textarea" />
        </el-form-item>
        <el-form-item label="设为默认地址">
          <el-switch v-model="form.isDefault" active-value="0" inactive-value="1" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addAddress">确定</el-button>
      </span>
    </template>
  </el-dialog>
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