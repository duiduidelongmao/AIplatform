import dayjs from 'dayjs'

export const mockStores = [
  { id: 1, name: '北京朝阳店', code: 'BJ001' },
  { id: 2, name: '北京海淀店', code: 'BJ002' },
  { id: 3, name: '上海浦东店', code: 'SH001' },
  { id: 4, name: '上海静安店', code: 'SH002' },
  { id: 5, name: '广州天河店', code: 'GZ001' },
  { id: 6, name: '深圳南山店', code: 'SZ001' }
]

export const mockCategories = [
  { id: 1, name: '电子设备', children: [
    { id: 101, name: '收银机' },
    { id: 102, name: '打印机' },
    { id: 103, name: '扫码枪' }
  ]},
  { id: 2, name: '制冷设备', children: [
    { id: 201, name: '冷柜' },
    { id: 202, name: '冰箱' },
    { id: 203, name: '空调' }
  ]},
  { id: 3, name: '家具货架', children: [
    { id: 301, name: '货架' },
    { id: 302, name: '收银台' },
    { id: 303, name: '办公桌椅' }
  ]},
  { id: 4, name: '低值易耗品', children: [
    { id: 401, name: '工服' },
    { id: 402, name: '清洁工具' },
    { id: 403, name: '展架' }
  ]}
]

export const mockEmployees = [
  { id: 1, name: '张三', storeId: 1, phone: '13800138001' },
  { id: 2, name: '李四', storeId: 1, phone: '13800138002' },
  { id: 3, name: '王五', storeId: 2, phone: '13800138003' },
  { id: 4, name: '赵六', storeId: 3, phone: '13800138004' },
  { id: 5, name: '钱七', storeId: 4, phone: '13800138005' }
]

const statusMap: Record<number, string> = {
  1: '在库',
  2: '在用',
  3: '维修中',
  4: '调拨中',
  5: '报废'
}

const statusTagMap: Record<number, string> = {
  1: 'success',
  2: 'primary',
  3: 'warning',
  4: 'info',
  5: 'danger'
}

const assetNames = ['收银机', '冷柜', '货架', '空调', '打印机', '扫码枪', '办公椅', '员工工服', '清洁车', '展架']
const brands = ['惠普', '海尔', '格力', '美的', '得力', '斑马', '震旦', '3M']

export const mockAssets = Array.from({ length: 86 }, (_, i) => ({
  id: i + 1,
  asset_code: `ASSET202604${String(i + 1).padStart(4, '0')}`,
  asset_name: assetNames[i % assetNames.length],
  category_id: (i % 4 + 1) * 100 + (i % 3 + 1),
  category_name: mockCategories[Math.floor(i / 20) % 4].children![i % 3].name,
  brand: brands[i % brands.length],
  model: `Model-${String(i + 1).padStart(3, '0')}`,
  serial_no: `SN${String(i + 10000).padStart(8, '0')}`,
  status: (i % 5 + 1) as 1 | 2 | 3 | 4 | 5,
  status_name: statusMap[i % 5 + 1],
  status_tag: statusTagMap[i % 5 + 1],
  store_id: i % 6 + 1,
  store_name: mockStores[i % 6].name,
  location_area: ['前台', '仓库', '办公区', '卖场'][i % 4],
  location_detail: `位置${i + 1}`,
  user_employee_id: i % 5 + 1,
  user_name: mockEmployees[i % 5].name,
  purchase_date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
  original_value: Math.round((500 + Math.random() * 10000) * 100) / 100,
  net_value: Math.round((300 + Math.random() * 8000) * 100) / 100,
  warranty_expire_date: dayjs().add(365 + i, 'day').format('YYYY-MM-DD'),
  supplier_id: i % 5 + 1,
  supplier_name: `供应商${(i % 5) + 1}`,
  qr_code_url: '',
  remark: '',
  created_at: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss')
}))

export const mockPurchaseOrders = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  order_no: `PO202604${String(i + 1).padStart(4, '0')}`,
  store_id: i % 6 + 1,
  store_name: mockStores[i % 6].name,
  status: i % 4,
  status_name: ['待审批', '审批中', '已审批', '已入库'][i % 4],
  status_tag: ['warning', 'info', 'primary', 'success'][i % 4],
  total_amount: Math.round((5000 + Math.random() * 50000) * 100) / 100,
  item_count: Math.floor(Math.random() * 10) + 1,
  applicant: mockEmployees[i % 5].name,
  approve_by: i > 20 ? '总部-李主管' : null,
  created_at: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss')
}))

export const mockRepairOrders = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  repair_no: `REP202604${String(i + 1).padStart(4, '0')}`,
  asset_id: i + 1,
  asset_name: mockAssets[i].asset_name,
  asset_code: mockAssets[i].asset_code,
  store_id: i % 6 + 1,
  store_name: mockStores[i % 6].name,
  fault_type: ['设备故障', '损坏维修', '保养维护', '配件更换'][i % 4],
  description: ['无法开机', '异响严重', '制冷效果差', '按键失灵', '屏幕花屏'][i % 5],
  status: i % 5,
  status_name: ['待派单', '维修中', '待确认', '已完成', '已取消'][i % 5],
  status_tag: ['warning', 'primary', 'info', 'success', 'danger'][i % 5],
  reporter: mockEmployees[i % 5].name,
  repairer: i > 10 ? '张师傅' : null,
  cost_amount: i > 15 ? Math.round(Math.random() * 500 * 100) / 100 : null,
  created_at: dayjs().subtract(i * 4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
  finish_time: i > 20 ? dayjs().subtract(i, 'hour').format('YYYY-MM-DD HH:mm:ss') : null
}))

