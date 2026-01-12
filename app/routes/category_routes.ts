/* eslint-disable prettier/prettier */

const CategoriesController = () => import('#controllers/categories_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const CategoryRoutes = () => {
    router.group(() => {
        router.post('/', [CategoriesController, 'store']),
        router.get('/', [CategoriesController, 'index']),
        router.put('/:id', [CategoriesController, 'update']),
        router.delete('/:id', [CategoriesController, 'delete'])
    }).prefix('/categories').use(middleware.auth({guards: ['api']}))
}