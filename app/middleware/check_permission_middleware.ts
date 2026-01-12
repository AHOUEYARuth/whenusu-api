/* eslint-disable prettier/prettier */
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckPermissionMiddleware {
  async handle(
    { auth, response }: HttpContext,
    next: NextFn,
    permissions: string | string[],
    
  ) {
    const user = auth.user

    if (!user) {
      return response.status(401).json({
        message: 'Unauthorized',
      })
    }

    const userPermissions = await user.getPermissions()
    const hasPermission = userPermissions.some((permissionSlug) =>
      permissions.includes(permissionSlug)
    )

    if (!hasPermission) {
      return response.status(403).json({
        message: "Vous n'avez pas la permission d'accéder à cette ressource",
      })
    }

    return next()
  }
}