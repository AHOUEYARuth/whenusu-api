/* eslint-disable prettier/prettier */
import { column, hasMany } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'
import Tradition from './tradition.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Informant extends BaseModel {
  public static table = 'informants'

  @column()
  declare name: string

  @column()
  declare avatarUrl: string | null

  @column()
  declare phoneNumber: string
  @hasMany(() => Tradition)
  declare traditions: HasMany<typeof Tradition>
}