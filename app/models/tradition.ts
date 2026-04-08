/* eslint-disable prettier/prettier */
import { belongsTo, column, computed } from '@adonisjs/lucid/orm'
import env from '#start/env'
import BaseModel from './base_model.js';
import { slugify } from '@adonisjs/lucid-slugify';
import User from './user.js';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Category from './category.js';
import Region from './region.js';
import Language from './language.js';
import Informant from './informant.js';

export default class Tradition extends BaseModel {
  public static table = 'traditions'

  @column()
  declare title: string

  @column()
  @slugify({ strategy: 'dbIncrement', fields: ['title'] })
  declare slug: string

  @column()
  declare userId: string

  @column()
  declare categoryId: string

  @column()
  declare regionId: string

  @column()
  declare languageId: string

  @column()
  declare informantId: string

  @column()
  declare transcription: string

  @column({ serializeAs: null })
  declare coverImg: string

  @computed({ serializeAs: 'cover_img' })
  get coverImgFull(): string | null {
    if (!this.coverImg) return null
    return this.coverImg.startsWith('http') ? this.coverImg : `${env.get('APP_URL')}${this.coverImg}`
  }

  @column({ serializeAs: null })
  declare mediaUrl: string | null

  @computed({ serializeAs: 'media_url' })
  get mediaUrlFull(): string | null {
    if (!this.mediaUrl) return null
    return this.mediaUrl.startsWith('http') ? this.mediaUrl : `${env.get('APP_URL')}${this.mediaUrl}`
  }

  @column()
  declare status: string

  @column()
  declare favorisCount: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Region)
  declare region: BelongsTo<typeof Region>

  @belongsTo(() => Language)
  declare language: BelongsTo<typeof Language>

  @belongsTo(() => Informant)
  declare informant: BelongsTo<typeof Informant>
}