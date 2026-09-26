import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Region from '#models/region'

export default class extends BaseSeeder {
  async run() {
    await Region.createMany([
      {
        name: 'Littoral',
        location: 'Benin',
        latitude: 6.36536,
        longitude: 2.41833
      },
      {
        name: 'Oueme',
        location: 'Benin',
        latitude: 6.49722,
        longitude: 2.605
      },
      {
        name: 'Ile-de-France',
        location: 'France',
        latitude: 48.8566,
        longitude: 2.3522
      },
      {
        name: 'Lagos',
        location: 'Nigeria',
        latitude: 6.5244,
        longitude: 3.3792
      }
    ])
  }
}
