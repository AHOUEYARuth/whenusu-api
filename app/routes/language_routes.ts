/* eslint-disable prettier/prettier */

const LanguagesController = () => import ('#controllers/languages_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const LanguageRoutes = () => {
  router
    .group(() => {
        router.post('/', [LanguagesController, 'store']).use(middleware.checkPermission(['create-language'])),
        router.get('/', [LanguagesController, 'index']).use(middleware.checkPermission(['get-language'])),
        router.put('/:id', [LanguagesController, 'update']).use(middleware.checkPermission(['update-language'])),
        router.delete('/:id', [LanguagesController, 'delete']).use(middleware.checkPermission(['delete-language']))
    })
    .prefix('/languages')
    .use(middleware.auth({ guards: ['api'] }))
}
