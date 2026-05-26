<template>
  <div class="model-detail">
    <!-- 面包屑 -->
    <div class="breadcrumb-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <a href="javascript:;" @click="goBack">模型中心</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ model?.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <template v-if="model">
      <!-- 模型信息卡片 -->
      <div class="card model-info-card">
        <div class="info-header">
          <h2 class="model-title">{{ model.name }}</h2>
          <div class="info-meta">
            <span>分类: {{ model.category }}</span>
            <el-divider direction="vertical" />
            <span>版本: {{ model.version }}</span>
            <el-divider direction="vertical" />
            <span>创建者: {{ model.creator }}</span>
            <el-divider direction="vertical" />
            <span>创建时间: {{ model.createdAt }}</span>
          </div>
        </div>
      </div>

      <!-- 状态卡片 -->
      <el-row :gutter="20" class="status-row">
        <el-col :span="8">
          <div class="card status-card">
            <div class="status-label">近10分钟状态</div>
            <div class="status-value">
              <span class="status-tag" :class="'tag-' + statusType">{{ model.status }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card status-card clickable" @click="goToSuccessRate">
            <div class="status-label">近10分钟调用成功率</div>
            <div class="status-value">
              <span class="rate-value" :class="{ 'rate-error': model.successRate < 95 }">
                {{ model.successRate }}%
              </span>
            </div>
            <div class="update-time">{{ lastUpdateTime }}更新</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card status-card">
            <div class="status-label">调用量 / 调用异常次数</div>
            <div class="status-value metric-row">
              <span class="metric-num blue">{{ formatNumber(totalInvocations) }}</span>
              <span class="metric-divider">/</span>
              <span class="metric-num orange">{{ totalErrors }}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 时间筛选 + 折线图 -->
      <div class="card chart-card">
        <div class="chart-header">
          <h3>调用量趋势</h3>
          <div class="time-filter">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
              style="width: 400px"
              @change="handleTimeChange"
            />
          </div>
        </div>
        <div class="chart-container" ref="chartRef"></div>
      </div>
    </template>

    <el-empty v-else description="模型不存在" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mockModels, getTodayTimeSlots, generateDayTimeSlots, getLastUpdateTime } from '@/mock/model-data'

const route = useRoute()
const router = useRouter()

const modelId = computed(() => Number(route.params.id))
const model = computed(() => mockModels.find(m => m.id === modelId.value))

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const lastUpdateTime = getLastUpdateTime()

// 时间筛选 - 默认当天
const today = dayjs().format('YYYY-MM-DD')
const timeRange = ref<[string, string]>([
  `${today} 00:00`,
  `${today} 23:50`
])

const statusType = computed(() => {
  if (!model.value) return 'normal'
  const s = model.value.status
  if (s === '正常') return 'normal'
  if (s === '空闲') return 'idle'
  return 'error'
})

// 汇总数据
const totalInvocations = computed(() => {
  if (!model.value) return 0
  return model.value.invocations
})

const totalErrors = computed(() => {
  if (!model.value) return 0
  return model.value.errorCount
})

const formatNumber = (num: number) => num.toLocaleString()

// 时间禁用逻辑：只能选10分钟间隔
const disabledHours = () => {
  return []
}

const disabledMinutes = (_hour: number) => {
  // 只允许 0, 10, 20, 30, 40, 50
  const allowed = [0, 10, 20, 30, 40, 50]
  return Array.from({ length: 60 }, (_, i) => i).filter(i => !allowed.includes(i))
}

// 获取筛选时段内的数据
const chartData = computed(() => {
  const [start, end] = timeRange.value
  if (!start || !end) return getTodayTimeSlots()

  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const dateStr = startDate.format('YYYY-MM-DD')
  const allSlots = generateDayTimeSlots(dateStr)

  const startMinutes = startDate.hour() * 60 + startDate.minute()
  const endMinutes = endDate.hour() * 60 + endDate.minute()
  const startIdx = Math.floor(startMinutes / 10)
  const endIdx = Math.floor(endMinutes / 10)

  return allSlots.slice(startIdx, endIdx + 1)
})

