/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'

export const CreateInformantValidator = vine.compile(
  vine.object({
    name: vine.string().unique({ table: 'informants', column: 'name' }),
    avatar_url: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
        size: '10mb',
      })
      .optional(),
    phoneNumber: vine.string().unique({ table: 'informants', column: 'phone_number' }).minLength(8),
  })
)

export const UpdateInformantValidator = vine.compile(
  vine.object({
    name: vine.string().unique({ table: 'informants', column: 'name' }).optional(),
    avatar_url: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
        size: '10mb',
      })
      .optional(),
    phoneNumber: vine
      .string()
      .unique({ table: 'informants', column: 'phone_number' })
      .minLength(8)
      .optional(),
  })
)

export const messageProviderInformant = {
  'name.required': "Le nom de l'informateur est obligatoire",
  'name.database.unique': 'Ce nom existe déjà',
  'name.string': 'Le nom doit être une chaîne de caractère',
  'avatar_url.extnames': 'Le format de la photo doit être jpg, jpeg, png ou webp.',
  'avatar_url.size': 'La taille de la photo ne doit pas dépasser 10 Mo.',
  'phoneNumber.required': 'Le champ numéro de téléphone est obligatoire.',
  'phoneNumber.database.unique': 'Ce numéro de téléphone est déjà utilisé.',
  'phoneNumber.minLength': 'Le numéro de téléphone doit contenir au moins 8 caractères.',
}
 