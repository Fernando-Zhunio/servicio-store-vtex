// import { sendMessageSplunk } from '../utils/sendMessageSplunk'
// import { validation } from '../utils/validation'

import type { Store, StorePerCity } from '../interfaces/store'
import { searchMasterdata } from './searchMasterdata'
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
export async function saveMasterdata(
  _: unknown,
  saveValues: { saveData: { city: string; store: Store } },
  ctx: Context
) {
  // sendMessageSplunk(saveValues.saveData.type, saveValues.saveData.content, ctx)

  // validation(saveValues.saveData, false)
  // const stores = await searchMasterdata(null, {}, ctx)

  // const index = searchForIdStore(
  //   stores.data,
  //   saveValues.city,
  //   saveValues.store.id
  // )

  // if (index !== -1) {
  //   stores.data.find((x) => x.city === saveValues.city).stores[index] =
  //     saveValues.store
  // }
  ctx.vtex.logger.warn({ saveValues: saveValues.saveData })

  // "8e8abfe3-86ff-11ed-83ab-126014eef27f
  const { city, store: stores } = saveValues.saveData

  // const storesForCity: unknown = city
  // 0982530072

  return ctx.clients.getStoresFromDatamaster
    .save({
      storesForCity: [
        {
          city,
          stores: [{ ...stores }],
        },
      ],
    })
    .catch((e) => {
      ctx.vtex.logger.error({
        message: 'Error to save badge through MasterdataV2',
        name: e.name,
        exception: e.message,
      })
      throw new Error(e)

      // return {
      //   Id: JSON.stringify({ storesForCity }),
      //   DocumentId: e.name,
      //   Href: JSON.stringify(e),
      // }
    })
}

// function searchForIdStore(stores: StorePerCity[], city: string, id: string) {
//   // eslint-disable-next-line @typescript-eslint/no-shadow
//   const store = stores.find((store: StorePerCity) => store.city === city)

//   if (store) {
//     // eslint-disable-next-line @typescript-eslint/no-shadow
//     return store.stores.findIndex((store: Store) => store.id === id)
//   }

//   return 0
// }
