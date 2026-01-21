/* eslint-disable prettier/prettier */

const CategoriesController = () => import('#controllers/categories_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const CategoryRoutes = () => {
    router.group(() => {
        router.post('/', [CategoriesController, 'store']).use(middleware.checkPermission(['create-category']))
        router.get('/', [CategoriesController, 'index']).use(middleware.checkPermission(['get-category'])),
        router.put('/:id', [CategoriesController, 'update']).use(middleware.checkPermission(['update-category'])),
        router.delete('/:id', [CategoriesController, 'delete']).use(middleware.checkPermission(['delete-category']))
    }).prefix('/categories').use(middleware.auth({guards: ['api']}))
}