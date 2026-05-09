/* eslint-disable prettier/prettier */
import User from '#models/user'
import Notification from '#models/notification'
import admin from '#config/firebase'

export class NotificationSenderService {
  /**
   * Envoie une notification à tous les utilisateurs ayant au moins un rôle
   */
  public async sendToAllWithRole(title: string, body: string, data?: any) {
    const users = await User.query().preload('roles')
    
    if (users.length === 0) return

    const fcmTokens: string[] = []
    const dbNotifications: any[] = []

    users.forEach((user) => {
      if (user.sendNotif && user.roles.length > 0) {
        if (user.fcmToken) {
          fcmTokens.push(user.fcmToken)
        }
        dbNotifications.push({
          userId: user.id,
          title: title,
          description: body,
          read: false,
        })
      }
    })

    // Création des notifications en base de données
    if (dbNotifications.length > 0) {
      await Notification.createMany(dbNotifications)
    }

    // Envoi des push via Firebase (par paquets de 500)
    if (fcmTokens.length > 0) {
      for (let i = 0; i < fcmTokens.length; i += 500) {
        const batch = fcmTokens.slice(i, i + 500)
        try {
          await admin.messaging().sendEachForMulticast({
            tokens: batch,
            notification: {
              title: title,
              body: body,
            },
            data: data
          })
        } catch (error) {
          console.error("Erreur lors de l'envoi multicast Firebase:", error)
        }
      }
    }
  }

  /**
   * Envoie une notification à tous les utilisateurs avec un contenu différent selon s'ils ont un rôle ou non
   */
  public async sendToAllDifferentiated(params: {
    titleWithRole: string
    bodyWithRole: string
    titleWithoutRole: string
    bodyWithoutRole: string
    data?: any
  }) {
    const users = await User.query().preload('roles')
    if (users.length === 0) return

    const fcmTokensWithRole: string[] = []
    const fcmTokensWithoutRole: string[] = []
    const dbNotifications: any[] = []

    users.forEach((user) => {
      if (user.sendNotif) {
        const hasRole = user.roles.length > 0
        const title = hasRole ? params.titleWithRole : params.titleWithoutRole
        const body = hasRole ? params.bodyWithRole : params.bodyWithoutRole

        if (user.fcmToken) {
          if (hasRole) fcmTokensWithRole.push(user.fcmToken)
          else fcmTokensWithoutRole.push(user.fcmToken)
        }

        dbNotifications.push({
          userId: user.id,
          title: title,
          description: body,
          read: false,
        })
      }
    })

    // Création des notifications en base de données
    if (dbNotifications.length > 0) {
      await Notification.createMany(dbNotifications)
    }

    // Envoi des push Firebase pour les utilisateurs avec rôle
    await this.sendBatchPush(fcmTokensWithRole, params.titleWithRole, params.bodyWithRole, params.data)

    // Envoi des push Firebase pour les utilisateurs sans rôle
    await this.sendBatchPush(fcmTokensWithoutRole, params.titleWithoutRole, params.bodyWithoutRole, params.data)
  }

  private async sendBatchPush(tokens: string[], title: string, body: string, data?: any) {
    if (tokens.length === 0) return

    for (let i = 0; i < tokens.length; i += 500) {
      const batch = tokens.slice(i, i + 500)
      try {
        await admin.messaging().sendEachForMulticast({
          tokens: batch,
          notification: { title, body },
          data: data
        })
      } catch (error) {
        console.error("Erreur lors de l'envoi multicast Firebase:", error)
      }
    }
  }
}
