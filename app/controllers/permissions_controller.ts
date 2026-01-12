/* eslint-disable prettier/prettier */
import Permission from '#models/permission'
import type { HttpContext } from '@adonisjs/core/http'

export default class PermissionsController {
  public async index() {}

  /**
   * 
   * @store 
   * @summary Création de permission
   * @requestBody <Permission>
   * @responseBody 200 - <Permission> 
   */
  public async store({ request, response }: HttpContext) {
    const permission = new Permission()

    permission.name = request.input('name')
    permission.slug = request.input('slug')
    permission.description = request.input('description')

    await permission.save()

    return response.status(200).json({
      message: 'Permission created successfully',
      data: permission,
    })
  }
}
