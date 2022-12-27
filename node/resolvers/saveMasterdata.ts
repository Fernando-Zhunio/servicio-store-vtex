// import { sendMessageSplunk } from '../utils/sendMessageSplunk'
// import { validation } from '../utils/validation'

export async function saveMasterdata(
  _: unknown,
  saveValues: any,
  ctx: Context
) {
  // sendMessageSplunk(saveValues.saveData.type, saveValues.saveData.content, ctx)

  // validation(saveValues.saveData, false)

  return ctx.clients.getStoresFromDatamaster
    .save({
      storesPerCity: saveValues.saveData.storesPerCity,
      // name: saveValues.saveData.name,
      // operator: saveValues.saveData.operator,
      // priority: saveValues.saveData.priority,
      // simpleStatements: saveValues.saveData.simpleStatements,
      // type: saveValues.saveData.type,
    })
    .catch((e: any) => {
      ctx.vtex.logger.error({
        message: 'Error to save badge through MasterdataV2',
        name: e.name,
        exception: e.message,
      })

      return false
    })
}
