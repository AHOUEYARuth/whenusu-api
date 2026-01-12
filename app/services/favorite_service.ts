/* eslint-disable prettier/prettier */

import Favorite from "#models/favorite";
import Tradition from "#models/tradition";

export class FavoriteService {

  async createFavorite(data: any) {
    const favorite = new Favorite()
    let traditionQuery = Tradition.query().where('id', data.traditionId)
    const tradition = await traditionQuery.firstOrFail()
    if (!tradition) {
      throw new Error('Tradition non trouvée')
    }
    const existingFavorite = await Favorite.query().where('user_id', data.userId).andWhere('tradition_id', data.traditionId).first()
    if (existingFavorite) {
      await existingFavorite.delete()
      await traditionQuery.decrement('favoris_count')
      return "Favoris supprimé"
    }
    favorite.userId = data.userId
    favorite.traditionId = data.traditionId
    await traditionQuery.increment('favoris_count')
    await favorite.save()
    return favorite
  }


  async getFavoriteList(userId: string) {
    const favorites:Array<any> = await Favorite.query().where("user_id", userId)
    for (let i = 0 ; i < favorites.length; i++) {
       favorites[i] = await Tradition.query().where('id', favorites[i].traditionId).first()
    }
    return favorites
  }
  
 


}