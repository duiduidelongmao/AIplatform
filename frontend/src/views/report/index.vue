<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">报表分析</h1>
      <p class="page-desc">多维度资产数据分析报表</p>
    </div>
    
    <el-row :gutter="20" class="mb-24">
      <el-col :span="8">
        <div class="card">
          <h3 style="margin-bottom: 20px; font-size: 16px">资产分类统计</h3>
          <div class="chart-placeholder">
            <el-icon size="48" style="color: var(--text-tertiary)"><PieChart /></el-icon>
            <p style="color: var(--text-secondary); margin-top: 12px">饼图 - 分类占比统计</p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <h3 style="margin-bottom: 20px; font-size: 16px">月度新增趋势</h3>
          <div class="chart-placeholder">
            <el-icon size="48" style="color: var(--text-tertiary)"><TrendCharts /></el-icon>
            <p style="color: var(--text-secondary); margin-top: 12px">折线图 - 资产增长趋势</p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <h3 style="margin-bottom: 20px; font-size: 16px">门店资产对比</h3>
          <div class="chart-placeholder">
            <el-icon size="48" style="color: var(--text-tertiary)"><Histogram /></el-icon>
            <p style="color: var(--text-secondary); margin-top: 12px">柱状图 - 各门店资产分布</p>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <div class="card">
      <h3 style="margin-bottom: 20px; font-size: 16px">门店资产明细报表</h3>
      <el-table :data="summaryData" border style="width: 100%">
        <el-table-column prop="store" label="门店" width="140" />
        <el-table-column prop="total" label="资产总数" width="100" align="center" />
        <el-table-column prop="inUse" label="在用" width="100" align="center" />
        <el-table-column prop="inStock" label="在库" width="100" align="center" />
        <el-table-column prop="repairing" label="维修中" width="100" align="center" />
        <el-table-column prop="scrap" label="已报废" width="100" align="center" />
        <el-table-column prop="totalValue" label="资产总值" width="120" align="right">
          <template #default="{ row }">¥{{ row.totalValue.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default>
            <el-button link type="primary" size="small">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mockStores } from '@/mock/data'

const summaryData = mockStores.map(store => ({
  store: store.name,
  total: 12 + Math.floor(Math.random() * 8),
  inUse: 5 + Math.floor(Math.random() * 5),
  inStock: 4 + Math.floor(Math.random() * 3),
  repairing: 1 + Math.floor(Math.random() * 3),
  scrap: Math.floor(Math.random() * 2),
  totalValue: Math.round((50000 + Math.random() * 80000) * 100) / 100
}))
</script>

<style lang="scss" scoped>
.chart-placeholder {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
}
</style>
