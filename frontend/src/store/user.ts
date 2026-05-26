import { defineStore } from 'pinia'
import router from '@/router'

interface UserInfo {
  id: number
  name: string
  username: string
  avatar: string
  roles: string[]
  departments: string[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
    roles: [] as string[],
    permissions: [] as string[]
  }),

  actions: {
    async login(form: { username: string; password: string }) {
      this.token = 'mock-token-' + Date.now()
      localStorage.setItem('token', this.token)
      
      this.userInfo = {
        id: 1,
        name: '王飞',
        username: form.username,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        roles: ['系统管理员'],
        departments: ['门店发展数字化部', '工程部']
      }
      
      this.roles = ['admin']
    },

    logout() {
      this.token = ''
      this.userInfo = null
      this.roles = []
      this.permissions = []
      localStorage.removeItem('token')
      localStorage.removeItem('theme')
      router.push('/login')
    },

    toggleTheme() {
      const html = document.documentElement
      const isDark = html.classList.contains('dark')
      if (isDark) {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      } else {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      }
    },

    initTheme() {
      const theme = localStorage.getItem('theme')
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }
})
