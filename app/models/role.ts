/* eslint-disable prettier/prettier */
import { belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'
import { slugify } from '@adonisjs/lucid-slugify'

export default class Role extends BaseModel {
  public static table = 'roles'

  @column()
  declare name: string

  @column()
  @slugify({ strategy: 'dbIncrement', fields: ['name'] })
  declare slug: string

  @column()
  declare description: string | null

  @manyToMany(() => User, {
    pivotTable: 'role_users',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'permission_roles',
  })
  declare permissions: ManyToMany<typeof Permission>

  @column()
  declare createdBy: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  //@no-swagger
  public async assignPermissions(permissions: string | string[]) {
    if (typeof permissions === 'string') {
      //@ts-ignore
      await this.related('permissions').attach([permissions])
    } else {
      //@ts-ignore
      await this.related('permissions').attach(permissions)
    }
  }

  //@no-swagger
  public async unassignPermissions(permissions: string | string[]) {
    if (typeof permissions === 'string') {
      //@ts-ignore
      await this.related('permissions').detach([permissions])
    } else {
      //@ts-ignore
      await this.related('permissions').detach(permissions)
    }
  }
}

