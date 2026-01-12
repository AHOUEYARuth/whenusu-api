/* eslint-disable prettier/prettier */

const LanguagesController = () => import ('#controllers/languages_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

export const LanguageRoutes = () => {
  router
    .group(() => {
        router.post('/', [LanguagesController, 'store']),
        router.get('/', [LanguagesController, 'index']),
        router.put('/:id', [LanguagesController, 'update']),
        router.delete('/:id', [LanguagesController, 'delete'])
    })
    .prefix('/languages')
    .use(middleware.auth({ guards: ['api'] }))
}
