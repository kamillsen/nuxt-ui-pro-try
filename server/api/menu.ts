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