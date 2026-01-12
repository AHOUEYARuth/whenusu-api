/* eslint-disable prettier/prettier */
import { column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'
import Region from './region.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { slugify } from '@adonisjs/lucid-slugify'
import Tradition from './tradition.js'

export default class Language extends BaseModel {
  public static table = 'languages'

  @column()
  declare name: string

  @column()
  @slugify({strategy: 'dbIncrement', fields: ['name']})
  declare slug: string
  
  @manyToMany(() => Region,{pivotTable : "region_languages"})
  declare regions: ManyToMany<typeof Region>

  @hasMany(() => Tradition)
  declare traditions: HasMany<typeof Tradition>
}
