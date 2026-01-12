/* eslint-disable prettier/prettier */
import { DateTime } from 'luxon'
import { BaseModel as Model, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class BaseModel extends Model {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(base_model: BaseModel) {
    base_model.id = randomUUID()
  }
}