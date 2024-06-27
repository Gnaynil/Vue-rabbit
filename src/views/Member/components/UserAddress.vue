<script setup>
import { getAddressAPI, delAddressAPI, addAddressAPI, changeAddressAPI } from '@/apis/address.js'
import { ref, onMounted } from 'vue'
import { ElMessage } from "element-plus";
import { regionData } from 'element-china-area-data'

const addressList = ref([])
const getAddressList = async () => {
    const res = await getAddressAPI()
    addressList.value = res.result.reverse();
    addressList.value.forEach((v => v.default = v.isDefault))
}
onMounted(() => {
    getAddressList()
})
const delAddress = async (id) => {
    await delAddressAPI(id);
    ElMessage.success('删除地址成功')
    getAddressList()
}
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

//表单组件实例
const formRef = ref()
//添加地址
const showAddDialog = ref(false)
const form = ref({
    receiver: '', // 收货人
    contact: '', // 联系方式
    provinceCode: '', // 省份编码(后端参数)
    cityCode: '', // 城市编码(后端参数)
    countyCode: '', // 区/县编码(后端参数)
    address: '', // 详细地址
    isDefault: '0', // 默认地址，1为是，0为否
})
const addAddress = async () => {
    try {
        await formRef.value.validate()
        await addAddressAPI(form.value)
        ElMessage.success('添加成功')
        getAddressList()
        showAddDialog.value = false
    } catch (e) {
        ElMessage.error('请填写完整信息')
    }

}

const regionAddChange = (e) => {
    form.value.provinceCode = e[0] + '0000'
    form.value.cityCode = e[1] + '00'
    form.value.countyCode = e[2]
}

//修改地址
const showChangeDialog = ref(false)
const changeForm = ref()
const changeAddress = (row) => {
    showChangeDialog.value = true
    changeForm.value = row
}
const regionChange = (e) => {
    changeForm.value.provinceCode = e[0] + '0000'
    changeForm.value.cityCode = e[1] + '00'
    changeForm.value.countyCode = e[2]
}
const saveAddress = async () => {
    try {
        await formRef.value.validate()
        await changeAddressAPI(changeForm.value.id, changeForm.value)
        ElMessage.success('修改成功')
        getAddressList()
        showChangeDialog.value = false
    } catch (e) {
        ElMessage.error('请填写完整信息')
    }
}
const setIsDefault = async (row) => {
    row.isDefault = 0
    await changeAddressAPI(row.id, row)
    getAddressList()
    setTimeout(() => {
        ElMessage.success('设置成功')
    }, 500)
}
</script>

<template>
    <div class="header">
        <h3>我的收货地址</h3>
        <div class="right">
            <el-button type="primary" @click="showAddDialog = true">添加地址</el-button>
        </div>
    </div>
    <div class="container">
        <el-table :data="addressList" style="width: 100%;border-radius: 8px;" border
            :header-cell-style="{ background: '#F3F6F8' }">
            <el-table-column prop="receiver" label="收货人" width="120" />
            <el-table-column prop="contact" label="电话" width="120" />
            <el-table-column prop="fullLocation" label="所在地区" width="180" />
            <el-table-column prop="address" label="详细地址" width="180" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button link type="primary" @click="changeAddress(scope.row)">
                        修改
                    </el-button>
                    <el-popconfirm @confirm="delAddress(scope.row.id)" title="确认删除吗?" confirm-button-text="确认"
                        cancel-button-text="取消">
                        <template #reference>
                            <el-button link type="danger">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
            <el-table-column label="默认">
                <template #default="scope">
                    <el-tag type="primary" v-if="scope.row.default === 0" size="small">默认地址</el-tag>
                    <el-button link v-else @click="setIsDefault(scope.row)">设为默认地址</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- 修改地址 -->
    <el-dialog title="修改收货地址" width="40%" center v-model="showChangeDialog">
        <div class="addressWrapper">
            <el-form :model="changeForm" :rules="rules" ref="formRef" label-width="auto" style="max-width: 600px">
                <el-form-item label="收货人" prop="receiver">
                    <el-input v-model="changeForm.receiver" />
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="changeForm.contact" />
                </el-form-item>
                <el-form-item label="所在地区" prop="countyCode">
                    <el-cascader size="large" v-model="changeForm.countyCode" :options="regionData"
                        @change="regionChange" placeholder="请选择省/市/区(县)" />
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="changeForm.address" type="textarea" />
                </el-form-item>
                <el-form-item label="设为默认地址" prop="isDefault">
                    <el-switch v-model="changeForm.isDefault" :active-value="0" :inactive-value="1" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showChangeDialog = false">取消</el-button>
                <el-button type="primary" @click="saveAddress">确定</el-button>
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
                    <el-cascader size="large" v-model="form.countyCode" :options="regionData" @change="regionAddChange"
                        placeholder="请选择省/市/区(县)" />
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="form.address" type="textarea" />
                </el-form-item>
                <el-form-item label="设为默认地址">
                    <el-switch v-model="form.isDefault" :active-value="0" :inactive-value="1" />
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
.header {
    margin: 20px;
    position: relative;

    .right {
        position: absolute;
        right: 10px;
        top: 0
    }
}

.container {
    padding: 20px 50px;
    width: 100%;

    .cell-class {
        background-color: #480808;
    }
}
</style>