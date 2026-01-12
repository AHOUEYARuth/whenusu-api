/* eslint-disable prettier/prettier */
const InformantsController = ()=> import("#controllers/informants_controller")
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const InformantRoutes = () => {
    router.group(() => {
        router.post('/', [InformantsController, 'store']),
            router.get('/', [InformantsController, 'index']),
            router.put('/:id', [InformantsController, 'update']),
            router.delete('/:id', [InformantsController, 'delete'])
    }).prefix('/informants').use(middleware.auth({guards: ['api']}))
}