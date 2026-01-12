/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'


export const CreateLanguageValidator = vine.compile(
  vine.object({
    name: vine.string().unique({ table: 'languages', column: 'name' }),
  })
)

export const UpdateLanguageValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
  })
)

export const messagesProviderLanguage = {
  'name.required': 'Le nom de la langue est obligatoire',
  'name.string': 'Le nom de la langue doit être une chaîne de caractères',
  'name.database.unique': 'Cette langue existe déjà',
}
