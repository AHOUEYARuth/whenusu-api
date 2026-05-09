/* eslint-disable prettier/prettier */

import Tradition from "#models/tradition";
import { NotificationSenderService } from "./notification_sender_service.js";
import { cuid } from "@adonisjs/core/helpers";
import app from "@adonisjs/core/services/app";


export class TraditionService {
  private notificationSender: NotificationSenderService

  constructor() {
    this.notificationSender = new NotificationSenderService()
  }

  async createTradition(data: any, userId: string) {
    const tradition = new Tradition()
    tradition.title = data.title
    tradition.userId = userId
    tradition.createdBy = userId
    tradition.categoryId = data.category_id
    tradition.languageId = data.language_id
    tradition.regionId = data.region_id
    tradition.transcription = data.transcription
    tradition.informantId = data.informant_id

    if (data.cover_img) {
      const fileName = `${cuid()}.${data.cover_img.extname}`

      await data.cover_img.move(app.publicPath('uploads/traditions/img'), {
        name: fileName,
        overwrite: true,
      })

      tradition.coverImg = `/uploads/traditions/img/${fileName}`
    }

    if (data.media_url) {
      const fileName = `${cuid()}.${data.media_url.extname}`

      await data.media_url.move(app.publicPath('uploads/traditions/media'), {
        name: fileName,
        overwrite: true,
      })

      tradition.mediaUrl = `/uploads/traditions/media/${fileName}`
    }
    await tradition.save()

    // Envoi des notifications globales
    this.notificationSender.sendToAllWithRole(
      'Nouvelle tradition disponible',
      `Une nouvelle tradition intitulée "${tradition.title}" a été ajoutée.`,
      { traditionId: tradition.id }
    ).catch(console.error)

    return tradition
  }


  async updateTradition(traditionId: string, data: any) {
    const tradition = await Tradition.query().where('id', traditionId).firstOrFail()
    if (!tradition) {
      throw new Error('Informateur non trouvé')
    }
    tradition.title = data.title || tradition.title
    tradition.transcription = data.transcription || tradition.transcription
    tradition.categoryId = data.category_id || tradition.categoryId
    tradition.languageId = data.language_id || tradition.languageId
    tradition.regionId = data.region_id || tradition.regionId
    tradition.informantId = data.informant_id || tradition.informantId
    if (data.cover_img) {
      const fileName = `${cuid()}.${data.cover_img.extname}`

      await data.cover_img.move(app.publicPath('uploads/traditions/img'), {
        name: fileName,
        overwrite: true,
      })

      tradition.coverImg = `/uploads/traditions/img/${fileName}`
    }

    if (data.media_url) {
      const fileName = `${cuid()}.${data.media_url.extname}`

      await data.media_url.move(app.publicPath('uploads/traditions/media'), {
        name: fileName,
        overwrite: true,
      })

      tradition.mediaUrl = `/uploads/traditions/media/${fileName}`
    }

    await tradition.save()
    return tradition
  }

  async getTraditions(page: number = 1) {
    const traditions = await Tradition.query()
      .preload('user')
      .preload('category')
      .preload('region')
      .preload('language')
      .preload('informant')
      .paginate(page, 50)
    return traditions
  }

  async deleteTradition(traditionId: string, userId: string) {
    const tradition = await Tradition.query().where('id', traditionId).firstOrFail()
    if (!tradition) {
      throw new Error('Tradition non trouvé')
    }

    tradition.deletedBy = userId
    await tradition.save()
    await tradition.delete()
  }

  async getTradition(traditionId: string) {
    const tradition = await Tradition.query()
      .where('id', traditionId)
      .preload('user')
      .preload('category')
      .preload('region')
      .preload('language')
      .preload('informant')
      .firstOrFail()
    return tradition
  }

  async traditionFilter(filter: {
    title?: string
    categoryId?: string
    regionId?: string
    languageId?: string
  }) {
    let query = Tradition.query()
      .preload('user')
      .preload('category')
      .preload('region')
      .preload('language')
      .preload('informant')

    if (filter.title) query.whereILike('title', `%${filter.title}%`)
    if (filter.categoryId) query.where('id', filter.categoryId)
    if (filter.regionId) query.where('id', filter.regionId)
    if (filter.languageId) query.where('id', filter.languageId)

    const post = await query
    return post
  }

  async popularTraditionList() {
    const popularTradition = await Tradition.query()
      .preload('user')
      .preload('category')
      .preload('region')
      .preload('language')
      .preload('informant')
      .orderBy('favoris_count', 'desc')
    return popularTradition.slice(0, 5)
  }

  async validateTradition(traditionId: string, userId: string) {
    const tradition = await Tradition.query().where('id', traditionId).first()
    if (!tradition) throw new Error('Tradition non trouvée')
    if ((tradition.status === 'validate' )) throw new Error('Tradition déjà validée') 
    tradition.status = 'validate'
    tradition.validatedBy = userId
    await tradition.save()

    this.notificationSender.sendToAllWithRole(
      'Tradition validée',
      `La tradition "${tradition.title}" a été validée.`,
      { traditionId: tradition.id }
    ).catch(console.error)

    return tradition
  }

  async rejectTradition(traditionId: string, userId: string) {
    const tradition = await Tradition.query().where('id', traditionId).first()
    if (!tradition) throw new Error('Tradition non trouvée')
    if (tradition.status === 'rejected' || tradition.status === 'validate')
      throw new Error('Impossible de rejecter cette tradition')
    tradition.status = 'rejected'
    tradition.rejectedBy = userId
    await tradition.save()

    this.notificationSender.sendToAllWithRole(
      'Tradition rejetée',
      `La tradition "${tradition.title}" a été rejetée.`,
      { traditionId: tradition.id }
    ).catch(console.error)

    return tradition
  }

  async archiveTradition(traditionId: string, userId: string) {
    const tradition = await Tradition.query().where('id', traditionId).first()
    if (!tradition) throw new Error('Tradition non trouvée')
    if (tradition.status === 'archived') throw new Error("Impossible d'archiver cette tradition")
    tradition.status = 'archived'
    tradition.archivedBy = userId
    await tradition.save()

    this.notificationSender.sendToAllWithRole(
      'Tradition archivée',
      `La tradition "${tradition.title}" a été archivée.`,
      { traditionId: tradition.id }
    ).catch(console.error)

    return tradition
  }

  async publishTradition(traditionId: string, userId: string) {
    const tradition = await Tradition.query().where('id', traditionId).first()
    if (!tradition) throw new Error('Tradition non trouvée')
    // On suppose que "validate" et "publish" sont proches, mais on peut ajouter un statut "published" si nécessaire
    // Pour l'instant on suit la demande de "publié"
    tradition.status = 'published'
    tradition.publishedBy = userId
    await tradition.save()

    this.notificationSender.sendToAllDifferentiated({
      titleWithRole: 'Tradition publiée',
      bodyWithRole: `Une nouvelle tradition intitulée "${tradition.title}" a été publiée.`,
      titleWithoutRole: 'Nouvelle tradition',
      bodyWithoutRole: `Découvrez la tradition "${tradition.title}" qui vient d'être ajoutée !`,
      data: { traditionId: tradition.id }
    }).catch(console.error)

    return tradition
  }
}
