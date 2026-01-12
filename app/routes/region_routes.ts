/* eslint-disable prettier/prettier */

const RegionsController = () => import('#controllers/regions_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const RegionRoutes = () => {
  router
    .group(() => {
        router.post('/', [RegionsController, 'store']),
        router.get('/', [RegionsController, 'index']),
        router.put('/:id', [RegionsController, 'update']),
        router.delete('/:id', [RegionsController, 'delete']),
        router.post('/assign/:id', [RegionsController, 'assignLanguagesToRegion']),
        router.post('/unassign/:id', [RegionsController, 'unassignLanguagesToRegion'])
    })
    .prefix('regions').use(middleware.auth({ guards: ['api'] }))
}
