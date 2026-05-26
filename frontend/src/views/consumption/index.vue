<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">消费记录</h1>
      <p class="page-desc">查看多模态 AI 模型的消费明细与统计</p>
    </div>

    <!-- 时间筛选 -->
    <div class="time-filter-bar mb-24">
      <el-radio-group v-model="timeRange" size="default">
        <el-radio-button label="1h">近1小时</el-radio-button>
        <el-radio-button label="1d">近1天</el-radio-button>
        <el-radio-button label="1m">近1月</el-radio-button>
        <el-radio-button label="1y">近1年</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-24">
      <el-col :span="6">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">总花费</span>
            <el-icon class="chart-info" size="14" color="#909399"><InfoFilled /></el-icon>
          </div>
          <div class="bar-chart stacked-bar">
            <div class="bar-segment" style="height: 70%; background: #f59e0b;" title="图片"></div>
            <div class="bar-segment" style="height: 20%; background: #409eff;" title="文本"></div>
            <div class="bar-segment" style="height: 10%; background: #67c23a;" title="其他"></div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot" style="background: #409eff;"></span>
              <span class="legend-text">平均每天 ¥{{ stats.totalCost.daily.toFixed(8) }}</span>
            </div>
            <div class="legend-item">
              <span class="dot" style="background: #67c23a;"></span>
              <span class="legend-text">过去一月 ¥{{ stats.totalCost.monthly.toFixed(8) }}</span>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">多模态 Tokens</span>
            <el-icon class="chart-info" size="14" color="#909399"><InfoFilled /></el-icon>
          </div>
          <div class="bar-chart group-bar">
            <div class="group-item" v-for="item in tokenBars" :key="item.label">
              <div class="bar-wrapper">
                <div class="bar" :style="{ height: item.percent + '%', background: item.color }"></div>
              </div>
              <span class="bar-label">{{ item.label }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot" style="background: #409eff;"></span>
              <span class="legend-text">平均每天 {{ stats.multimodalTokens.text.toFixed(2) }}</span>
            </div>
            <div class="legend-item">
              <span class="dot" style="background: #67c23a;"></span>
              <span class="legend-text">过去一月 {{ stats.multimodalTokens.monthly }}</span>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">总请求数</span>
            <el-icon class="chart-info" size="14" color="#909399"><InfoFilled /></el-icon>
          </div>
          <div class="bar-chart simple-bar">
            <div class="bar-wrapper">
              <div class="bar" style="height: 85%; background: #409eff;"></div>
            </div>
            <div class="bar-wrapper">
              <div class="bar" style="height: 15%; background: #67c23a;"></div>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot" style="background: #409eff;"></span>
              <span class="legend-text">平均每天 {{ stats.totalRequests.daily }}</span>
            </div>
            <div class="legend-item">
              <span class="dot" style="background: #67c23a;"></span>
              <span class="legend-text">过去一月 {{ stats.totalRequests.monthly }}</span>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="card chart-card">
          <div class="chart-header">
            <span class="chart-title">多模态消耗分布</span>
            <el-icon class="chart-info" size="14" color="#909399"><InfoFilled /></el-icon>
          </div>
          <div class="donut-chart-wrapper">
            <svg class="donut-chart" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" stroke-width="16" />
              <circle
                v-for="(seg, idx) in donutSegments"
                :key="idx"
                cx="60" cy="60" r="50" fill="none"
                :stroke="seg.color"
                stroke-width="16"
                :stroke-dasharray="seg.dasharray"
                :stroke-dashoffset="seg.offset"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div class="donut-center">
              <span class="donut-label">总计</span>
            </div>
          </div>
          <div class="chart-legend compact">
            <div class="legend-item" v-for="item in stats.distribution.slice(0, 4)" :key="item.label">
              <span class="dot" :style="{ background: item.color }"></span>
              <span class="legend-text">{{ item.label }} {{ item.percent }}% 输出:{{ item.value }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选栏 -->
    <div class="card filter-bar mb-24">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">从:</span>
          <el-date-picker
            v-model="filterFrom"
            type="datetime"
            placeholder="开始时间"
            size="default"
            style="width: 180px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">到:</span>
          <el-date-picker
            v-model="filterTo"
            type="datetime"
            placeholder="结束时间"
            size="default"
            style="width: 180px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div class="filter-item">
          <el-radio-group v-model="filterType" size="default">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="text">文本</el-radio-button>
            <el-radio-button label="image">图片</el-radio-button>
            <el-radio-button label="video">视频</el-radio-button>
            <el-radio-button label="audio">音频</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-actions">
          <el-button type="primary" :icon="Filter" @click="handleFilter">筛选</el-button>
          <el-button :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="card">
      <el-table
        :data="paginatedRecords"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 600 }"
        stripe
      >
        <el-table-column label="时间" min-width="170">
          <template #default="{ row }">
            <span>{{ row.time }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型" width="90" align="center">
          <template #default="{ row }">
            <div class="type-cell">
              <div class="type-icon" :style="{ background: typeMeta[row.type as ConsumptionType].color + '20', color: typeMeta[row.type as ConsumptionType].color }">
                <el-icon size="14">
                  <ChatDotRound v-if="row.type === 'text'" />
                  <Picture v-else-if="row.type === 'image'" />
                  <VideoCamera v-else-if="row.type === 'video'" />
                  <Headset v-else />
                </el-icon>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="提供商/模型" min-width="260">
          <template #default="{ row }">
            <div class="provider-cell">
              <div class="provider-name">{{ row.provider }}</div>
              <div class="model-name">{{ row.model }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="应用程序" width="100" align="center">
          <template #default="{ row }">
            <span class="app-text">{{ row.app }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Tokens" width="140" align="center">
          <template #default="{ row }">
            <div class="tokens-cell">
              <span>输入:{{ row.tokensIn }}</span>
              <span class="tokens-divider">|</span>
              <span>输出:{{ row.tokensOut }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="媒体详情" width="150" align="center">
          <template #default="{ row }">
            <span class="media-text">{{ row.mediaDetail }}</span>
          </template>
        </el-table-column>

        <el-table-column label="消费金额" width="110" align="center">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.amount.toFixed(6) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="吞吐量" width="90" align="center">
          <template #default="{ row }">
            <span class="throughput-text">{{ row.throughput }} tps</span>
          </template>
        </el-table-column>

        <el-table-column label="" width="50" align="center">
          <template #default="{ row: _row }">
            <el-icon size="14" color="#c0c4cc" style="cursor: pointer"><ArrowRight /></el-icon>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredRecords.length"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Filter, Download, InfoFilled, ChatDotRound, Picture, VideoCamera, Headset, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { mockConsumptionRecords, consumptionStats } from '@/mock/data'
import type { ConsumptionType } from '@/mock/data'

const timeRange = ref('1m')
const filterFrom = ref('')
const filterTo = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const stats = consumptionStats

const typeMeta: Record<ConsumptionType, { label: string; color: string }> = {
  text: { label: '文本', color: '#409eff' },
  image: { label: '图片', color: '#67c23a' },
  video: { label: '视频', color: '#e6a23c' },
  audio: { label: '音频', color: '#9254de' }
}

const tokenBars = [
  { label: 'Text', percent: 100, color: '#f59e0b' },
  { label: 'Image', percent: 78, color: '#409eff' },
  { label: 'Video', percent: 62, color: '#67c23a' },
  { label: 'Audio', percent: 48, color: '#9254de' }
]

const circumference = 2 * Math.PI * 50
const donutSegments = computed(() => {
  let accumulatedPercent = 0
  return stats.distribution.map(item => {
    const segPercent = item.percent
    const dashLength = (segPercent / 100) * circumference
    const offset = -(accumulatedPercent / 100) * circumference
    accumulatedPercent += segPercent
    return {
      color: item.color,
      dasharray: `${dashLength} ${circumference - dashLength}`,
      offset
    }
  })
})

const filteredRecords = computed(() => {
  let list = [...mockConsumptionRecords]
  if (filterType.value) {
    list = list.filter(r => r.type === filterType.value)
  }
  if (filterFrom.value) {
    list = list.filter(r => r.time >= filterFrom.value)
  }
  if (filterTo.value) {
    list = list.filter(r => r.time <= filterTo.value)
  }
  return list
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRecords.value.slice(start, start + pageSize.value)
})

const handleFilter = () => {
  currentPage.value = 1
  ElMessage.success('筛选已应用')
}

const handleExport = () => {
  const csv = [
    ['时间', '类型', '提供商', '模型', 'Tokens输入', 'Tokens输出', '媒体详情', '消费金额', '吞吐量'].join(','),
    ...filteredRecords.value.map(r => [
      r.time, typeMeta[r.type].label, r.provider, r.model,
      r.tokensIn, r.tokensOut, r.mediaDetail, r.amount, r.throughput
    ].join(','))
  ].join('\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `消费记录_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  ElMessage.success('导出成功')
}
</script>

<style lang="scss" scoped>
.time-filter-bar {
  display: flex;
  justify-content: flex-end;
}

.chart-card {
  padding: 16px;
  height: 280px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-info {
  cursor: pointer;
}

.bar-chart {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  min-height: 100px;
  padding: 0 16px;

  &.stacked-bar {
    flex-direction: column-reverse;
    align-items: center;
    width: 60px;
    margin: 0 auto;
    gap: 0;
    border-radius: 4px;
    overflow: hidden;

    .bar-segment {
      width: 100%;
      transition: height 0.3s;
    }
  }

  &.group-bar {
    gap: 16px;
    align-items: flex-end;

    .group-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;

      .bar-wrapper {
        width: 32px;
        height: 120px;
        background: #f5f7fa;
        border-radius: 4px 4px 0 0;
        display: flex;
        align-items: flex-end;
        overflow: hidden;

        .bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s;
        }
      }

      .bar-label {
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }

  &.simple-bar {
    gap: 32px;
    align-items: flex-end;

    .bar-wrapper {
      width: 48px;
      height: 120px;
      background: #f5f7fa;
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: flex-end;
      overflow: hidden;

      .bar {
        width: 100%;
        border-radius: 4px 4px 0 0;
        transition: height 0.3s;
      }
    }
  }
}

.donut-chart-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 100px;
}

.donut-chart {
  width: 110px;
  height: 110px;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  .donut-label {
    font-size: 12px;
    color: var(--text-secondary);
  }
}

.chart-legend {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-secondary);

  &.compact {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 2px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.filter-bar {
  padding: 16px 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.type-cell {
  display: flex;
  justify-content: center;

  .type-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.provider-cell {
  .provider-name {
    font-size: 13px;
    color: var(--text-primary);
    font-weight: 500;
  }

  .model-name {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }
}

.app-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.tokens-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-primary);

  .tokens-divider {
    color: var(--text-secondary);
  }
}

.media-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.amount-text {
  font-size: 13px;
  color: #f56c6c;
  font-weight: 500;
}

.throughput-text {
  font-size: 13px;
  color: var(--text-primary);
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}
</style>
