import type { SearchStoreParams } from '../interfaces/masterdata'

const PAGE_DEFAULT = 1
const PAGE_SIZE_DEFAULT = 5
const WHERE_DEFAULT = ''

export async function searchMasterdata(
  _: unknown,
  {
    page = PAGE_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    where = WHERE_DEFAULT,
  }: SearchStoreParams,
  ctx: Context
) {
  const info = await ctx.clients.getStoresFromDatamaster.searchRaw(
    { page, pageSize },
    ['city', 'company', 'stores'],
    '',
    where
  )

  ctx.vtex.logger.debug({ zhunioInfo: info })

  return info
}
