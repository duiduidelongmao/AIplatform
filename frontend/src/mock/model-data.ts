import dayjs from 'dayjs'

// 模型分类
export interface ModelCategory {
  id: number
  name: string
}

export const mockModelCategories: ModelCategory[] = [
  { id: 1, name: 'AI巡店' },
  { id: 2, name: 'AI巡仓' },
  { id: 3, name: 'SKU识别' }
]

// 模型状态
export type ModelStatus = '正常' | '空闲' | '异常'

// 模型信息
export interface ModelInfo {
  id: number
  name: string
  category: string
  categoryId: number
  status: ModelStatus
  invocations: number          // 调用量
  successRate: number          // 近10分钟调用成功率
  errorCount: number           // 近10分钟异常次数
  version: string
  creator: string
  createdAt: string
}

// 生成模型列表
const aiPatrolStoreModels = [
  { name: '陈列饱满度模型', version: 'V1.0', creator: '张三' },
  { name: 'T形取货模型', version: 'V1.2', creator: '李四' },
  { name: '商品陈列识别模型', version: 'V2.0', creator: '王五' },
  { name: '货架缺货检测模型', version: 'V1.1', creator: '赵六' },
  { name: '价格标签识别模型', version: 'V1.3', creator: '张三' },
  { name: '促销堆头识别模型', version: 'V1.0', creator: '钱七' },
  { name: '门店卫生检测模型', version: 'V2.1', creator: '李四' }
]

const aiPatrolWarehouseModels = [
  { name: '仓库温湿度监测模型', version: 'V1.0', creator: '张三' },
  { name: '库存异常检测模型', version: 'V1.5', creator: '王五' },
  { name: '货物摆放规范模型', version: 'V1.2', creator: '赵六' },
  { name: '仓库安全监测模型', version: 'V2.0', creator: '钱七' },
  { name: '入库质检模型', version: 'V1.1', creator: '李四' },
  { name: '出库复核模型', version: 'V1.0', creator: '张三' }
]

const skuRecognitionModels = [
  { name: 'SKU条码识别模型', version: 'V3.0', creator: '王五' },
  { name: 'SKU图像识别模型', version: 'V2.2', creator: '赵六' },
  { name: '商品分类识别模型', version: 'V1.8', creator: '张三' },
  { name: '保质期识别模型', version: 'V1.0', creator: '钱七' },
  { name: '商品规格识别模型', version: 'V1.3', creator: '李四' },
  { name: '新品录入识别模型', version: 'V1.1', creator: '张三' },
  { name: '货架SKU匹配模型', version: 'V2.0', creator: '王五' }
]

function generateStatus(index: number): { status: ModelStatus; successRate: number; errorCount: number } {
  const rand = index % 5
  if (rand === 0) {
    // 空闲：无调用
    return { status: '空闲', successRate: 0, errorCount: 0 }
  } else if (rand === 1) {
    // 异常：成功率 < 95%
    const rate = 80 + Math.floor(Math.random() * 15)
    return { status: '异常', successRate: rate, errorCount: Math.floor(Math.random() * 200) + 50 }
  } else {
    // 正常
    const rate = 95 + Math.floor(Math.random() * 5)
    const decimals = Math.floor(Math.random() * 10) / 10
    return { status: '正常', successRate: Math.min(99.9, rate + decimals), errorCount: Math.floor(Math.random() * 30) }
  }
}

let modelIdCounter = 1

function createModels(categoryId: number, categoryName: string, models: typeof aiPatrolStoreModels): ModelInfo[] {
  return models.map((m, i) => {
    const { status, successRate, errorCount } = generateStatus(i + categoryId * 10)
    const baseInvocations = Math.floor(Math.random() * 5000000) + 100000
    return {
      id: modelIdCounter++,
      name: m.name,
      category: categoryName,
      categoryId,
      status,
      invocations: baseInvocations,
      successRate,
      errorCount,
      version: m.version,
      creator: m.creator,
      createdAt: dayjs().subtract(Math.floor(Math.random() * 90) + 1, 'day').format('YYYY.MM.DD')
    }
  })
}

export const mockModels: ModelInfo[] = [
  ...createModels(1, 'AI巡店', aiPatrolStoreModels),
  ...createModels(2, 'AI巡仓', aiPatrolWarehouseModels),
  ...createModels(3, 'SKU识别', skuRecognitionModels)
]

// ==================== 模型详情折线图数据 ====================

export interface TimeSlotData {
  time: string           // 时间段 如 "15:30 - 15:40"
  timeLabel: string      // X轴标签 如 "15:30"
  invocations: number    // 调用量
  errorCount: number     // 异常次数
  successRate: number    // 成功率
  status: ModelStatus
}

// 生成某天的10分钟间隔数据
export function generateDayTimeSlots(_date: string): TimeSlotData[] {
  const slots: TimeSlotData[] = []
  for (let i = 0; i < 144; i++) {
    const startMin = i * 10
    const startHour = Math.floor(startMin / 60)
    const startMinRem = startMin % 60
    const endMin = startMin + 10
    const endHour = Math.floor(endMin / 60)
    const endMinRem = endMin % 60

    const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinRem).padStart(2, '0')}`
    const endTime = `${String(endHour % 24).padStart(2, '0')}:${String(endMinRem).padStart(2, '0')}`

    const invocations = Math.floor(Math.random() * 500)
    const errorCount = Math.floor(Math.random() * 20)
    const successRate = invocations > 0 ? Math.round(((invocations - errorCount) / invocations) * 1000) / 10 : 0
    const status: ModelStatus = invocations === 0 ? '空闲' : successRate < 95 ? '异常' : '正常'

    slots.push({
      time: `${startTime} - ${endTime}`,
      timeLabel: startTime,
      invocations,
      errorCount,
      successRate,
      status
    })
  }
  return slots
}

// 获取当天已过的时段数据（到当前时间的10分钟整点）
export function getTodayTimeSlots(): TimeSlotData[] {
  const now = dayjs()
  const allSlots = generateDayTimeSlots(now.format('YYYY-MM-DD'))
  const currentSlotIndex = Math.floor((now.hour() * 60 + now.minute()) / 10)
  return allSlots.slice(0, Math.min(currentSlotIndex + 1, allSlots.length))
}

// ==================== 成功率详情表格数据 ====================

export interface SuccessRateRecord {
  id: number
  time: string
  invocations: number
  errorCount: number
  successRate: string
  status: ModelStatus
}

export function generateSuccessRateRecords(date: string): SuccessRateRecord[] {
  const slots = generateDayTimeSlots(date)
  return slots.map((slot, index) => ({
    id: index + 1,
    time: slot.time,
    invocations: slot.invocations,
    errorCount: slot.errorCount,
    successRate: slot.invocations === 0 ? '-' : slot.successRate + '%',
    status: slot.status
  }))
}

// 获取当前10分钟时段的更新时间
export function getLastUpdateTime(): string {
  const now = dayjs()
  const currentSlotStart = Math.floor(now.minute() / 10) * 10
  return dayjs().hour(now.hour()).minute(currentSlotStart).format('YYYY.M.DD HH:mm')
}