// 初始化/更新图表
const initChart = () => {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const data = chartData.value
  const xLabels = data.map(d => d.timeLabel)
  const invocationsData = data.map(d => d.invocations)
  const errorData = data.map(d => d.errorCount)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter(params: any) {
        if (!Array.isArray(params)) return ''
        const timeInfo = data[params[0].dataIndex]
        let html = `<div style="font-size:13px;font-weight:600;margin-bottom:6px">${timeInfo?.time || ''}</div>`
        params.forEach((p: any) => {
          const color = p.color
          html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></span>
            <span>${p.seriesName}: ${p.value}</span>
          </div>`
        })
        if (timeInfo && timeInfo.invocations > 0) {
          html += `<div style="margin-top:4px;color:#999">成功率: ${timeInfo.successRate}%</div>`
        }
        return html
      }
    },
    legend: {
      data: ['调用量', '异常数'],
      top: 0
    },
    grid: {
      left: 60,
      right: 60,
      top: 40,
      bottom: 40
    },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLabel: {
        interval: Math.max(Math.floor(xLabels.length / 12), 0),
        fontSize: 11
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '调用量',
        position: 'left',
        axisLabel: { fontSize: 11 }
      },
      {
        type: 'value',
        name: '异常次数',
        position: 'right',
        axisLabel: { fontSize: 11 }
      }
    ],
    series: [
      {
        name: '调用量',
        type: 'line',
        data: invocationsData,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#409eff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.2)' },
            { offset: 1, color: 'rgba(64,158,255,0.01)' }
          ])
        }
      },
      {
        name: '异常数',
        type: 'line',
        yAxisIndex: 1,
        data: errorData,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#e6a23c' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(230,162,60,0.2)' },
            { offset: 1, color: 'rgba(230,162,60,0.01)' }
          ])
        }
      }
    ]
  }

  chartInstance.setOption(option, true)
}

const handleTimeChange = () => {
  nextTick(() => initChart())
}

const goBack = () => {
  router.push('/model-center')
}

const goToSuccessRate = () => {
  router.push(`/model-success-rate/${modelId.value}`)
}

// 窗口resize
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  nextTick(() => initChart())
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chartInstance?.dispose()
  chartInstance = null
  window.removeEventListener('resize', handleResize)
})

watch(chartData, () => {
  nextTick(() => initChart())
})
</script>

<style lang="scss" scoped>
.model-detail {
  min-height: 100%;
}

.breadcrumb-bar {
  margin-bottom: 16px;
}

.model-info-card {
  .info-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .model-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .info-meta {
    font-size: 13px;
    color: var(--text-secondary);
  }
}

.status-row {
  margin: 20px 0;
  display: flex;

  .el-col {
    display: flex;
  }

  .status-card {
    text-align: center;
    padding: 24px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 120px;

    &.clickable {
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
      }
    }
  }

  .status-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }

  .status-value {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .status-tag {
    display: inline-block;
    padding: 4px 20px;
    border-radius: 16px;
    font-size: 15px;
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

  .rate-value {
    font-size: 28px;
    font-weight: 700;
    color: #67c23a;

    &.rate-error {
      color: #f56c6c;
    }
  }

  .update-time {
    font-size: 12px;
    color: var(--text-tertiary);
    margin-top: 8px;
  }

  .metric-row {
    gap: 8px;
  }

  .metric-num {
    font-size: 24px;
    font-weight: 700;

    &.blue {
      color: #409eff;
    }
    &.orange {
      color: #e6a23c;
    }
  }

  .metric-divider {
    font-size: 20px;
    color: var(--text-tertiary);
    margin: 0 4px;
  }
}

.chart-card {
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .chart-container {
    width: 100%;
    height: 400px;
  }
}
</style>
