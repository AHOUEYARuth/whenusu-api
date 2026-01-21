/* eslint-disable prettier/prettier */
import Role from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  public async index() {}

  /**
   *
   * @store
   * @summary Création de rôle
   * @responseBody 200 - <Role>
   * @requestBody <Role>
   */
  public async store({ request, response, auth }: HttpContext) {
    const role = new Role()

    role.name = request.input('name')
    role.slug = request.input('slug')
    role.description = request.input('description')
    role.createdBy = auth.user!.id

    await role.save()

    return response.status(200).json({
      message: 'Rôle créé avec succès',
      data: role,
    })
  }

  /**
   *
   * @assignPermissionToRole
   * @summary Assigner une Permission à un rôle
   * @paramPath id - Identifiant du rôle - @type(string) @required
   * @requestFormDataBody {"permissions":{"type":"array", "required": "true","items": {"type": "string"}}}
   * @responseBody 200 - <Role>
   */
  public async assignPermissionToRole({ request, response }: HttpContext) {
    const roleId = request.params().id
    const { permissionId } = request.body()
    const role = await Role.query().where('id', roleId).firstOrFail()
    role.assignPermissions(permissionId)

    return response.status(200).json({
      message: 'Permission assignée au rôle avec succès',
      data: role,
    })
  }

  /**
   *
   * @unassignPermissionToRole
   * @summary Détacher une ou plusieurs permissions d'un rôle
   * @paramPath id - Identifiant du rôle - @type(string) @required
   * @requestFormDataBody {"permissions":{"type":"array", "required": "true", "items": {"type": "string"}}}
   * @responseBody 200 - <Role>
   */
  public async unassignPermissionToRole({ request, response }: HttpContext) {
    const roleId = request.params().id
    const { permissionId } = request.body()
    const role = await Role.query().where('id', roleId).firstOrFail()
    await role.unassignPermissions(permissionId)

    return response.status(200).json({
      message: 'Permission détachée du rôle avec succès',
      data: role,
    })
  }
}