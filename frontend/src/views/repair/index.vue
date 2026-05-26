<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">维修保养</h1>
        <p class="page-desc">管理设备报修、维修、保养全流程</p>
      </div>
      <el-button type="primary" @click="handleRepair"><el-icon><Plus /></el-icon>发起报修</el-button>
    </div>
    
    <div class="card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="repair_no" label="报修单号" width="160" />
        <el-table-column prop="asset_name" label="故障设备" width="120" />
        <el-table-column prop="store_name" label="所属门店" width="120" />
        <el-table-column prop="fault_type" label="故障类型" width="100" />
        <el-table-column prop="description" label="问题描述" width="150" show-overflow-tooltip />
        <el-table-column prop="reporter" label="报修人" width="100" />
        <el-table-column prop="status_name" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status_tag" size="small">{{ row.status_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="repairer" label="维修人员" width="100" />
        <el-table-column prop="cost_amount" label="费用" width="100">
          <template #default="{ row }">{{ row.cost_amount ? '¥' + row.cost_amount : '-' }}</template>
        </el-table-column>
        <el-table-column prop="created_at" label="报修时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">查看</el-button>
            <el-button v-if="row.status === 0" link type="success" size="small">派单</el-button>
            <el-button v-if="row.status === 2" link type="warning" size="small">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { mockRepairOrders } from '@/mock/data'

const tableData = ref(mockRepairOrders)

const handleRepair = () => {
  ElMessage.info('发起报修功能开发中')
}
</script>
