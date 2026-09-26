import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      { name: 'Rituals', createdBy: 'system' },
      { name: 'Festivals', createdBy: 'system' },
      { name: 'Folklore', createdBy: 'system' },
      { name: 'Music and Dance', createdBy: 'system' },
      { name: 'Culinary Arts', createdBy: 'system' }
    ])
  }
}
