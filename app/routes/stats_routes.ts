/* eslint-disable prettier/prettier */
const StatsController = () => import('#controllers/stats_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"

export const StatisticsRoutes = () => {
    router.group(() => {
        router.get('/', [StatsController, 'index']).use([middleware.checkPermission('get-global-stats')])
    }).prefix('/stats').use(middleware.auth({guards: ['api']}))
}
