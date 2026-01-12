/* eslint-disable prettier/prettier */

const AuthController = () => import('#controllers/auth_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const UserRoutes = () => {
    router.group(() => {
        router.get('/', [AuthController, 'getUsers']),
        router.post('/', [AuthController, 'sendNotifStatus'])
    }).prefix('/users').use(middleware.auth({guards: ['api']}))
}