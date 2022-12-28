export interface Store {
  id: string
  name: string
  schedules: string
  address: string
  latitude: string
  longitude: string
  status: boolean
}

export interface StorePerCity {
  city: string
  stores: Store[]
}
