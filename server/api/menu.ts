import type { MenuLink } from '../../types'

const menuItems: MenuLink[] = [{
  label: 'Dashboard',
  icon: 'i-heroicons-home',
  to: '/',
  status: 'active'
}, {
  label: 'Kullanıcılar',
  icon: 'i-heroicons-users',
  to: '/users',
  status: 'active'
}, {
  label: 'Ayarlar',
  icon: 'i-heroicons-cog-6-tooth',
  to: '/settings',
  status: 'active',
  children: [
    {
      label: 'Genel',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/settings',
      status: 'active'
    },
    {
      label: 'Güvenlik',
      icon: 'i-heroicons-shield-check',
      to: '/settings/security',
      status: 'active'
    },
    {
      label: 'Bildirimler',
      icon: 'i-heroicons-bell',
      to: '/settings/notifications',
      status: 'active'
    }
  ]
}, {
  label: 'Pinia',
  icon: 'i-heroicons-cube-transparent',
  to: '/pinia',
  status: 'active',
  children: [
    {
      label: 'Giriş',
      icon: 'i-heroicons-academic-cap',
      to: '/pinia',
      status: 'active'
    },
    {
      label: 'Temel Kullanım',
      icon: 'i-heroicons-play',
      to: '/pinia/basics',
      status: 'active'
    },
    {
      label: 'Store Oluşturma',
      icon: 'i-heroicons-building-storefront',
      to: '/pinia/stores',
      status: 'active'
    },
    {
      label: 'State Yönetimi',
      icon: 'i-heroicons-variable',
      to: '/pinia/state',
      status: 'active'
    },
    {
      label: 'Getters',
      icon: 'i-heroicons-funnel',
      to: '/pinia/getters',
      status: 'active'
    },
    {
      label: 'Actions',
      icon: 'i-heroicons-bolt',
      to: '/pinia/actions',
      status: 'active'
    },
    {
      label: 'Modülerlik',
      icon: 'i-heroicons-squares-2x2',
      to: '/pinia/modules',
      status: 'active'
    },
    {
      label: 'İleri Düzey',
      icon: 'i-heroicons-rocket-launch',
      to: '/pinia/advanced',
      status: 'active'
    },
    {
      label: 'Todo-App',
      icon: 'i-heroicons-academic-cap',
      to: '/pinia/todo-app',
      status: 'active'
    }
  ]
}, {
  label: 'Raporlar',
  icon: 'i-heroicons-chart-bar',
  to: '/reports',
  status: 'active',
  children: [
    {
      label: 'Satış Raporu',
      icon: 'i-heroicons-currency-dollar',
      to: '/reports/sales',
      status: 'active'
    },
    {
      label: 'Kullanıcı Raporu',
      icon: 'i-heroicons-user-group',
      to: '/reports/users',
      status: 'active'
    }
  ]
}]

export default eventHandler(async () => {
  return menuItems
})