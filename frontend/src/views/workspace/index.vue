<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">工作台</h1>
      <p class="page-desc">欢迎回来，这是您的门店资产概览</p>
    </div>
    
    <el-row :gutter="20" class="mb-24">
      <el-col :span="6">
        <div class="card stat-card">
          <div class="stat-icon total">
            <el-icon size="28"><Box /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalAssets }}</div>
            <div class="stat-label">资产总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card stat-card">
          <div class="stat-icon using">
            <el-icon size="28"><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.inUseAssets }}</div>
            <div class="stat-label">在用资产</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card stat-card">
          <div class="stat-icon repairing">
            <el-icon size="28"><Tools /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.repairingAssets }}</div>
            <div class="stat-label">维修中</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card stat-card">
          <div class="stat-icon value">
            <el-icon size="28"><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">¥{{ stats.totalValue.toLocaleString() }}</div>
            <div class="stat-label">资产总值</div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="card">
          <div class="flex-between mb-16">
            <h3 style="font-size: 16px; font-weight: 600">待办事项</h3>
          </div>
          <el-timeline>
            <el-timeline-item timestamp="今天 09:30" placement="top" type="warning">
              <h4>待审批采购申请</h4>
              <p>上海浦东店采购冷柜申请，金额 12,500 元，待您审批</p>
            </el-timeline-item>
            <el-timeline-item timestamp="今天 10:15" placement="top" type="danger">
              <h4>报修待处理</h4>
              <p>北京朝阳店收银机故障，报修 2 小时未处理</p>
            </el-timeline-item>
            <el-timeline-item timestamp="昨天 16:45" placement="top" type="info">
              <h4>盘点任务待完成</h4>
              <p>Q2 盘点任务还有 3 家门店未完成，请督促店长</p>
            </el-timeline-item>
            <el-timeline-item timestamp="昨天 14:20" placement="top" type="primary">
              <h4>新资产入库</h4>
              <p>深圳南山店新采购的 15 件货架已完成入库</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
      
      <el-col :span="10">
        <div class="card mb-24">
          <div class="flex-between mb-16">
            <h3 style="font-size: 16px; font-weight: 600">快捷入口</h3>
          </div>
          <el-row :gutter="12">
            <el-col :span="12" class="mb-12">
              <el-button class="quick-btn" @click="$router.push('/asset')">
                <el-icon size="20"><DocumentAdd /></el-icon>
                <span>新增资产</span>
              </el-button>
            </el-col>
            <el-col :span="12" class="mb-12">
              <el-button class="quick-btn" @click="$router.push('/purchase')">
                <el-icon size="20"><ShoppingCart /></el-icon>
                <span>采购申请</span>
              </el-button>
            </el-col>
            <el-col :span="12" class="mb-12">
              <el-button class="quick-btn" @click="$router.push('/repair')">
                <el-icon size="20"><Service /></el-icon>
                <span>设备报修</span>
              </el-button>
            </el-col>
            <el-col :span="12" class="mb-12">
              <el-button class="quick-btn" @click="$router.push('/inventory')">
                <el-icon size="20"><CircleCheck /></el-icon>
                <span>发起盘点</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <div class="card">
          <div class="flex-between mb-16">
            <h3 style="font-size: 16px; font-weight: 600">本月数据</h3>
          </div>
          <div class="month-data">
            <div class="data-item">
              <span class="label">本月新增资产</span>
              <span class="value highlight">{{ stats.monthNewAssets }} 件</span>
            </div>
            <div class="data-item">
              <span class="label">本月维修单</span>
              <span class="value">{{ stats.monthRepairs }} 单</span>
            </div>
            <div class="data-item">
              <span class="label">盘点完成率</span>
              <span class="value highlight">{{ stats.completionRate }}%</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { dashboardStats } from '@/mock/data'

const stats = dashboardStats
</script>

<style lang="scss" scoped>
.stat-card {
  display: flex;
  align-items: center;
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    
    &.total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    &.using {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }
    
    &.repairing {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }
    
    &.value {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
    }
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
  }
  
  .stat-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
  }
}

.quick-btn {
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}

.month-data {
  .data-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: var(--text-secondary);
    }
    
    .value {
      font-weight: 600;
      
      &.highlight {
        color: var(--primary-color);
      }
    }
  }
}
</style>
