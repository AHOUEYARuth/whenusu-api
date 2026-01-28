/* eslint-disable prettier/prettier */
const TraditionsController = () => import('#controllers/traditions_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const TraditionRoutes = () => {
    router.group(() => {
        router.post('/', [TraditionsController, 'store'])/* .use(middleware.checkPermission(['create-tradition'])), */
        router.get('/', [TraditionsController, 'index'])/* .use(middleware.checkPermission(['get-tradition'])), */
        router.put('/:id', [TraditionsController, 'update'])/* .use(middleware.checkPermission(['update-tradition'])), */
        router.delete('/:id', [TraditionsController, 'delete'])/* .use(middleware.checkPermission(['delete-tradition'])), */
        router.get('/:id', [TraditionsController, 'show']).where('id',router.matchers.uuid())/* .use(middleware.checkPermission(['get-tradition-by-id'])) */,
        router.get('/popular', [TraditionsController, 'popularTradition'])/* .use(middleware.checkPermission(['get-popular-tradition'])), */
        router.post('/validate/:id', [TraditionsController, 'validateTradition']).where('id', router.matchers.uuid())/* .use(middleware.checkPermission(['validate-tradition'])), */
        router.post('/reject/:id', [TraditionsController, 'rejectTradition']).where('id', router.matchers.uuid())/* .use(middleware.checkPermission(['reject-tradition'])), */
        router.post('/archive/:id', [TraditionsController, 'archiveTradition']).where('id', router.matchers.uuid())/* .use(middleware.checkPermission(['archive-tradition'])) */
    }).prefix('/traditions').use(middleware.auth({guards: ['api']}))
    
}