/* eslint-disable prettier/prettier */

const RegionsController = () => import('#controllers/regions_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const RegionRoutes = () => {
  router
    .group(() => {
        router.post('/', [RegionsController, 'store'])/* .use(middleware.checkPermission(['create-region'])), */
        router.get('/', [RegionsController, 'index'])/* .use(middleware.checkPermission(['get-region'])), */
        router.put('/:id', [RegionsController, 'update'])/* .use(middleware.checkPermission(['update-region'])), */
        router.delete('/:id', [RegionsController, 'delete'])/* .use(middleware.checkPermission(['delete-region'])), */
        router.post('/assign/:id', [RegionsController, 'assignLanguagesToRegion'])/* .use(middleware.checkPermission(['assign-language-to-region'])), */
        router.post('/unassign/:id', [RegionsController, 'unassignLanguagesToRegion'])/* .use(middleware.checkPermission(['unassign-language-to-region'])) */
    })
    .prefix('regions').use(middleware.auth({ guards: ['api'] }))
}
