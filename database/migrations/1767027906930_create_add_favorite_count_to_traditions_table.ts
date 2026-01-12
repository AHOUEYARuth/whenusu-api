/* eslint-disable prettier/prettier */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'traditions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('favoris_count').defaultTo('0')
    })
  }

  async down() {
   this.schema.alterTable(this.tableName, (table) => {
     table.dropColumn('favoris_count')
   })
  }
}