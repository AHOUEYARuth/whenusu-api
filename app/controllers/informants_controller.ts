/* eslint-disable prettier/prettier */

import type { HttpContext } from '@adonisjs/core/http'

import { InformantService } from '#services/informant_service'
import { CreateInformantValidator, messageProviderInformant, UpdateInformantValidator } from '#validators/informant'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class InformantsController {
  private informantService: InformantService

  constructor() {
    this.informantService = new InformantService()
  }

  /**
   *
   * @store
   * @summary Création d'un informateur
   * @requestFormDataBody {"name": {"type": "string", "required": "true"}, "phoneNumber": {"type": "string", "required":"true"}, "avatar_url": {"type": "string","format":"binary"}}
   * @responseBody 200 - <Informant>
   *
   */
  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(CreateInformantValidator, {
        messagesProvider: new SimpleMessagesProvider(messageProviderInformant),
      })
      const avatarUrl = request.input('avatar_url')
      const informant = await this.informantService.createInformant(payload, avatarUrl)
      return response.status(200).json({
        message: 'Informateur créé avec succès',
        data: informant,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @update
   * @summary Modifier un informateur
   * @paramPath id - Identifiant de l'informateur - @type("string") @required
   * @requestFormDataBody {"name": {"type": "string"}, "phoneNumber": {"type": "string"}, "avatar_url": {"type": "string", "format":"binary"}}
   * @responseBody 200 - <Informant>
   */
  public async update({ request, response, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(UpdateInformantValidator)
      const avatarUrl = await request.input('avatar_url')
      const informant = await this.informantService.updateInformant(params.id, payload, avatarUrl)
      return response.status(200).json({
        message: 'Iformateur modifié avec succès',
        data: informant,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   * 
   * @index 
   * @summary Liste des informateurs 
   * @responseBody 200 - <Informant[]>
   */
  public async index({ response }: HttpContext) {
    try {
      const informants = await this.informantService.getInformants()
      return response.status(200).json({
        message: 'Liste des informateurs',
        data: informants,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite",
      })
    }
  }

  /**
   * 
   * @delete 
   * @summary Supprimer un informateur 
   * @paramPath id - Identifiant de l'informateur - @type("string") @required
   * 
   */
  public async delete({ response, params }: HttpContext) {
    await this.informantService.deleteInformant(params.id)
    return response.status(200).json({
      message: 'Informateurs supprimé avec succès',
    })
  }
}
