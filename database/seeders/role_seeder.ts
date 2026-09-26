import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        name: 'Super Admin',
        description: 'Super Administrator with all permissions',
        createdBy: 'system',
      },
      {
        name: 'Admin',
        description: 'Administrator role',
        createdBy: 'system',
      },
    ])
  }
}