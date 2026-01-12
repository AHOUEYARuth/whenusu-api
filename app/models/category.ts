/* eslint-disable prettier/prettier */
import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'
import { slugify } from '@adonisjs/lucid-slugify'
import Tradition from './tradition.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Category extends BaseModel {
  public static table = 'categories'

  @column()
  declare name: string

  @column()
  @slugify({strategy: 'dbIncrement', fields: ['name']})
  declare slug: string

  @column()
  declare createdBy: string

  @belongsTo(()=> User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Tradition)
  declare traditions: HasMany<typeof Tradition>

}