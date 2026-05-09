/* eslint-disable prettier/prettier */

const AuthController = () => import('#controllers/auth_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const UserRoutes = () => {
    router.group(() => {
        router.get('/', [AuthController, 'getUsers']).use(middleware.checkPermission(['get-users'])),
        router.post('/', [AuthController, 'sendNotifStatus']),
        router.get('/:id', [AuthController, 'showUser']).use(middleware.checkPermission(['get-user-details'])),
        router.patch('/preferred-language', [AuthController, 'updateLanguage'])
    }).prefix('/users').use(middleware.auth({guards: ['api']}))
}
