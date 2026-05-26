<template>
  <div class="main-layout">
    <header class="layout-header">
      <div class="flex-center">
        <el-icon size="28" color="#409eff"><Cpu /></el-icon>
        <span style="margin-left: 12px; font-size: 18px; font-weight: 600">大数据AI平台</span>
      </div>
      
      <div class="flex-center">
        <el-tooltip content="切换主题">
          <el-icon :size="20" style="margin-right: 24px; cursor: pointer" @click="userStore.toggleTheme">
            <Sunny v-if="!isDark" />
            <Moon v-else />
          </el-icon>
        </el-tooltip>
        
        <el-dropdown @command="handleCommand">
          <div class="flex-center" style="cursor: pointer">
            <el-avatar :src="userStore.userInfo?.avatar" :size="32" />
            <span style="margin-left: 12px">{{ userStore.userInfo?.name }}</span>
            <el-icon style="margin-left: 8px"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <div class="layout-body">
      <aside class="layout-sidebar">
        <el-menu
          :default-active="activeMenu"
          router
          style="border: none"
        >
          <el-menu-item index="/model-center">
            <el-icon><Monitor /></el-icon>
            <span>模型中心</span>
          </el-menu-item>
          
          <el-menu-item index="/ai-tasks">
            <el-icon><List /></el-icon>
            <span>AI任务列表</span>
          </el-menu-item>
          
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <main class="layout-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Cpu, Sunny, Moon, ArrowDown, Monitor, Setting, List } from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()

const isDark = computed(() => document.documentElement.classList.contains('dark'))

const activeMenu = computed(() => route.path)

onMounted(() => {
  userStore.initTheme()
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      ElMessage.success('已退出登录')
    }).catch(() => {})
  }
}
</script>
