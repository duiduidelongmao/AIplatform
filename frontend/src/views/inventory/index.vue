<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">盘点管理</h1>
        <p class="page-desc">创建盘点任务，跟踪盘点进度</p>
      </div>
      <el-button type="primary"><el-icon><Plus /></el-icon>创建盘点任务</el-button>
    </div>
    
    <div class="card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="task_name" label="盘点任务" width="200" />
        <el-table-column prop="store_name" label="盘点门店" width="120" />
        <el-table-column prop="total_count" label="应盘数量" width="100" align="center" />
        <el-table-column prop="checked_count" label="已盘数量" width="100" align="center" />
        <el-table-column label="完成进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="Math.round((row.checked_count / row.total_count) * 100)" :stroke-width="12" />
          </template>
        </el-table-column>
        <el-table-column prop="diff_count" label="差异数" width="80" align="center">
          <template #default="{ row }">
            <span v-if="row.diff_count > 0" style="color: var(--danger-color)">{{ row.diff_count }}</span>
            <span v-else>{{ row.diff_count }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status_name" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status_tag" size="small">{{ row.status_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="负责人" width="100" />
        <el-table-column prop="start_date" label="开始日期" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row: _row }">
            <el-button link type="primary" size="small">进入盘点</el-button>
            <el-button link type="info" size="small">查看差异</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockInventoryTasks } from '@/mock/data'
const tableData = ref(mockInventoryTasks)
</script>
