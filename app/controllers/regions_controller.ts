/* eslint-disable prettier/prettier */
import Region from '#models/region'
import { RegionService } from '#services/region_service'
import { messagesProviderRegion, RegionValidator, UpdateRegionValidator } from '#validators/region'
import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class RegionsController {
  private regionService: RegionService

  constructor() {
    this.regionService = new RegionService()
  }

  /**
   *
   * @store
   * @summary Création de région
   * @requestBody <RegionValidator>
   * @responseBody 200 - <Region>
   */
  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(RegionValidator, {
        messagesProvider: new SimpleMessagesProvider(messagesProviderRegion),
      })
      const region = await this.regionService.createRegion(payload)
      return response.status(200).json({
        message: 'Région crée avec succès',
        data: region,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite lors de la création de la région",
      })
    }
  }

  /**
   *
   * @index
   * @summary Liste de toutes les régions
   * @responseBody 200 - <Region[]>
   */
  public async index({ response }: HttpContext) {
    try {
      const regions = await this.regionService.getAllRegion()
      return response.status(200).json({
        message: 'Liste de toutes les régions',
        regions,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @update
   * @summary Modification d'une région
   * @paramPath id - Identifiant de la région à modifier - @type(string) @required
   * @requestBody <UpdateRegionValidator>
   * @responseBody 200 - <Region>
   */
  public async update({ request, response, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(UpdateRegionValidator)
      const region = await this.regionService.updateRegion(params.id, payload)
      return response.status(200).json({
        message: 'Région modifiée avec succès',
        region,
      })
    } catch (error) {
      return response.status(401).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @delete
   * @summary Suppression d'une région
   * @paramPath id - Identifiant de la région à supprimer - @type(string) @required
   */
  public async delete({ response, params }: HttpContext) {
    try {
      const language = await this.regionService.deleteRegion(params.id)
      return response.status(200).json({
        message: 'Région supprimée avec succès',
        language,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @assignLanguagesToRegion
   * @summary Assigner une langue à une région
   * @paramPath id - Identifiant de la région à laquelle l'on veut assigner la langue - @type(string) @required
   * @requestFormDataBody {"languages":{"type":"array", "required": "true", "items": {"type": "string"}}}
   * @responseBody 200 - <Region>
   */
  public async assignLanguagesToRegion({ request, response }: HttpContext) {
    const regionId = request.params().id
    const { languageId } = request.body()
    const region = await Region.query().where('id', regionId).firstOrFail()

    await region.assignLanguages(languageId)
    return response.status(200).json({
      message: 'Langue ajoutée à région',
      region,
    })
  }

  /**
   *
   * @unassignLanguagesToRegion
   * @summary Détacher une langue d'une région
   * @paramPath id - Identifiant de la région de laquelle l'on veut détcher la langue - @type(string) @required
   * @requestFormDataBody {"languages":{"type":"array", "required": "true", "items": {"type": "string"}}}
   * @responseBody 200 - <Region>
   */
  public async unassignLanguagesToRegion({ request, response }: HttpContext) {
    const regionId = request.params().id
    const { languageId } = request.body()
    const region = await Region.query().where('id', regionId).firstOrFail()

    await region.unassignLanguages(languageId)
    return response.status(200).json({
      message: 'Langue détachée de région',
      region,
    })
  }
}
