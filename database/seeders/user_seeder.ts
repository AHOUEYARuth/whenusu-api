import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import Region from '#models/region'
import Language from '#models/language'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    const defaultRegion = await Region.first()
    const defaultLanguage = await Language.first()

    const superAdminRole = await Role.findBy('name', 'Super Admin')
    const adminRole = await Role.findBy('name', 'Admin')

    if (!defaultRegion || !defaultLanguage || !superAdminRole || !adminRole) {
      console.warn('Please run Region, Language, and Role seeders before UserSeeder')
      return
    }

    const passwordHash = await hash.make('password123')

    const users = await User.createMany([
      {
        firstName: 'Amra',
        lastName: 'Detch',
        email: 'ruahoueya@gmail.com',
        phoneNumber: '0151087408',
        password: passwordHash,
        provider: 'email',
        regionId: defaultRegion.id,
        sendNotif: true,
        languageId: defaultLanguage.id,
      },
      {
        firstName: 'Hort',
        lastName: 'AZDS',
        email: 'hortenceazandossessi@gmail.com',
        phoneNumber: '0151087408',
        password: passwordHash,
        provider: 'email',
        regionId: defaultRegion.id,
        sendNotif: true,
        languageId: defaultLanguage.id,
      }
    ])

    // Assign Roles
    const superAdminUser = users.find(u => u.email === 'ruahoueya@gmail.com')
    if (superAdminUser) {
      await superAdminUser.assignRoles(superAdminRole.id)
    }

    const adminUser = users.find(u => u.email === 'hortenceazandossessi@gmail.com')
    if (adminUser) {
      await adminUser.assignRoles(adminRole.id)
    }
  }
}
