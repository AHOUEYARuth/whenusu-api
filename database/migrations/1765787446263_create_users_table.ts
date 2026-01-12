/* eslint-disable prettier/prettier */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('last_name').notNullable()
      table.string('first_name').notNullable()
      table.string('email', 254).nullable().unique()
      table.string('phone_number').nullable().unique()
      table.string('password').notNullable()
      table.string('avatar_url').nullable()
      table.string('provider').defaultTo('local')
      table.string('apple_id').nullable().unique()
      table.string('google_id').nullable().unique()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}