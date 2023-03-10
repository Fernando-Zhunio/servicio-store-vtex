import { IOClients } from '@vtex/api'
import { masterDataFor } from '@vtex/clients'
import type { Stores } from 'novicompu.service-stores'

// import type { StorePerCity } from '../interfaces/store'
import RequestHub from '../utils/Hub'
import Sitemap from '../utils/Sitemap'
// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get hub() {
    return this.getOrSet('hub', RequestHub)
  }

  public get sitemap() {
    return this.getOrSet('sitemap', Sitemap)
  }

  public get getStoresFromDatamaster() {
    return this.getOrSet('stores', masterDataFor<Stores>('stores'))
  }
}
