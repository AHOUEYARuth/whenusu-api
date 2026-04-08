/* eslint-disable prettier/prettier */
import { column, computed, hasMany } from '@adonisjs/lucid/orm'
import env from '#start/env'
import BaseModel from './base_model.js'
import Tradition from './tradition.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Informant extends BaseModel {
  public static table = 'informants'

  @column()
  declare name: string

  @column({ serializeAs: null })
  declare avatarUrl: string | null

  @computed({ serializeAs: 'avatar_url' })
  get avatarUrlFull(): string | null {
    if (!this.avatarUrl) return null
    return this.avatarUrl.startsWith('http') ? this.avatarUrl : `${env.get('APP_URL')}${this.avatarUrl}`
  }

  @column()
  declare phoneNumber: string
  @hasMany(() => Tradition)
  declare traditions: HasMany<typeof Tradition>
}