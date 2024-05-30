<script setup>
import { onMounted } from "vue";
import getPowerSet from "./power-set";
const props = defineProps({
  goods: {
    type: Object,
    default: () => {},
  },
});
//需要在setup函数里定义defineEmits才能正常使用 不能在函数内定义defineEmits
const emits = defineEmits(["change"]);
let pathMap = {};
//点击时实时更新sku
const changeSelectedStatus = (item, val) => {
  if (val.disabled) return;
  if (val.selected) {
    val.selected = false;
  } else {
    item.values.forEach((valItem) => (valItem.selected = false));
    val.selected = true;
  }
  updateDisabledState(props.goods.specs, pathMap);
  //产出SKU对象数据

  const index = getSelectedValues(props.goods.specs).findIndex(
    (item) => item === undefined
  );
  // console.log(index);
  if (index > -1) {
    // console.log("找到了,信息不完整");
  } else {
    // console.log("没有找到,信息完整,可以产出");
    //获取SKU对象
    const key = getSelectedValues(props.goods.specs).join("-");
    const skuIds = pathMap[key];
    //以skuId作为匹配项求props.goods.skus数组里去找
    const skuObj = props.goods.skus.find((item) => {
      return item.id === skuIds[0];
    });
    

    emits("change", skuObj);

  }
};
const getPathMap = (goods) => {
  const pathMap = {};
  //1.生成有效sku数组
  const effectiveSkus = goods.skus.filter((sku) => sku.inventory > 0);
  //2.使用powerSet得到所以子集 [1,2] => [[1], [2], [1,2]]
  effectiveSkus.forEach((sku) => {
    //2.1获取可选的规格数组
    const selectedValArr = sku.specs.map((val) => val.valueName);
    //2.2获取可选数组的子集
    const valueArrPowerSet = getPowerSet(selectedValArr);
    //3.根据子集生成路径字典对象
    //3.1遍历子集 往pathMap中插入数据
    valueArrPowerSet.forEach((arr) => {
      const key = arr.join("-");
      //给pathMap设置数据
      if (pathMap[key]) {
        pathMap[key].push(sku.id);
      } else {
        pathMap[key] = [sku.id];
      }
    });
  });
  return pathMap;
};
//1.定义初始化函数
const initDisabledState = (specs, pathMap) => {
  specs.forEach((item) => {
    item.values.forEach((val) => {
      if (pathMap[val.name]) {
        val.disabled = false;
      } else {
        val.disabled = true;
      }
    });
  });
};

// 获取选中匹配数组 ['黑色',undefined,undefined]
const getSelectedValues = (specs) => {
  const arr = [];
  specs.forEach((spec) => {
    const selectedVal = spec.values.find((value) => value.selected);
    arr.push(selectedVal ? selectedVal.name : undefined);
  });

  return arr;
};

const updateDisabledState = (specs, pathMap) => {
  // 约定：每一个按钮的状态由自身的disabled进行控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs);
    item.values.forEach((val) => {
      if (val.selected) return;
      const _seletedValues = [...selectedValues];
      _seletedValues[i] = val.name;
      const key = _seletedValues.filter((value) => value).join("-");
      // 路径字典中查找是否有数据 有-可以点击 没有-禁用
      if (pathMap[key]) {
        val.disabled = false;
      } else {
        val.disabled = true;
      }
    });
  });
};

onMounted(() => {
  pathMap = getPathMap(props.goods);
  // console.log(pathMap);
  initDisabledState(props.goods.specs, pathMap);
});
</script>

<template>
  <div class="goods-sku">
    <dl
      v-for="item in goods.specs"
      :key="item.id"
    >
      <dt>{{ item.name }}</dt>
      <dd>
        <template
          v-for="val in item.values"
          :key="val.name"
        >
          <!-- 图片类型规格 -->
          <img
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            :class="{selected: val.selected, disabled: val.disabled}"
            @click="$event => changeSelectedStatus(item,val)"
          >
          <!-- 文字类型规格 -->
          <span
            v-else
            :class="{selected:val.selected, disabled: val.disabled}"
            @click="$event => changeSelectedStatus(item,val)"
          >{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<style scoped lang="scss">
@mixin sku-state-mixin {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: #27ba9b;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      > img {
        width: 50px;
        height: 50px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }

      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }
    }
  }
}
</style>