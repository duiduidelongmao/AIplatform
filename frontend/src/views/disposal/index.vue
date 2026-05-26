<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">资产处置</h1>
        <p class="page-desc">管理资产报废、丢失、变卖等处置流程</p>
      </div>
      <el-button type="primary"><el-icon><Plus /></el-icon>报废申请</el-button>
    </div>
    
    <div class="card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="待审批报废" name="pending" />
        <el-tab-pane label="已处置资产" name="done" />
        <el-tab-pane label="处置记录" name="record" />
      </el-tabs>
      
      <el-table :data="tableData" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="asset_code" label="资产编码" width="160" />
        <el-table-column prop="asset_name" label="资产名称" width="140" />
        <el-table-column prop="store_name" label="所属门店" width="120" />
        <el-table-column prop="original_value" label="原值" width="100">
          <template #default="{ row }">¥{{ row.original_value }}</template>
        </el-table-column>
        <el-table-column prop="net_value" label="净值" width="100">
          <template #default="{ row }">¥{{ row.net_value }}</template>
        </el-table-column>
        <el-table-column label="处置类型" width="100">
          <template #default>
            <el-tag type="danger" size="small">正常报废</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="申请人" width="100" />
        <el-table-column prop="created_at" label="申请时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">查看详情</el-button>
            <el-button link type="success" size="small">审批通过</el-button>
            <el-button link type="danger" size="small">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockAssets } from '@/mock/data'

const activeTab = ref('pending')
const tableData = ref(mockAssets.filter(a => a.status === 5 || a.status === 2).slice(0, 12))
</script>
