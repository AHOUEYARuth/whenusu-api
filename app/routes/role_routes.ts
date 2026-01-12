/* eslint-disable prettier/prettier */
const RolesController = () => import('#controllers/roles_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const RoleRoutes = () => {
    router.group(() => {
        ;(router
          .post('/', [RolesController, 'store'])
          .use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['create-role'])]),
          router.post('/assign/:id', [RolesController, 'assignPermissionToRole']))
        router.post('/unassign/:id', [RolesController,'unassignPermissionToRole'])
    }).prefix('/roles')
}