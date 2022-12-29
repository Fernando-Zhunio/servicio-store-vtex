export async function getStoreMasterdata(
  _: unknown,
  { id }: { id: string },
  ctx: Context
) {
  const info = await ctx.clients.getStoresFromDatamaster.get(id, [
    'city',
    'company',
    'stores',
  ])

  return info
}
