<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">资产档案</h1>
        <p class="page-desc">管理所有门店资产，建立统一电子台账</p>
      </div>
      <div>
        <el-button @click="showImport = true"><el-icon><Upload /></el-icon>批量导入</el-button>
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增资产</el-button>
      </div>
    </div>
    
    <div class="card">
      <el-form :model="filterForm" inline class="mb-24">
        <el-form-item label="门店">
          <el-select v-model="filterForm.storeId" placeholder="全部门店" clearable style="width: 150px">
            <el-option v-for="store in stores" :key="store.id" :label="store.name" :value="store.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filterForm.categoryId" placeholder="全部分类" clearable style="width: 150px">
            <el-option-group v-for="cat in categories" :key="cat.id" :label="cat.name">
              <el-option v-for="child in cat.children" :key="child.id" :label="child.name" :value="child.id" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="在库" :value="1" />
            <el-option label="在用" :value="2" />
            <el-option label="维修中" :value="3" />
            <el-option label="调拨中" :value="4" />
            <el-option label="报废" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="filterForm.keyword" placeholder="资产名称/编码" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="asset_code" label="资产编码" width="160" />
        <el-table-column prop="asset_name" label="资产名称" width="140" />
        <el-table-column prop="category_name" label="分类" width="100" />
        <el-table-column prop="store_name" label="所属门店" width="120" />
        <el-table-column prop="status_name" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status_tag" size="small">{{ row.status_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="使用人" width="100" />
        <el-table-column prop="original_value" label="原值" width="100">
          <template #default="{ row }">¥{{ row.original_value }}</template>
        </el-table-column>
        <el-table-column prop="purchase_date" label="采购日期" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row: _row }">
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="primary" size="small">打印二维码</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="flex-center" style="margin-top: 24px">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
    
    <el-dialog v-model="dialogVisible" title="新增资产" width="700px">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资产名称" required>
              <el-input v-model="form.asset_name" placeholder="请输入资产名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产分类" required>
              <el-select v-model="form.category_id" placeholder="请选择分类" style="width: 100%">
                <el-option-group v-for="cat in categories" :key="cat.id" :label="cat.name">
                  <el-option v-for="child in cat.children" :key="child.id" :label="child.name" :value="child.id" />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌">
              <el-input v-model="form.brand" placeholder="请输入品牌" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号">
              <el-input v-model="form.model" placeholder="请输入型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属门店" required>
              <el-select v-model="form.store_id" placeholder="请选择门店" style="width: 100%">
                <el-option v-for="store in stores" :key="store.id" :label="store.name" :value="store.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="存放位置">
              <el-input v-model="form.location_area" placeholder="请输入位置" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购日期" required>
              <el-date-picker v-model="form.purchase_date" type="date" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原值" required>
              <el-input v-model="form.original_value" type="number" placeholder="请输入原值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="折旧年限">
              <el-input v-model="form.depreciation_years" type="number" placeholder="默认5年" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质保截止">
              <el-date-picker v-model="form.warranty_expire_date" type="date" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    
    <el-dialog v-model="showImport" title="批量导入资产" width="500px">
      <div style="text-align: center; padding: 40px 0">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          accept=".xlsx,.xls"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 xlsx/xls 文件，且不超过 10MB
            </div>
          </template>
        </el-upload>
        <div style="margin-top: 20px">
          <el-button link>下载导入模板</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="showImport = false">取消</el-button>
        <el-button type="primary">开始导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { mockAssets, mockStores, mockCategories } from '@/mock/data'

const dialogVisible = ref(false)
const showImport = ref(false)

const stores = mockStores
const categories = mockCategories

const filterForm = reactive({
  storeId: undefined as number | undefined,
  categoryId: undefined as number | undefined,
  status: undefined as number | undefined,
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: mockAssets.length
})

const tableData = ref(mockAssets.slice(0, 20))

const form = reactive({
  asset_name: '',
  category_id: undefined as number | undefined,
  brand: '',
  model: '',
  store_id: undefined as number | undefined,
  location_area: '',
  purchase_date: '',
  original_value: '',
  depreciation_years: 5,
  warranty_expire_date: '',
  remark: ''
})

const handleSearch = () => {
  ElMessage.success('查询条件已应用')
}

const handleReset = () => {
  filterForm.storeId = undefined
  filterForm.categoryId = undefined
  filterForm.status = undefined
  filterForm.keyword = ''
  tableData.value = mockAssets.slice(0, 20)
}

const handleAdd = () => {
  dialogVisible.value = true
}

const handleSubmit = () => {
  ElMessage.success('资产创建成功')
  dialogVisible.value = false
}
</script>
