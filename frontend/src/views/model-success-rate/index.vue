<template>
  <div class="success-rate-page">
    <!-- 面包屑 -->
    <div class="breadcrumb-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <a href="javascript:;" @click="goToModelCenter">模型中心</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="javascript:;" @click="goToDetail">{{ model?.name }}</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>成功率详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <template v-if="model">
      <h2 class="page-title">{{ model.name }} - 成功率详情</h2>

      <!-- 时间筛选 -->
      <div class="card filter-card">
        <el-form :model="queryForm" inline>
          <el-form-item label="日期">
            <el-date-picker
              v-model="queryForm.date"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="时间段">
            <el-time-picker
              v-model="queryForm.startTime"
              placeholder="开始时间"
              format="HH:mm"
              value-format="HH:mm"
              :disabled-minutes="disabledMinutes"
              style="width: 120px"
            />
            <span style="margin: 0 8px">-</span>
            <el-time-picker
              v-model="queryForm.endTime"
              placeholder="结束时间"
              format="HH:mm"
              value-format="HH:mm"
              :disabled-minutes="disabledMinutes"
              style="width: 120px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格 -->
      <div class="card table-card">
        <el-table :data="paginatedRecords" stripe style="width: 100%" :header-cell-style="{ background: '#f5f7fa' }">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="time" label="时间" min-width="180" />
          <el-table-column prop="invocations" label="调用次数" min-width="140" align="right">
            <template #default="{ row }">
              {{ row.invocations.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="errorCount" label="异常次数" min-width="140" align="right">
            <template #default="{ row }">
              {{ row.errorCount.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="successRate" label="成功率" min-width="120" align="center">
            <template #default="{ row }">
              <span :class="{ 'rate-error': row.status === '异常' && row.successRate !== '-' }">
                {{ row.successRate }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="120" align="center">
            <template #default="{ row }">
              <span class="status-tag" :class="'tag-' + getStatusType(row.status)">{{ row.status }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrap">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 50, 100]"
            :total="filteredRecords.length"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
    </template>

    <el-empty v-else description="模型不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { mockModels, generateSuccessRateRecords, type ModelStatus } from '@/mock/model-data'

const route = useRoute()
const router = useRouter()

const modelId = computed(() => Number(route.params.id))
const model = computed(() => mockModels.find(m => m.id === modelId.value))

const today = dayjs().format('YYYY-MM-DD')

// 查询条件
const queryForm = ref({
  date: today as string,
  startTime: '00:00' as string,
  endTime: '23:50' as string
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 时间禁用：只允许10分钟间隔
const disabledMinutes = () => {
  const allowed = [0, 10, 20, 30, 40, 50]
  return Array.from({ length: 60 }, (_, i) => i).filter(i => !allowed.includes(i))
}

// 全部记录
const allRecords = computed(() => {
  const date = queryForm.value.date || today
  return generateSuccessRateRecords(date)
})

// 筛选后的记录
const filteredRecords = computed(() => {
  let records = allRecords.value

  if (queryForm.value.startTime && queryForm.value.endTime) {
    const startMin = parseTimeToMinutes(queryForm.value.startTime)
    const endMin = parseTimeToMinutes(queryForm.value.endTime)
    records = records.filter(r => {
      const timeStart = r.time.split(' - ')[0]
      const rMin = parseTimeToMinutes(timeStart)
      return rMin >= startMin && rMin <= endMin
    })
  }

  return records
})

// 分页后的记录
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRecords.value.slice(start, start + pageSize.value)
})

const parseTimeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

const getStatusType = (status: ModelStatus) => {
  if (status === '正常') return 'normal'
  if (status === '空闲') return 'idle'
  return 'error'
}

const handleQuery = () => {
  currentPage.value = 1
}

const handleReset = () => {
  queryForm.value.date = today
  queryForm.value.startTime = '00:00'
  queryForm.value.endTime = '23:50'
  currentPage.value = 1
}

const goToModelCenter = () => {
  router.push('/model-center')
}

const goToDetail = () => {
  router.push(`/model-detail/${modelId.value}`)
}
</script>

<style lang="scss" scoped>
.success-rate-page {
  min-height: 100%;
}

.breadcrumb-bar {
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.filter-card {
  margin-bottom: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.rate-error {
  color: #f56c6c;
  font-weight: 600;
}

.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  &.tag-normal {
    background: #f0f9eb;
    color: #67c23a;
  }
  &.tag-idle {
    background: #fdf6ec;
    color: #e6a23c;
  }
  &.tag-error {
    background: #fef0f0;
    color: #f56c6c;
  }
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 8px 0;
}
</style>
