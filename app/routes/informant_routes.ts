/* eslint-disable prettier/prettier */
const InformantsController = ()=> import("#controllers/informants_controller")
import { middleware } from "#start/kernel"
import router from "@adonisjs/core/services/router"


export const InformantRoutes = () => {
    router.group(() => {
        router.post('/', [InformantsController, 'store'])/* .use(middleware.checkPermission(['create-informant'])), */
            router.get('/', [InformantsController, 'index'])/* .use, */
            router.put('/:id', [InformantsController, 'update'])/* .use(middleware.checkPermission(['update-informant'])), */
            router.delete('/:id', [InformantsController, 'delete'])/* .use(middleware.checkPermission(['delete-informant'])) */
    }).prefix('/informants').use(middleware.auth({guards: ['api']}))
}