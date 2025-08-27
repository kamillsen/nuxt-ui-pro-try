export interface MenuLink {
  label: string
  icon: string
  to: string
  status: 'active' | 'external'
  badge?: string
  children?: MenuLink[]
}

// Ecommerce types
export * from './ecommerce'