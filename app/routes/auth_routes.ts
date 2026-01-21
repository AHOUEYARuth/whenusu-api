/* eslint-disable prettier/prettier */
const AuthController = () => import('#controllers/auth_controller')
const GoogleAuthsController = () => import('#controllers/socialAuth/google_auths_controller')
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"

export const AuthRoutes = () => {
    router.group(() => {
        /**
         * @register
         * @summary créer un utilisateur
         */
        router.post('/register', [AuthController, 'register']),
        router.post('/login', [AuthController, 'login']),
        router.post('/google', [GoogleAuthsController, 'loginWithGoogle']),
        router.delete('/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] })),
        router.post('/assign-role/:id', [AuthController, 'assignRoleToUser']).use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['assign-role-to-user'])]),
        router.post('/unassign-role/:id', [AuthController, 'unassignRoleToUser']).use([middleware.auth({ guards: ['api'] }), middleware.checkPermission(['unassign-role-to-user'])]),
        router.post('/verify-user', [AuthController, 'verifyUser']),
        router.post('/verify-otp-code', [AuthController, 'verifyOtpCode']),
        router.post('/forgot-password', [AuthController, 'forgotPassword'])
        router.post('/delete-account', [AuthController, 'deleteUserAccount']).use(middleware.auth({ guards: ['api'] })),
        router.post('/update-password', [AuthController, 'updatePassword']).use(middleware.auth({ guards: ['api'] })),
        router.get('/user', [AuthController, 'userDetails']).use(middleware.auth({ guards: ['api'] })),
        router.post('/update-profile', [AuthController, 'updateUser']).use(middleware.auth({ guards: ['api']}))
    }).prefix('/auth')
}