export const mockInventoryTasks = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  task_no: `INV2026Q${Math.floor(i / 4) + 1}`,
  task_name: `2026年Q${Math.floor(i / 3) + 1}门店盘点`,
  store_id: i % 6 + 1,
  store_name: mockStores[i % 6].name,
  total_count: 50 + i * 5,
  checked_count: Math.floor((50 + i * 5) * (i < 6 ? 0.6 : 1)),
  diff_count: i < 6 ? Math.floor(Math.random() * 5) : 0,
  status: i < 6 ? 1 : 2,
  status_name: i < 6 ? '进行中' : '已完成',
  status_tag: i < 6 ? 'primary' : 'success',
  start_date: dayjs().subtract(30 + i * 3, 'day').format('YYYY-MM-DD'),
  end_date: dayjs().subtract(23 + i * 3, 'day').format('YYYY-MM-DD'),
  operator: mockEmployees[i % 5].name
}))

export const dashboardStats = {
  totalAssets: 86,
  inUseAssets: 32,
  repairingAssets: 18,
  totalValue: 456789.50,
  monthNewAssets: 12,
  monthRepairs: 28,
  completionRate: 92.5
}

// ==================== 多模态消费记录 Mock 数据 ====================

export type ConsumptionType = 'text' | 'image' | 'video' | 'audio'

export interface ConsumptionRecord {
  id: number
  time: string
  type: ConsumptionType
  provider: string
  model: string
  app: string
  tokensIn: number
  tokensOut: number
  mediaDetail: string
  amount: number
  throughput: number
}

const consumptionProviders = [
  { provider: 'OneLinkAI - Fallback', models: ['Anthropic: Claude Opus 4.6', 'Anthropic: Claude 3.5 Sonnet (Vision)', 'Anthropic: Claude Sonnet 4.6'] },
  { provider: 'OneLinkAI - Fallback', models: ['OpenAI: GPT-4o (Image)'] },
  { provider: 'OneLinkAI - Fallback', models: ['Google: Gemini 1.5 Pro (Video)'] },
  { provider: 'OneLinkAI - Fallback', models: ['OpenAI: Whisper Large V3'] }
]

const typeConfig: Record<ConsumptionType, { label: string; color: string; icon: string; providerIdx: number }> = {
  text: { label: '文本', color: '#409eff', icon: 'ChatDotRound', providerIdx: 0 },
  image: { label: '图片', color: '#67c23a', icon: 'Picture', providerIdx: 1 },
  video: { label: '视频', color: '#e6a23c', icon: 'VideoCamera', providerIdx: 2 },
  audio: { label: '音频', color: '#9254de', icon: 'Headset', providerIdx: 3 }
}

const mediaDetails: Record<ConsumptionType, string[]> = {
  text: ['-', '-', '-'],
  image: ['1024x1024, 450KB', '2048x1536, 1.2MB', '1024x768, 320KB'],
  video: ['30s, 720p', '15s, 1080p', '60s, 480p'],
  audio: ['45s, 128kbps', '120s, 64kbps', '30s, 256kbps']
}

function randomType(): ConsumptionType {
  const types: ConsumptionType[] = ['text', 'image', 'video', 'audio']
  const weights = [0.45, 0.25, 0.15, 0.15]
  const r = Math.random()
  let sum = 0
  for (let i = 0; i < types.length; i++) {
    sum += weights[i]
    if (r <= sum) return types[i]
  }
  return 'text'
}

export const mockConsumptionRecords: ConsumptionRecord[] = Array.from({ length: 60 }, (_, i) => {
  const type = randomType()
  const cfg = typeConfig[type]
  const providerInfo = consumptionProviders[cfg.providerIdx]
  const model = providerInfo.models[i % providerInfo.models.length]
  const mediaDetail = mediaDetails[type][i % mediaDetails[type].length]

  let tokensIn = 0, tokensOut = 0
  if (type === 'text') {
    tokensIn = Math.floor(Math.random() * 500) + 10
    tokensOut = Math.floor(Math.random() * 800) + 5
  } else if (type === 'image') {
    tokensIn = Math.floor(Math.random() * 300) + 20
    tokensOut = Math.floor(Math.random() * 400) + 100
  } else if (type === 'video') {
    tokensIn = Math.floor(Math.random() * 600) + 50
    tokensOut = Math.floor(Math.random() * 900) + 200
  } else {
    tokensIn = Math.floor(Math.random() * 200) + 10
    tokensOut = Math.floor(Math.random() * 300) + 50
  }

  const amount = Math.round((tokensIn * 0.0001 + tokensOut * 0.0003 + (type !== 'text' ? 0.005 : 0)) * 10000) / 10000

  return {
    id: i + 1,
    time: dayjs().subtract(i * 47, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    type,
    provider: providerInfo.provider,
    model,
    app: '-',
    tokensIn,
    tokensOut,
    mediaDetail,
    amount,
    throughput: Math.floor(Math.random() * 80) + 5
  }
})

export const consumptionStats = {
  totalCost: { daily: 0.016260062, monthly: 0.50407915 },
  multimodalTokens: { text: 307.39, image: 245.12, video: 198.56, audio: 156.78, monthly: 9529 },
  totalRequests: { daily: 0.94, monthly: 29 },
  distribution: [
    { type: 'text' as ConsumptionType, label: '文本', percent: 65, value: 329, color: '#409eff' },
    { type: 'image' as ConsumptionType, label: '图片', percent: 15, value: 76, color: '#67c23a' },
    { type: 'video' as ConsumptionType, label: '视频', percent: 10, value: 50, color: '#e6a23c' },
    { type: 'audio' as ConsumptionType, label: '音频', percent: 8, value: 40, color: '#9254de' },
    { type: 'text' as ConsumptionType, label: '其他', percent: 2, value: 10, color: '#909399' }
  ]
}
