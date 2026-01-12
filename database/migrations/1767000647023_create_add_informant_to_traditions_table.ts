/* eslint-disable prettier/prettier */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'traditions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('informant_id').references('id').inTable('informants').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('informant_id')
    })
  }
}