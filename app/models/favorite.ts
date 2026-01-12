/* eslint-disable prettier/prettier */
import { column } from '@adonisjs/lucid/orm'
import BaseModel from './base_model.js'

export default class Favorite extends BaseModel {
  public static table = "favorites"

  @column()
  declare userId: string

  @column()
  declare traditionId: string
}