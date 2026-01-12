/* eslint-disable prettier/prettier */

import Tradition from "#models/tradition";
import { cuid } from "@adonisjs/core/helpers";


export class TraditionService {
  async createTradition(data: any, userId: string) {
    const tradition = new Tradition()
    tradition.title = data.title
    tradition.userId = userId
    tradition.categoryId = data.category_id
    tradition.languageId = data.language_id
    tradition.regionId = data.region_id
    tradition.transcription = data.transcription
    tradition.informantId = data.informant_id

    if (data.cover_img) {
      const fileName = `${cuid()}.${data.cover_img.extname}`

      await data.cover_img.move('uploads/traditions/img', {
        name: fileName,
        overwrite: true,
      })

      tradition.coverImg = `/uploads/traditions/img/${fileName}`
    }

    if (data.media_url) {
      const fileName = `${cuid()}.${data.media_url.extname}`

      await data.media_url.move('uploads/traditions/media', {
        name: fileName,
        overwrite: true,
      })

      tradition.mediaUrl = `/uploads/traditions/media/${fileName}`
    }
    await tradition.save()
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

      await data.cover_img.move('uploads/traditions/img', {
        name: fileName,
        overwrite: true,
      })

      tradition.coverImg = `/uploads/traditions/img/${fileName}`
    }

    if (data.media_url) {
      const fileName = `${cuid()}.${data.media_url.extname}`

      await data.media_url.move('uploads/traditions/media', {
        name: fileName,
        overwrite: true,
      })

      tradition.mediaUrl = `/uploads/traditions/media/${fileName}`
    }

    await tradition.save()
    return tradition
  }

  async getTraditions(page:number = 1) {
    const traditions = await Tradition.query().paginate(page,4);
    return traditions
  }

  async deleteTradition(traditionId: string) {
    const tradition = await Tradition.query().where('id', traditionId).firstOrFail()
    if (!tradition) {
      throw new Error('Tradition non trouvé')
    }

    await tradition.delete()
  }

  async getTradition(traditionId: string) {
    const tradition = await Tradition.query().where('id', traditionId).firstOrFail()
    return tradition
  }

  async traditionFilter(filter: {
    title?: string
    categoryId?: string
    regionId?: string
    languageId?: string
  }) {
    let query = Tradition.query()

    if (filter.title) query.whereILike('title', `%${filter.title}%`)
    if (filter.categoryId) query.where('id', filter.categoryId)
    if (filter.regionId) query.where('id', filter.regionId)
    if (filter.languageId) query.where('id', filter.languageId)

    const post = await query
    return post
  }

  async popularTraditionList() {
    const popularTradition = await Tradition.query().orderBy('favoris_count', 'desc')
    return popularTradition.slice(0, 5)
  }

  async validateTradition(traditionId: string) {
    const tradition = await Tradition.query().where('id', traditionId).first()
    if (!tradition) throw new Error('Tradition non trouvée')
    if ((tradition.status === 'validate' )) throw new Error('Tradition déjà validée') 
    tradition.status = 'validate'
    await tradition.save()
    return tradition
  }

  async rejectTradition(traditionId: string) {
    const tradition = await Tradition.query().where('id', traditionId).first()
    if (!tradition) throw new Error('Tradition non trouvée')
    if (tradition.status === 'rejected' || tradition.status === 'validate')
      throw new Error('Impossible de rejecter cette tradition')
    tradition.status = 'rejected'
    await tradition.save()
    return tradition
  }

  async archiveTradition(traditionId: string) {
    const tradition = await Tradition.query().where('id', traditionId).first()
    if (!tradition) throw new Error('Tradition non trouvée')
    if (tradition.status === 'archived') throw new Error("Impossible d'archiver cette tradition")
    tradition.status = 'archived'
    await tradition.save()
    return tradition
  }
}