<template>
  <div class="model-center">
    <div class="page-header">
      <h1 class="page-title">模型中心</h1>
    </div>

    <!-- 筛选区域 -->
    <div class="card filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="模型分类">
          <el-select v-model="filterForm.categoryId" placeholder="全部" clearable style="width: 160px">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="模型名称">
          <el-input v-model="filterForm.name" placeholder="请输入模型名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="模型状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="正常" />
            <el-option label="空闲" value="空闲" />
            <el-option label="异常" value="异常" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
            :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 模型卡片区域 -->
    <div class="model-cards" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="6" v-for="model in paginatedModels" :key="model.id" class="card-col">
          <div class="model-card" @click="goToDetail(model.id)">
            <div class="card-header">
              <span class="model-name">{{ model.name }}</span>
            </div>
            <div class="card-category">{{ model.category }}</div>
            <div class="card-footer">
              <span class="model-status" :class="statusClass(model.status)">{{ model.status }}</span>
              <span class="model-invocations">调用量: {{ formatNumber(model.invocations) }}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 空状态 -->
      <el-empty v-if="filteredModels.length === 0" description="暂无匹配的模型" />
    </div>

    <!-- 分页 -->
    <div class="pagination-wrap" v-if="filteredModels.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 80, 0]"
        :total="filteredModels.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      >
        <template #sizes>
          <el-select v-model="pageSize" style="width: 110px">
            <el-option :label="'20条/页'" :value="20" />
            <el-option :label="'80条/页'" :value="80" />
            <el-option label="全部" :value="0" />
          </el-select>
        </template>
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { mockModels, mockModelCategories, type ModelInfo, type ModelStatus } from '@/mock/model-data'

const router = useRouter()
const loading = ref(false)

const categories = mockModelCategories

// 筛选条件
const filterForm = ref({
  categoryId: '' as string | number,
  name: '',
  status: '' as string,
  dateRange: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] as any
})

const defaultTime: any = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59)
]

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 筛选后的模型列表
const filteredModels = computed(() => {
  let list: ModelInfo[] = [...mockModels]
  
  if (filterForm.value.categoryId) {
    list = list.filter(m => m.categoryId === Number(filterForm.value.categoryId))
  }
  if (filterForm.value.name) {
    list = list.filter(m => m.name.includes(filterForm.value.name))
  }
  if (filterForm.value.status) {
    list = list.filter(m => m.status === filterForm.value.status)
  }

  return list
})

// 当前页的模型
const paginatedModels = computed(() => {
  if (pageSize.value === 0) return filteredModels.value
  const start = (currentPage.value - 1) * pageSize.value
  return filteredModels.value.slice(start, start + pageSize.value)
})

const statusClass = (status: ModelStatus) => {
  return {
    'status-normal': status === '正常',
    'status-idle': status === '空闲',
    'status-error': status === '异常'
  }
}

const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  filterForm.value = {
    categoryId: '',
    name: '',
    status: '',
    dateRange: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] as any
  }
  currentPage.value = 1
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const goToDetail = (id: number) => {
  router.push(`/model-detail/${id}`)
}
</script>

<style lang="scss" scoped>
.model-center {
  min-height: 100%;
}

.filter-card {
  margin-bottom: 20px;
  
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.model-cards {
  min-height: 200px;
}

.card-col {
  margin-bottom: 20px;
}

.model-card {
  background: var(--bg-color);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
    transform: translateY(-2px);
  }
}

.card-header {
  .model-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.card-category {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.model-status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  &.status-normal {
    background: #f0f9eb;
    color: #67c23a;
  }

  &.status-idle {
    background: #fdf6ec;
    color: #e6a23c;
  }

  &.status-error {
    background: #fef0f0;
    color: #f56c6c;
  }
}

.model-invocations {
  font-size: 12px;
  color: var(--text-tertiary);
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px 0;
}
</style>
