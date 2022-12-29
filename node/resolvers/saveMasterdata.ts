/*
mutation{
  saveMasterdata(saveData:{store:{
    id: "001"
    name: "tienda test"
    schedules: "Horario de test"
    address: "direccion de test"
    latitude: "latitud de test"
    longitude: "longitud de test"
    status: "status de test"
  }, city: "guayaquil"})
  {
    Id
    DocumentId
    Href
  }
}
*/
import type { Stores } from 'novicompu.service-stores'

import { getStoreMasterdata } from './get-store-masterdata'

export async function saveMasterdata(
  _: unknown,
  saveValues: { saveData: { city: string; store: Stores } },
  ctx: Context
) {
  try {
    const { city, store: stores } = saveValues.saveData
    const cityStores: any = await getStoreMasterdata(null, { id: city }, ctx)

    if (!cityStores) {
      const data = await saveStoreNow({ city, stores: [stores] }, ctx)

      return data
    }

    const storeIndex = cityStores.stores.findIndex(
      (x: any) => x.id === stores.id
    )

    if (storeIndex === -1) {
      cityStores.stores.push(stores)
    } else {
      cityStores.stores[storeIndex] = stores
    }

    const data = await saveStoreNow({ city, stores: cityStores.stores }, ctx)

    return data
  } catch (e) {
    return {
      Id: null,
      DocumentId: e.message,
      Href: null,
    }
  }
}

async function saveStoreNow(
  { city, stores }: { city: string; stores: any[] },
  ctx: Context
) {
  const data = await ctx.clients.getStoresFromDatamaster.saveOrUpdate({
    city,
    company: ctx.vtex.account,
    stores,
    id: city,
  })

  return data
}
