/* eslint-disable prettier/prettier */
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const NotificationsController = () => import('#controllers/notifications_controller')

export const NotificationRoutes = () => {
  router
    .group(() => {
      router.get('/', [NotificationsController, 'index'])
      router.get('/:id', [NotificationsController, 'show']).where('id', router.matchers.uuid())
      // router.post('/', [NotificationsController, 'store'])
      // router.put('/:id', [NotificationsController, 'update']).where('id', router.matchers.uuid())
      router.delete('/:id', [NotificationsController, 'destroy']).where('id', router.matchers.uuid())
      
      router.patch('/:id/read', [NotificationsController, 'markAsRead']).where('id', router.matchers.uuid())
      router.patch('/mark-all-read', [NotificationsController, 'markAllAsRead'])
      router.post('/bulk-delete', [NotificationsController, 'bulkDelete'])
    })
    .prefix('/notifications')
    .use(middleware.auth())
}
