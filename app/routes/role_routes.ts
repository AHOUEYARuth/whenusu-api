/* eslint-disable prettier/prettier */
const RolesController = () => import('#controllers/roles_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const RoleRoutes = () => {
    router.group(() => {
        ;(router
          .post('/', [RolesController, 'store'])
          .use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['create-role'])]),
          router.post('/assign/:id', [RolesController, 'assignPermissionToRole'])).use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['assign-permission-to-role'])])
        router.post('/unassign/:id', [RolesController,'unassignPermissionToRole']).use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['unassign-permission-to-role'])])
    }).prefix('/roles')
}