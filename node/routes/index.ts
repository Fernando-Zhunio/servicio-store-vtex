// import { method } from '@vtex/api'
import slugify from 'slugify'
// import { deleteStoreMasterdata } from '../resolvers/delete-store-masterdata'
// import { saveMasterdata } from '../resolvers/saveMasterdata'
import { method } from '@vtex/api'
import { json } from 'co-body'

import { getStoreMasterdata } from '../resolvers/get-store-masterdata'
import { searchMasterdata } from '../resolvers/searchMasterdata'
import { saveMasterdata } from '../resolvers/saveMasterdata'
import { validationSaveMasterdata } from '../utils/validationSaveMasterdata'
import { getStoreBindings } from '../utils/Binding'
import type { Store } from '../interfaces/store'
import { StorePerCity } from '../interfaces/store'

const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const stripTrailingSlash = (str: string) => {
  return str.endsWith('/') ? str.slice(0, -1) : str
}

export const resolvers = {
  Routes: {
    getSitemap: [
      method({
        GET: async (ctx: Context) => {
          const {
            clients: { tenant },
            vtex: { logger },
          } = ctx

          try {
            const stores: any = await searchMasterdata(null, {}, ctx).catch(
              (error) => {
                logger.error({ error, message: 'getSitemap-getStores-error' })

                return { data: ['fer'] }
              }
            )

            logger.info({ message: 'Cuenta', items: ctx.vtex.account })

            const [storeBindings] = await getStoreBindings(tenant)

            const { canonicalBaseAddress } = storeBindings
            const baseUrl =
              canonicalBaseAddress.indexOf('myvtex') === -1
                ? String(canonicalBaseAddress)
                : String(ctx.vtex.host)

            const lastMod = new Date().toISOString()
            const storesMap = `
              <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              <url>
                  <loc>https://ganacell.com</loc>
                  <lastmod>fer</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.8</priority>
               </url>
                ${stores?.data
                  .map(({ stores: storesRes, city }: any) => {
                    return storesRes
                      .filter((x: any) => x.status === true)
                      .map((store: Store) => {
                        return `<url>
                      <loc>https://${stripTrailingSlash(
                        baseUrl
                      )}/store/${Slugify(`${store.name} ${city}`)}/${String(
                          store.id
                        ).replace('1_', '')}</loc>
                      <lastmod>${lastMod}</lastmod>
                      <changefreq>daily</changefreq>
                      <priority>0.8</priority>
                   </url>`
                      })
                      .join('')
                  })
                  .join('')}
              </urlset>`

            ctx.set('Content-Type', 'text/xml')
            ctx.body = storesMap
            ctx.status = 200
          } catch (e) {
            ctx.body = e
            ctx.status = 500
          }
        },
        POST: async (_ctx: Context) => {},
      }),
    ],

    stores: [
      method({
        GET: async (ctx: Context) => {
          const {
            vtex: { logger },
          } = ctx

          try {
            const stores = await searchMasterdata(null, {}, ctx)

            logger.debug({ stores })

            ctx.set('Content-Type', 'application/json')
            ctx.body = stores
            ctx.status = 200
          } catch (e) {
            ctx.body = e
            ctx.status = 500
          }
        },
        POST: async (ctx: Context) => {
          try {
            const body = await json(ctx.req)

            validationSaveMasterdata(body)
            await saveMasterdata(null, body, ctx)
            ctx.set('Content-Type', 'application/json')
            ctx.body = { data: body, message: 'Store saved' }
            ctx.status = 201
          } catch (e) {
            ctx.set('Content-Type', 'application/json')
            ctx.body = {
              error: e.message,
            }
            ctx.status = 500
          }
        },
      }),
    ],
    getStore: method({
      GET: async (ctx: Context) => {
        try {
          const { id } = ctx.vtex.route.params

          const _id = Array.isArray(id) ? id[0] : id

          const store = await getStoreMasterdata(null, { id: _id }, ctx)

          if (!store) {
            ctx.body = 'Store not found'
            ctx.status = 404

            return
          }

          ctx.set('Content-Type', 'application/json')
          ctx.body = store
          ctx.status = 200
        } catch (e) {
          ctx.body = e
          ctx.status = 500
        }
      },
    }),
  },
}
