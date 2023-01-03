/*
mutation{
  saveMasterdata(saveData:{store:{
    id: "001"
    name: "tienda test"
    schedules: [
      {
        dayOfWeek: "0"
        openingTime: "10:00"
        closingTime: "20:00"
      },
      {
        dayOfWeek: "1"
        openingTime: "10:00"
        closingTime: "20:00"
      },
      {
        dayOfWeek: "2"
        openingTime: "10:00"
        closingTime: "20:00"
      }
    ]
    address: "direccion de test"
    latitude: "latitud de test"
    longitude: "longitud de test"
    status: true
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
    throw new Error(e)
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
    id: `${ctx.vtex.account}-${city}`,
  })

  return data
}
