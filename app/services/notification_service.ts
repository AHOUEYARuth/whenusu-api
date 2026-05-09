/* eslint-disable prettier/prettier */
import Notification from '#models/notification'

export class NotificationService {
  public async getNotifications(userId: string, page: number = 1) {
    return await Notification.query().where('userId', userId).orderBy('createdAt', 'desc').paginate(page, 20)
  }

  public async getNotification(id: string, userId: string) {
    return await Notification.query().where('id', id).where('userId', userId).firstOrFail()
  }

  public async createNotification(payload: any) {
    return await Notification.create(payload)
  }

  public async updateNotification(id: string, userId: string, payload: any) {
    const notification = await this.getNotification(id, userId)
    notification.merge(payload)
    await notification.save()
    return notification
  }

  public async deleteNotification(id: string, userId: string) {
    const notification = await this.getNotification(id, userId)
    await notification.delete()
  }

  public async markAsRead(id: string, userId: string) {
    const notification = await this.getNotification(id, userId)
    notification.read = true
    await notification.save()
    return notification
  }

  public async markAllAsRead(userId: string) {
    await Notification.query().where('userId', userId).where('read', false).update({ read: true })
  }

  public async bulkDelete(ids: string[], userId: string) {
    await Notification.query().whereIn('id', ids).where('userId', userId).delete()
  }
}
