import { StatService } from '#services/stat_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class StatsController {
  private statService: StatService

  constructor() {
    this.statService = new StatService()
  }

  /**
   * @index
   * @summary Récupérer les statistiques globales
   * @description Retourne le nombre total de traditions, utilisateurs, langues, régions, ainsi que les traditions par statut.
   * @responseBody 200 - { "totalTradition": "number", "totalUser": "number", "totalLanguage": "number", "totalRegion": "number", "totalTraditionPending": "number", "totalTraditionValidated": "number", "totalTraditionRejected": "number" }
   */
  public async index({ response }: HttpContext) {
    try {
      const stats = await this.statService.globalStats()
      return response.status(200).json({
        message: 'Statistiques récupérées avec succès',
        data: stats,
      })
    } catch (error) {
      return response.status(500).json({
        message: "Une erreur s'est produite lors de la récupération des statistiques",
        error: error.message,
      })
    }
  }
}