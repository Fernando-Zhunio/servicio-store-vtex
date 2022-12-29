// import { method } from '@vtex/api'
// import slugify from 'slugify'
// import { deleteStoreMasterdata } from '../resolvers/delete-store-masterdata'
// import { saveMasterdata } from '../resolvers/saveMasterdata'
import { method } from '@vtex/api'

import { getStoreMasterdata } from '../resolvers/get-store-masterdata'
import { searchMasterdata } from '../resolvers/searchMasterdata'
// import { getStoreBindings } from '../utils/Binding'

// const Slugify = (str: string) => {
//   return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
// }

// const stripTrailingSlash = (str: string) => {
//   return str.endsWith('/') ? str.slice(0, -1) : str
// }

export const resolvers = {
  Routes: {
    // getSitemapNovicompu: [
    //   method({
    //     GET: async (ctx: Context) => {
    //       const {
    //         clients: { tenant },
    //         vtex: { logger },
    //       } = ctx

    //       try {
    //         const stores: any = await getStores(
    //           null,
    //           {
    //             keyword: ctx.vtex.account,
    //             latitude: null,
    //             longitude: null,
    //           },
    //           ctx
    //         ).catch((error) => {
    //           logger.error({ error, message: 'getSitemap-getStores-error' })

    //           return null
    //         })

    //         logger.info({ message: 'Cuenta', items: ctx.vtex.account })

    //         const [storeBindings] = await getStoreBindings(tenant)

    //         const { canonicalBaseAddress } = storeBindings
    //         const baseUrl =
    //           canonicalBaseAddress.indexOf('myvtex') === -1
    //             ? String(canonicalBaseAddress)
    //             : String(ctx.vtex.host)

    //         const lastMod = new Date().toISOString()
    //         const storesMap = `
    //           <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    //           <url>
    //               <loc>https://ganacell.com</loc>
    //               <lastmod>fer</lastmod>
    //               <changefreq>daily</changefreq>
    //               <priority>0.8</priority>
    //            </url>
    //             ${stores?.items
    //               .filter((item: any) => {
    //                 return !!item.isActive
    //               })
    //               .map((item: any) => {
    //                 return `<url>
    //               <loc>https://${stripTrailingSlash(baseUrl)}/store/${Slugify(
    //                   `${item.name} ${item.address.state} ${item.address.postalCode}`
    //                 )}/${String(item.id).replace('1_', '')}</loc>
    //               <lastmod>${lastMod}</lastmod>
    //               <changefreq>daily</changefreq>
    //               <priority>0.8</priority>
    //            </url>`
    //               })
    //               .join('')}
    //           </urlset>`

    //         ctx.set('Content-Type', 'text/xml')
    //         ctx.body = storesMap
    //         ctx.status = 200
    //       } catch (e) {
    //         ctx.body = e
    //         ctx.status = 500
    //       }
    //     },
    //     POST: async (_ctx: Context) => {},
    //   }),
    // ],
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
