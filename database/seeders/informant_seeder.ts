import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Informant from '#models/informant'

export default class extends BaseSeeder {
  async run() {
    await Informant.createMany([
      {
        name: 'Olu Ogbo',
        phoneNumber: '+22998765432'
      },
      {
        name: 'Mamy Wata',
        phoneNumber: '+22998765433'
      }
    ])
  }
}
