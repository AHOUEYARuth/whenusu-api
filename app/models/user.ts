/* eslint-disable prettier/prettier */
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import BaseModel from './base_model.js'
import Role from './role.js'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'
import Region from './region.js'
import Tradition from './tradition.js'
import Category from './category.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'users'

  @column()
  declare lastName: string

  @column()
  declare firstName: string

  @column()
  declare email: string | null

  @column()
  declare phoneNumber: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare avatarUrl: string | null

  @column()
  declare provider: string

  @column()
  declare appleId: string | null

  @column()
  declare googleId: string | null

  @column()
  declare otpCode: string | null

  @column()
  declare regionId: string

  @column()
  declare sendNotif: boolean

  @manyToMany(() => Role, {
    pivotTable: 'role_users',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'permission_users',
  })
  declare permissions: ManyToMany<typeof Permission>

  @hasMany(() => Role)
  declare userRoles: HasMany<typeof Role>

  @belongsTo(() => Region)
  declare region: BelongsTo<typeof Region>

  @hasMany(() => Tradition)
  declare traditions: HasMany<typeof Tradition>

  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>

  static accessTokens = DbAccessTokensProvider.forModel(User)

  //@no-swagger
  public async assignRoles(roles: string | string[]) {
    if (typeof roles === 'string') {
      //@ts-ignore
      this.related('roles').attach([roles])
    } else {
      //@ts-ignore
      this.related('roles').attach(roles)
    }
  }
  //@no-swagger
  public async unassignRoles(roles: string | string[]) {
    if (typeof roles === 'string') {
      //@ts-ignore
      this.related('roles').detach([roles])
    } else {
      //@ts-ignore
      this.related('roles').detach(roles)
    }
  }

  //@no-swagger
  public async getPermissions() {
    const flatTable: string[] = []
    //@ts-ignore
    const roles = await this.related('roles').query().preload('permissions')

    roles.forEach((role) => {
      //@ts-ignore
      role.permissions.forEach((permission) => {
        flatTable.push(permission.slug)
      })
    })
    return flatTable
  }
}