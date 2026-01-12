/* eslint-disable prettier/prettier */
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const RegionValidator = vine.compile(
  vine.object({
    name: vine.string().unique({ table: 'regions', column: 'name' }),
    location: vine.string(),
    longitude: vine.number().optional(),
    latitude: vine.number().optional(),
  })
)

export const UpdateRegionValidator = vine.compile(
  vine.object({
    name: vine.string().optional(),
    location: vine.string().optional(),
    longitude: vine.number().optional(),
    latitude: vine.number().optional(),
  })
)

export const messagesProviderRegion = {
  'name.required': 'Le nom de la région est obligatoire',
  'name.string': 'Le nom de la région doit être une chaîne de caractères',
  'name.database.unique': 'Cette région existe déjà',
  'loaction.string': 'La localisation de la région doit être une chaîne de caractères',
  'location.required': 'La localisation de la région est obligatoire',
}