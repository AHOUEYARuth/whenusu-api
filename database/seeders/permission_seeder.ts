import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    const permissionsData = [
      // Traditions
      { name: 'create-tradition' },
      { name: 'update-tradition' },
      { name: 'delete-tradition' },
      { name: 'validate-tradition' },
      { name: 'reject-tradition' },
      { name: 'archive-tradition' },
      { name: 'publish-tradition' },
      { name: 'highlight-tradition' },
      // Stats
      { name: 'get-global-stats' },
      // Users
      { name: 'get-users' },
      { name: 'get-user-details' },
      { name: 'assign-role-to-user' },
      { name: 'unassign-role-to-user' },
      // Roles & Permissions
      { name: 'create-role' },
      { name: 'assign-permission-to-role' },
      { name: 'unassign-permission-to-role' },
      { name: 'view-roles' },
      { name: 'create-permission' },
      { name: 'get-permission-list' },
      // Regions
      { name: 'create-region' },
      { name: 'update-region' },
      { name: 'delete-region' },
      { name: 'assign-language-to-region' },
      { name: 'unassign-language-to-region' },
      // Languages
      { name: 'create-language' },
      { name: 'update-language' },
      { name: 'delete-language' },
      // Informants
      { name: 'create-informant' },
      { name: 'get-informant' },
      { name: 'update-informant' },
      { name: 'delete-informant' },
      // Categories
      { name: 'create-category' },
      { name: 'update-category' },
      { name: 'delete-category' }
    ]

    const permissions = await Permission.createMany(permissionsData)
    
    // Retrieve roles
    const superAdminRole = await Role.findBy('name', 'Super Admin')
    const adminRole = await Role.findBy('name', 'Admin')
    const informantRole = await Role.findBy('name', 'Informant')

    if (superAdminRole) {
      // Super Admin gets all permissions
      const allPermissionIds = permissions.map(p => p.id)
      await superAdminRole.assignPermissions(allPermissionIds)
    }

    if (adminRole) {
      // Admin gets most permissions excluding strict role/permission assignments
      const excludedForAdmin = [
        'create-permission'
      ]
      const adminPermissionIds = permissions
        .filter(p => !excludedForAdmin.includes(p.name))
        .map(p => p.id)
      await adminRole.assignPermissions(adminPermissionIds)
    }

    if (informantRole) {
      // Informant gets limited rights
      const informantPerms = [
        'create-tradition',
        'get-informant'
      ]
      const informantPermissionIds = permissions
        .filter(p => informantPerms.includes(p.name))
        .map(p => p.id)
      await informantRole.assignPermissions(informantPermissionIds)
    }
  }
}
