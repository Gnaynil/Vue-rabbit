<script setup>
import { useCartStore } from "@/stores/cart.js";
import { useUserStore } from "@/stores/user.js";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
import { computed, onMounted,ref } from 'vue'
const cartStore = useCartStore();
const userStore = useUserStore();
const isLogin = computed(() => userStore.userInfo.token)
const router = useRouter()
const singleCheck = (i, selected) => {
  console.log(i.name, selected);  //通过skuId找到要修改的那一项,然后把它的selected修改为传过来的selected
  cartStore.singleCheck(i.skuId, selected);
};
const allCheck = (selected) => {
  cartStore.allCheck(selected);
};
const show = ref(false)
//下单结算
const onCheckOut = async () => {
  //判断登录状态
  if (isLogin.value) {
    await cartStore.changeCart()
    show.value = false
    setTimeout(() => {
      router.push('/checkout')
    }, 1500)
  }
  else {
    ElMessage.error('请先登录')
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
}
//数量发生了改变
const countChange = (i) => {
  i.change = true
}
onMounted(() => {
  show.value = false
  cartStore.updateNewList()
  show.value = true
})
</script>

<template>
  <div class="xtx-cart-page" v-show="show">
    <div class="container m-top-20">
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <el-checkbox :modelValue="cartStore.isAll" @change="allCheck" v-show="cartStore.cartList.length !== 0"/>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 商品列表 -->
          <tbody>
            <tr v-for="i in cartStore.cartList" :key="i.id">
              <td>
                <!-- 单选框 -->
                <el-checkbox :modelValue="i.selected" @change="(selected) => singleCheck(i, selected)" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/detail/${i.id}`"><img :src="i.picture" alt="" /></RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ i.name }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ i.price }}</p>
              </td>
              <td class="tc">
                <el-input-number v-model="i.count" @change="countChange(i)" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ (i.price * i.count).toFixed(2) }}</p>
              </td>
              <td class="tc">
                <p>
                  <el-popconfirm title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="cartStore.delCart(i.skuId)">
                    <template #reference>
                      <a href="javascript:;">删除</a>
                    </template>
                  </el-popconfirm>
                </p>
              </td>
            </tr>
            <tr v-if="cartStore.cartList.length === 0">
              <td colspan="6">
                <div class="cart-none">
                  <el-empty description="购物车列表为空">
                    <el-button type="primary" @click="$router.push('/')">随便逛逛</el-button>
                  </el-empty>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action" v-show="cartStore.cartList.length !== 0">
        <div class="batch">
          共 {{ cartStore.selectedCount }} 件商品，已选择 {{ cartStore.selectedCount }} 件，商品合计：
          <span class="red">¥ {{ cartStore.selectedPrice.toFixed(2) }} </span>
        </div>
        <div class="total">
          <el-button size="large" type="primary" @click="onCheckOut" >下单结算</el-button>
        </div>
      </div>
    </div>
  </div>
  <XtxLoading v-show="!show" />
</template>

<style scoped lang="scss">
.xtx-cart-page {
  margin-top: 20px;

  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }

  .cart-none {
    text-align: center;
    padding: 120px 0;
    background: #fff;

    p {
      color: #999;
      padding: 20px 0;
    }
  }

  .tc {
    text-align: center;

    a {
      color: $xtxColor;
    }

    .xtx-numbox {
      margin: 0 auto;
      width: 120px;
    }
  }

  .red {
    color: $priceColor;
  }

  .green {
    color: $xtxColor;
  }

  .f16 {
    font-size: 16px;
  }

  .goods {
    display: flex;
    align-items: center;

    img {
      width: 100px;
      height: 100px;
    }

    >div {
      width: 280px;
      font-size: 16px;
      padding-left: 10px;

      .attr {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;

    .xtx-checkbox {
      color: #999;
    }

    .batch {
      a {
        margin-left: 20px;
      }
    }

    .red {
      font-size: 18px;
      margin-right: 20px;
      font-weight: bold;
    }
  }

  .tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
  }
}
</style>