import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Language from '#models/language'

export default class extends BaseSeeder {
  async run() {
    await Language.createMany([
      { name: 'Anglais' },
      { name: 'Fançais' },
      { name: 'Yoruba' },
      { name: 'Fon' },
    ])
  }
}
