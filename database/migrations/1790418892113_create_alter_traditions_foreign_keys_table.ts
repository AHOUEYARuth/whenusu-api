import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'traditions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['category_id'])
      table.dropForeign(['region_id'])
      table.dropForeign(['language_id'])

      table.foreign('category_id').references('id').inTable('categories').onDelete('RESTRICT')
      table.foreign('region_id').references('id').inTable('regions').onDelete('RESTRICT')
      table.foreign('language_id').references('id').inTable('languages').onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['category_id'])
      table.dropForeign(['region_id'])
      table.dropForeign(['language_id'])

      table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE')
      table.foreign('region_id').references('id').inTable('regions').onDelete('CASCADE')
      table.foreign('language_id').references('id').inTable('languages').onDelete('CASCADE')
    })
  }
}