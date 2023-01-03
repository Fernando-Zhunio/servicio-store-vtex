import type { SearchStoreParams } from '../interfaces/masterdata'

const PAGE_DEFAULT = 1
const PAGE_SIZE_DEFAULT = 5

export async function searchMasterdata(
  _: unknown,
  {
    page = PAGE_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    where = null,
  }: SearchStoreParams,
  ctx: Context
) {
  const info = await ctx.clients.getStoresFromDatamaster.searchRaw(
    { page, pageSize },
    ['city', 'company', 'stores'],
    '',
    where ?? `company=${ctx.vtex.account}`
  )

  return info
}
