/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'

export const CreateCategoryVAlidator = vine.compile(
  vine.object({
    name: vine.string().unique({ table: 'categories', column: 'name' }),
  })
)

export const UpdateCategoryVAlidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
  })
)

export const messagesProviderCategory = {
  'name.required': 'Le nom de la catégorie est obligatoire',
  'name.string': 'Le nom de la catégorie doit être une chaîne de caractères',
  'name.database.unique': 'Cette catégorie existe déjà',
}
