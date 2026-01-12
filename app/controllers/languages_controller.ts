/* eslint-disable prettier/prettier */
import { LanguageService } from '#services/language_service'
import { CreateLanguageValidator, messagesProviderLanguage, UpdateLanguageValidator } from '#validators/language'
import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class LanguagesController {
  private languageService: LanguageService

  constructor() {
    this.languageService = new LanguageService()
  }

  /**
   *
   * @store
   * @summary création de langue
   * @responseBody 200 - <Language>
   * @requestBody <CreateLanguageValidator>
   */

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(CreateLanguageValidator, {
        messagesProvider: new SimpleMessagesProvider(messagesProviderLanguage),
      })

      const language = await this.languageService.createLanguage(payload)

      return response.status(200).json({
        message: 'Langue créer avec succès',
        data: language,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite ",
      })
    }
  }

  /**
   *
   * @index
   * @summary Liste de toutes les langues
   * @responseBody 200 - <Language[]>
   */
  public async index({ response }: HttpContext) {
    try {
      const languages = await this.languageService.getAllLanguage()
      return response.status(200).json({
        message: 'Listes de toutes les langues',
        languages,
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
   * @summary Modification d'une langue
   * @paramPath id - Identifiant de la langue à modifier - @type(string) @required
   * @requestBody <UpdateLanguageValidator>
   * @responseBody 200 - <Language>
   */
  public async update({ request, response, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(UpdateLanguageValidator)
      const language = await this.languageService.updateLanguage(params.id, payload)

      return response.status(200).json({
        message: 'Langue modifiée avec succès',
        data: language,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @delete
   * @summary Suppression d'une langue
   * @paramPath id - Identifiant de la langue à supprimer - @type(string) @required
   */
  public async delete({ response, params }: HttpContext) {
    try {
      await this.languageService.deleteLanguage(params.id)
      return response.status(200).json({
        message: 'Langue supprimée avec succès',
      })
    } catch (error) {
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite",
      })
    }
  }
}
