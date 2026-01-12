/* eslint-disable prettier/prettier */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'traditions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable().unique()
      table.string('slug').notNullable().unique()
      table.uuid('category_id').references('id').inTable('categories').onDelete('CASCADE')
      table.uuid('region_id').references('id').inTable('regions').onDelete('CASCADE')
      table.uuid('language_id').references('id').inTable('languages').onDelete('CASCADE')
      table.text('transcription').notNullable()
      table.string('cover_img').notNullable()
      table.string('media_url').nullable()
      table
        .enum('status', ['pending', 'validate', 'published', 'rejected', 'archived'])
        .defaultTo('pending')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}