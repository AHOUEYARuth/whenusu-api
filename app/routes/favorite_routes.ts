/* eslint-disable prettier/prettier */

const FavoritesController = () => import('#controllers/favorites_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"

export const FavoriteRoute = () => {
    router.group(() => {
        router.post('/:id', [FavoritesController, 'store']),
        router.get('/', [FavoritesController, 'listFavorites'])
      }).prefix('favorites').use(middleware.auth({guards: ['api']}))
}