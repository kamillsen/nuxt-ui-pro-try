export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  addresses: Address[]
  createdAt: string
}

export interface Address {
  id: number
  title: string
  line1: string
  city: string
  country: string
  postalCode: string
}