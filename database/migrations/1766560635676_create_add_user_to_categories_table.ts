/* eslint-disable prettier/prettier */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
     table.uuid('created_by').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
     this.schema.alterTable(this.tableName, (table) => {
       table.dropColumn('created_by')
     })
  }
}