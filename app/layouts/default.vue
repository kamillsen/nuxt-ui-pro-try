<template>
  <UDashboardGroup>
    <UDashboardSidebar id="default" v-model:open="open" collapsible resizable 
      class="bg-elevated/25" :ui="{ footer: 'lg:border-t lg:border-default' }">
      
      <template #header="{ collapsed }">
        <div class="flex items-center gap-3 p-4">
          <div class="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
            <span class="text-white font-bold text-sm">D</span>
          </div>
          <div v-if="!collapsed" class="flex flex-col">
            <span class="font-semibold text-sm">Dashboard</span>
            <span class="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSidebarCollapse />
        
        <!-- Loading durumu -->
        <div v-if="pending" class="flex items-center justify-center p-4">
          <UIcon name="i-heroicons-arrow-path" class="h-5 w-5 animate-spin" />
        </div>

        <template v-else>
          <UNavigationMenu :collapsed="collapsed" :items="links[0]" 
            orientation="vertical" tooltip popover />

          <UNavigationMenu :collapsed="collapsed" :items="links[1]" 
            orientation="vertical" tooltip class="mt-auto" />
        </template>
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { MenuLink } from '../../types'

const open = ref(false)

const { data: menuData, pending } = await useLazyFetch<MenuLink[]>('/api/menu', {
  server: false,
  default: () => [],
  transform: async (data: MenuLink[]) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return data
  }
})

const transformMenuToNavigation = (menuItems: MenuLink[]): NavigationMenuItem[][] => {
  const mainItems: NavigationMenuItem[] = []
  const footerItems: NavigationMenuItem[] = []  

  menuItems.forEach(item => {
    const navItem: NavigationMenuItem = {
      label: item.label,
      icon: item.icon,
      to: item.to,
      onSelect: () => {
        open.value = false
      }
    }

    if (item.badge) {
      navItem.badge = item.badge
    }

    if (item.children) {
      navItem.type = 'trigger'
      navItem.children = item.children.map((child: MenuLink) => ({
        label: child.label,
        to: child.to,
        exact: child.to === '/settings',
        onSelect: () => {
          open.value = false
        }
      }))
    }

    if (item.status === 'external') {
      navItem.target = '_blank'
      footerItems.push(navItem)
    } else {
      mainItems.push(navItem)
    }
  })

  return [mainItems, footerItems]
}

const links = computed(() => {
  if (!menuData.value || menuData.value.length === 0) {
    return [[], []]
  }
  return transformMenuToNavigation(menuData.value)
})
</script>