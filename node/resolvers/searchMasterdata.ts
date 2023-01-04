import type { SearchStoreParams } from '../interfaces/masterdata'

const PAGE_DEFAULT = 1
const PAGE_SIZE_DEFAULT = 5
const PAGE_WHERE_DEFAULT = ''

export async function searchMasterdata(
  _: unknown,
  {
    page = PAGE_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    where = PAGE_WHERE_DEFAULT,
  }: SearchStoreParams,
  ctx: Context
) {
  const info = await ctx.clients.getStoresFromDatamaster.searchRaw(
    { page, pageSize },
    ['_all'],
    '',
    where
  )

  return info
}
