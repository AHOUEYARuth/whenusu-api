/* eslint-disable prettier/prettier */

import Informant from '#models/informant'
import { cuid } from '@adonisjs/core/helpers'

export class InformantService {
  async createInformant(data: any, avatarUrl?: any) {
    const informant = new Informant()
    informant.name = data.name
    informant.phoneNumber = data.phoneNumber

    if (avatarUrl) {
      const fileName = `${cuid()}.${avatarUrl.extname}`

      await avatarUrl.move('uploads/avatars', {
        name: fileName,
        overwrite: true,
      })

      informant.avatarUrl = `/uploads/avatars/${fileName}`
    }
    await informant.save()
    return informant
  }

  async updateInformant(informantId: string, data: any, avatarUrl?: any) {
    const informant = await Informant.query().where('id', informantId).firstOrFail()

    if (!informant) {
      throw new Error('Informateur non trouvé')
    }

    informant.name = data.name || informant.name
    informant.phoneNumber = data.phoneNumber || informant.avatarUrl
     if (avatarUrl) {
       const fileName = `${cuid()}.${avatarUrl.extname}`

       await avatarUrl.move('uploads/avatars', {
         name: fileName,
         overwrite: true,
       })

       informant.avatarUrl = `/uploads/avatars/${fileName}`
     }
    await informant.save()
    return informant
  }

  async getInformants() {
    const informants = await Informant.all()
    return informants
  }

  async deleteInformant(informantId: string) {
    const informant = await Informant.query().where('id', informantId).firstOrFail()
    await informant.delete()
  }
}
