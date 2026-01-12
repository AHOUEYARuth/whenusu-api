/* eslint-disable prettier/prettier */
import { FavoriteService } from '#services/favorite_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class FavoritesController {
  private favoriteService: FavoriteService

  constructor() {
    this.favoriteService = new FavoriteService()
  }

  /**
   *
   * @store
   * @summary Mettre une tradition en favoris
   * @paramPath id - Identifiant de la tradition - @type("string") @required
   * @responseBody 200 - <Tradition>
   */
  public async store({ response, auth, params }: HttpContext) {
    try {
      const data = {
        traditionId: params.id,
        userId: auth.user?.id,
      }
      const favorite = await this.favoriteService.createFavorite(data)
      if (typeof favorite === 'string') {
        return response.status(200).json({
          message: favorite,
        })
      } else {
        return response.status(200).json({
          message: 'tradition mise en favoris avec succès',
          data: favorite,
        })
      }
    } catch (error) {
      console.log('errrer')
      console.log(error)

      return response.status(500).json({
        message: "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @listFavorites
   * @summary Listes des traditions en favoris
   * @responseBody 200 - <Tradition>
   */
  public async listFavorites({ response, auth }: HttpContext) {
    try {
      const traditions = await this.favoriteService.getFavoriteList(auth.user!.id)
      return response.status(200).json({
        message: 'liste des traditions ajoutées en favoris',
        data: traditions,
      })
    } catch (error) {
      console.log('erreurr')
      console.log(error)
      return response.status(500).json({
        message: "Une erreur s'est produiteeeeeeeee",
      })
    }
  }
}
