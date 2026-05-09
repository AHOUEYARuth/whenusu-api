/* eslint-disable prettier/prettier */
import { NotificationService } from '#services/notification_service'
import {
  BulkDeleteNotificationValidator,
  CreateNotificationValidator,
  messagesProviderNotification,
  UpdateNotificationValidator,
} from '#validators/notification'
import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class NotificationsController {
  private notificationService: NotificationService

  constructor() {
    this.notificationService = new NotificationService()
  }

  /**
   * @index
   * @summary Liste des notifications de l'utilisateur
   * @responseBody 200 - <Notification[]>
   */
  public async index({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const page = request.input('page', 1)
      const notifications = await this.notificationService.getNotifications(user.id, page)
      return response.status(200).json({
        message: 'Liste des notifications',
        data: notifications,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Erreur lors de la récupération des notifications",
      })
    }
  }

  /**
   * @show
   * @summary Détails d'une notification
   * @paramPath id - Identifiant de la notification - @type(string) @required
   * @responseBody 200 - <Notification>
   */
  public async show({ response, params, auth }: HttpContext) {
    try {
      const user = auth.user!
      const notification = await this.notificationService.getNotification(params.id, user.id)
      return response.status(200).json({
        message: 'Détails de la notification',
        data: notification,
      })
    } catch (error) {
      return response.status(404).json({
        message: "Notification non trouvée",
      })
    }
  }

  /**
   * @store
   * @summary Création d'une notification
   * @requestBody <CreateNotificationValidator>
   * @responseBody 201 - <Notification>
   */
  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(CreateNotificationValidator, {
        messagesProvider: new SimpleMessagesProvider(messagesProviderNotification),
      })
      const notification = await this.notificationService.createNotification(payload)
      return response.status(201).json({
        message: 'Notification créée avec succès',
        data: notification,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.messages || "Erreur lors de la création de la notification",
      })
    }
  }

  /**
   * @update
   * @summary Modification d'une notification
   * @paramPath id - Identifiant de la notification - @type(string) @required
   * @requestBody <UpdateNotificationValidator>
   * @responseBody 200 - <Notification>
   */
  public async update({ request, response, params, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(UpdateNotificationValidator)
      const user = auth.user!
      const notification = await this.notificationService.updateNotification(params.id, user.id, payload)
      return response.status(200).json({
        message: 'Notification modifiée avec succès',
        data: notification,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.messages || "Erreur lors de la modification de la notification",
      })
    }
  }

  /**
   * @destroy
   * @summary Suppression d'une notification
   * @paramPath id - Identifiant de la notification - @type(string) @required
   */
  public async destroy({ response, params, auth }: HttpContext) {
    try {
      const user = auth.user!
      await this.notificationService.deleteNotification(params.id, user.id)
      return response.status(200).json({
        message: 'Notification supprimée avec succès',
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message || "Erreur lors de la suppression de la notification",
      })
    }
  }

  /**
   * @markAsRead
   * @summary Marquer une notification comme lue
   * @paramPath id - Identifiant de la notification - @type(string) @required
   */
  public async markAsRead({ response, params, auth }: HttpContext) {
    try {
      const user = auth.user!
      const notification = await this.notificationService.markAsRead(params.id, user.id)
      return response.status(200).json({
        message: 'Notification marquée comme lue',
        data: notification,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message || "Erreur lors du marquage de la notification",
      })
    }
  }

  /**
   * @markAllAsRead
   * @summary Marquer toutes les notifications comme lues
   */
  public async markAllAsRead({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      await this.notificationService.markAllAsRead(user.id)
      return response.status(200).json({
        message: 'Toutes les notifications ont été marquées comme lues',
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Erreur lors du marquage des notifications",
      })
    }
  }

  /**
   * @bulkDelete
   * @summary Suppression de plusieurs notifications
   * @requestBody <BulkDeleteNotificationValidator>
   */
  public async bulkDelete({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(BulkDeleteNotificationValidator)
      const user = auth.user!
      await this.notificationService.bulkDelete(payload.ids, user.id)
      return response.status(200).json({
        message: 'Notifications supprimées avec succès',
      })
    } catch (error) {
      return response.status(400).json({
        message: error.messages || "Erreur lors de la suppression des notifications",
      })
    }
  }
}
