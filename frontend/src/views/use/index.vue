<template>
  <div>
    <div class="page-header flex-between">
      <div>
        <h1 class="page-title">领用管理</h1>
        <p class="page-desc">管理资产领用、退还、调拨流程</p>
      </div>
      <el-button type="primary"><el-icon><Plus /></el-icon>发起领用</el-button>
    </div>
    
    <div class="card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="领用待审批" name="pending" />
        <el-tab-pane label="我的领用" name="my" />
        <el-tab-pane label="调拨记录" name="transfer" />
      </el-tabs>
      
      <el-table :data="tableData" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="asset_code" label="资产编码" width="160" />
        <el-table-column prop="asset_name" label="资产名称" width="140" />
        <el-table-column prop="store_name" label="所属门店" width="120" />
        <el-table-column prop="user_name" label="领用人" width="100" />
        <el-table-column label="状态" width="100">
          <template #default>
            <el-tag type="warning" size="small">待审批</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="领用时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
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
const tableData = ref(mockAssets.filter(a => a.status === 1).slice(0, 15))
</script>
