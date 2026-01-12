/* eslint-disable prettier/prettier */
import { column, manyToMany } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'
import Role from './role.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { slugify } from '@adonisjs/lucid-slugify'

export default class Permission extends BaseModel {
  public static table = 'permissions'

  @column()
  declare name: string

  @column()
  @slugify({strategy: 'dbIncrement', fields: ['name']})
  declare slug: string

  @column()
  declare description: string | null

  @manyToMany(() => Role, {
    pivotTable: 'permission_roles',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => User, {
    pivotTable: 'permission_users',
  })
  declare users: ManyToMany<typeof User>
}