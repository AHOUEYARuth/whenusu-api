import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'traditions'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('created_by').nullable().references('users.id').onDelete('SET NULL')
      table.uuid('validated_by').nullable().references('users.id').onDelete('SET NULL')
      table.uuid('published_by').nullable().references('users.id').onDelete('SET NULL')
      table.uuid('archived_by').nullable().references('users.id').onDelete('SET NULL')
      table.uuid('rejected_by').nullable().references('users.id').onDelete('SET NULL')
      table.uuid('deleted_by').nullable().references('users.id').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('created_by', 'validated_by', 'published_by', 'archived_by', 'rejected_by', 'deleted_by')
    })
  }
}