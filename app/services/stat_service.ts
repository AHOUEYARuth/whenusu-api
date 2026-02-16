import Tradition from '#models/tradition'
import User from '#models/user'
import Language from '#models/language'
import Region from '#models/region'

export class StatService {
  async globalStats() {
    const totalTraditionResult = await Tradition.query().count('* as total')
    const totalUserResult = await User.query().count('* as total')
    const totalLanguageResult = await Language.query().count('* as total')
    const totalRegionResult = await Region.query().count('* as total')

    const traditionsPendingResult = await Tradition.query().where('status', 'pending').count('* as total')
    const traditionsValidatedResult = await Tradition.query().where('status', 'validate').count('* as total')
    const traditionsRejectedResult = await Tradition.query().where('status', 'rejected').count('* as total')

    return {
      totalTradition: Number(totalTraditionResult[0].$extras.total),
      totalUser: Number(totalUserResult[0].$extras.total),
      totalLanguage: Number(totalLanguageResult[0].$extras.total),
      totalRegion: Number(totalRegionResult[0].$extras.total),
      totalTraditionPending: Number(traditionsPendingResult[0].$extras.total),
      totalTraditionValidated: Number(traditionsValidatedResult[0].$extras.total),
      totalTraditionRejected: Number(traditionsRejectedResult[0].$extras.total),
    }
  }
}