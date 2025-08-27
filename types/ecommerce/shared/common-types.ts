export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  visible?: boolean
}

export interface SortOption {
  key: string
  direction: 'asc' | 'desc'
}

export interface FilterOption {
  key: string
  value: any
  operator?: 'eq' | 'like' | 'in' | 'gt' | 'lt'
}