import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/model-center',
    children: [
      {
        path: 'model-center',
        name: 'ModelCenter',
        component: () => import('@/views/model-center/index.vue'),
        meta: { title: '模型中心' }
      },
      {
        path: 'model-detail/:id',
        name: 'ModelDetail',
        component: () => import('@/views/model-detail/index.vue'),
        meta: { title: '模型详情' }
      },
      {
        path: 'model-success-rate/:id',
        name: 'ModelSuccessRate',
        component: () => import('@/views/model-success-rate/index.vue'),
        meta: { title: '成功率详情' }
      },
      {
        path: 'ai-tasks',
        name: 'AITasks',
        component: () => import('@/views/ai-tasks/index.vue'),
        meta: { title: 'AI任务列表' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '系统设置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  
  if (token && to.path === '/login') {
    return next('/model-center')
  }
  
  next()
})

export default router
