/* eslint-disable prettier/prettier */
const PermissionsController = () => import('#controllers/permissions_controller')
import router from "@adonisjs/core/services/router"


export const PermissionRoutes = () => {
    router.group(() => {
        router.post('/', [PermissionsController, 'store'])
    }).prefix('/permissions')
}