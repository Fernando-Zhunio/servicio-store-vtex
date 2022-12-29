export async function deleteStoreMasterdata(
  _: unknown,
  { id }: { id: string },
  ctx: Context
) {
  try {
    const info = await ctx.clients.getStoresFromDatamaster.delete(id)

    ctx.vtex.logger.debug({ zhunioInfo: info })

    return {
      message: 'Store deleted',
      id,
      status: info.status,
    }
  } catch (error) {
    return {
      message: 'Store not deleted',
      id,
      status: error.status,
    }
  }
}
