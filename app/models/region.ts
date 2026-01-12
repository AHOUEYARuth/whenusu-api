/* eslint-disable prettier/prettier */

import { column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'
import Language from './language.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { slugify } from '@adonisjs/lucid-slugify'
import Tradition from './tradition.js'

export default class Region extends BaseModel {
  public static table = 'regions'

  @column()
  declare name: string

  @column()
  @slugify({ strategy: 'dbIncrement', fields: ['name'] })
  declare slug: string

  @column()
  declare location: string

  @column()
  declare longitude: number | null

  @column()
  declare latitude: number | null

  @manyToMany(() => Language, { pivotTable: 'region_languages' })
  declare languages: ManyToMany<typeof Language>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Tradition)
  declare traditions: HasMany<typeof Tradition>

  //@no-swagger
  public async assignLanguages(languages: string | string[]) {
    if (typeof languages === 'string') {
      //@ts-ignore
      await this.related('languages').attach([languages])
    } else {
      //@ts-ignore
      await this.related('languages').attach(languages)
    }
  }

  //@no-swagger
  public async unassignLanguages(languages: string | string[]) {
    if (typeof languages === 'string') {
      //@ts-ignore
      await this.related('languages').detach([languages])
    } else {
      //@ts-ignore
      await this.related('languages').detach(languages)
    }
  }
}