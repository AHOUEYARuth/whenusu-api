import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'
 
   async up() {
     this.schema.alterTable(this.tableName, (table) => {
       table.boolean('read').defaultTo(false)
       table.uuid('user_id').references('users.id').onDelete('CASCADE').notNullable()
     })
   }
 
   async down() {
     this.schema.alterTable(this.tableName, (table) => {
       table.dropColumn('read')
       table.dropColumn('user_id')
     })
   }
}