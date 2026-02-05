/* eslint-disable prettier/prettier */
const PermissionsController = () => import('#controllers/permissions_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const PermissionRoutes = () => {
    router.group(() => {
        router.post('/', [PermissionsController, 'store']).use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['create-permission'])])
        router.get('/', [PermissionsController, 'getPermissions']).use([middleware.auth({ guards: ['api'] })])
    }).prefix('/permissions')
}