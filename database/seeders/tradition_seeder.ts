import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tradition from '#models/tradition'
import User from '#models/user'
import Category from '#models/category'
import Region from '#models/region'
import Language from '#models/language'
import Informant from '#models/informant'

export default class extends BaseSeeder {
  async run() {
    const defaultUser = await User.first()
    const defaultCategory = await Category.first()
    const defaultRegion = await Region.first()
    const defaultLanguage = await Language.first()
    const defaultInformant = await Informant.first()

    if (!defaultUser || !defaultCategory || !defaultRegion || !defaultLanguage || !defaultInformant) {
      console.warn('Please run User, Category, Region, Language, and Informant seeders first.')
      return
    }

    await Tradition.createMany([
      {
        title: 'Gelede Festival',
        transcription: 'A major Yoruba festival honoring women.',
        userId: defaultUser.id,
        categoryId: defaultCategory.id,
        regionId: defaultRegion.id,
        languageId: defaultLanguage.id,
        informantId: defaultInformant.id,
        status: 'published',
        isHighlighted: true,
        favorisCount: 10,
        createdBy: defaultUser.id,
      },
      {
        title: 'Zangbeto Night Watch',
        transcription: 'Traditional voodoo guardians of the night in Benin.',
        userId: defaultUser.id,
        categoryId: defaultCategory.id,
        regionId: defaultRegion.id,
        languageId: defaultLanguage.id,
        informantId: defaultInformant.id,
        status: 'published',
        isHighlighted: false,
        favorisCount: 5,
        createdBy: defaultUser.id,
      }
    ])
  }
}
