<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">采购入库</h1>
        <p class="page-desc">管理采购申请流程，实现采购到入库的全链路</p>
      </div>
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>发起采购</el-button>
    </div>
    
    <div class="card">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="order_no" label="采购单号" width="160" />
        <el-table-column prop="store_name" label="申请门店" width="120" />
        <el-table-column prop="item_count" label="采购数量" width="100" />
        <el-table-column prop="total_amount" label="总金额" width="120">
          <template #default="{ row }">¥{{ row.total_amount }}</template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="status_name" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status_tag" size="small">{{ row.status_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approve_by" label="审批人" width="120" />
        <el-table-column prop="created_at" label="申请时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">查看</el-button>
            <el-button v-if="row.status === 0" link type="primary" size="small">审批</el-button>
            <el-button v-if="row.status === 2" link type="success" size="small">入库</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockPurchaseOrders } from '@/mock/data'
const tableData = ref(mockPurchaseOrders)

const handleAdd = () => {
}
</script>
