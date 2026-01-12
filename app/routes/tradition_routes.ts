/* eslint-disable prettier/prettier */
const TraditionsController = () => import('#controllers/traditions_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const TraditionRoutes = () => {
    router.group(() => {
        router.post('/', [TraditionsController, 'store']),
        router.get('/', [TraditionsController, 'index']),
        router.put('/:id', [TraditionsController, 'update']),
        router.delete('/:id', [TraditionsController, 'delete']),
        router.get('/:id', [TraditionsController, 'show']).where('id',router.matchers.uuid()),
        router.get('/popular', [TraditionsController, 'popularTradition']),
        router.post('/validate/:id', [TraditionsController, 'validateTradition']).where('id', router.matchers.uuid()),
        router.post('/reject/:id', [TraditionsController, 'rejectTradition']).where('id', router.matchers.uuid()),
        router.post('/archive/:id', [TraditionsController, 'archiveTradition']).where('id', router.matchers.uuid())
    }).prefix('/traditions').use(middleware.auth({guards: ['api']}))
    
}