/* eslint-disable prettier/prettier */
import { TraditionService } from '#services/tradition_service'
import { CreateTraditionValidator, messagesProviderTradition, UpdateTraditionValidator } from '#validators/tradition'
import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class TraditionsController {
  private traditionService: TraditionService

  constructor() {
    this.traditionService = new TraditionService()
  }

  /**
   *
   * @store
   * @summary Créer une tradition
   * @requestFormDataBody {"title": {"type": "string", "required": "true"}, "transcription": {"type": "string", "required": "true"}, "language_id": {"type": "string", "required": "true"}, "region_id": {"type": "string", "required": "true"}, "category_id": {"type": "string", "required": "true"}, "cover_img": {"type":"string","format":"binary", "required": "true"}, "media_url":{"type":"string","format":"binary"}}
   * @responseBody 200 - <Tradition>
   */
  public async store({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(CreateTraditionValidator, {
        messagesProvider: new SimpleMessagesProvider(messagesProviderTradition),
      })

      /* payload.cover_img = request.input('cover_img')
      payload.media_url = request.input('media_url') */

      const user = auth.user!

      const tradition = await this.traditionService.createTradition(payload, user.id)
      return response.status(200).json({
        message: 'Tradition créés avec succès',
        data: tradition,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @update
   * @summary Modifier une  tradition
   * @paramPath id - Identifiant de la tradition - @type("string") @required
   * @requestFormDataBody {"title": {"type": "string"}, "transcription": {"type": "string"}, "language_id": {"type": "string"}, "region_id": {"type": "string"}, "category_id": {"type": "string"}, "cover_img": {"type":"string","format":"binary"}, "media_url":{"type":"string","format":"binary"}}
   * @responseBody 200 - <Tradition>
   */
  public async update({ request, response, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(UpdateTraditionValidator)
      /*  const coverImg = request.input('cover_img')
      const mediaUrl = request.input('media_url') */

      const tradition = await this.traditionService.updateTradition(params.id, payload)
      return response.status(200).json({
        message: 'Tradition modifiée avec succès',
        data: tradition,
      })
    } catch (error) {
      return response.status(500).json({
        message: "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @index
   * @summary Liste des traditions
   * @responseBody 200 - <Tradition[]>
   */
  public async index({ request, response }: HttpContext) {
    try {
      const title = request.input('title')
      const categoryId = request.input('category_id')
      const regionId = request.input('region_id')
      const languageId = request.input('language_id')
      const page = request.input('page')
      if (title || categoryId || regionId || languageId) {
        const filter = { title, categoryId, regionId, languageId }
        const tradition = await this.traditionService.traditionFilter(filter)
        return response.status(200).json({
          message: 'Tradition recherchée',
          data: tradition,
        })
      } else {
        const traditions = await this.traditionService.getTraditions(page)
        return response.status(200).json({
          message: 'Liste des traditions',
          data: traditions,
        })
      }
    } catch (error) {
      return response.status(500).json({
        message: "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @delete
   * @summary Supprimer une tradition
   * @paramPath id - Identifiant de la tradition - @type("string") @required
   */
  public async delete({ response, params }: HttpContext) {
    try {
      await this.traditionService.deleteTradition(params.id)
      return response.status(200).json({
        message: 'Tradition supprimée avec succès',
      })
    } catch (error) {
      return response.status(500).json({
        message: "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @show
   * @summary Récupérer les détails d'une tradition
   * @paramPath id - Identifiant de la tradition - @type("string") @required
   * @responseBody 200 - <Tradition>
   */
  public async show({ response, params }: HttpContext) {
    try {
      const tradition = await this.traditionService.getTradition(params.id)
      return response.status(200).json({
        message: 'Détails de la tradition',
        data: tradition,
      })
    } catch (error) {
      return response.status(500).json({
        message: "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @popularTradition
   * @summary Liste des traditions populaires
   * @responseBody 200 - <Tradition>
   */
  public async popularTradition({ response }: HttpContext) {
    const popularTraditions = await this.traditionService.popularTraditionList()
    return response.status(200).json({
      message: 'Top 5 tradition',
      data: popularTraditions,
    })
  }

  /**
   *
   * @validateTradition
   * @summary Valider une tradition
   * @paramPath id - Identifiant de la tradition - @type("string") @required
   * @responseBody 200 - <Tradition>
   */
  public async validateTradition({ response, params }: HttpContext) {
    try {
      const traditionValidate = await this.traditionService.validateTradition(params.id)
      return response.status(200).json({
        message: 'Tradition validée avec succès',
        data: traditionValidate,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite lors de la validation de la tradition",
      })
    }
  }

  /**
   *
   * @rejectTradition
   * @summary Rejeter une tradition
   * @paramPath id - Identifiant de la tradition - @type("string") @required
   * @responseBody 200 - <Tradition>
   */
  public async rejectTradition({ response, params }: HttpContext) {
    try {
      const traditionRejected = await this.traditionService.rejectTradition(params.id)
      return response.status(200).json({
        message: 'Tradition rejetée avec succès',
        data: traditionRejected,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite lors du rejet de la tradition",
      })
    }
  }

  /**
   *
   * @archiveTradition
   * @summary Archiver une tradition
   * @paramPath id - Identifiant de la tradition - @type("string") @required
   * @responseBody 200 - <Tradition>
   */
  public async archiveTradition({ response, params }: HttpContext) {
    try {
      const traditionArchived = await this.traditionService.archiveTradition(params.id)
      return response.status(200).json({
        message: 'Tradition archivée avec succès',
        data: traditionArchived,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite lors de l'archivation de la tradition",
      })
    }
  }
}
