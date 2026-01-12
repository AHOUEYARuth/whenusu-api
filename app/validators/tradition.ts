/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'


export const CreateTraditionValidator = vine.compile(
  vine.object({
    title: vine.string().unique({ table: 'traditions', column: 'title' }),
    transcription: vine.string(),
    language_id: vine.string(),
    region_id: vine.string(),
    category_id: vine.string(),
    informant_id: vine.string(),
    cover_img: vine.file({
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
      size: '10mb',
    }),
    media_url: vine.file({
      extnames: ['mp3', 'wav', 'mov', 'm4a', 'mp4'],
      size: '80mb',
    }),
  })
)

export const UpdateTraditionValidator = vine.compile(
  vine.object({
    title: vine.string().unique({ table: 'traditions', column: 'title' }).optional(),
    transcription: vine.string().optional(),
    language_id: vine.string().optional(),
    region_id: vine.string().optional(),
    category_id: vine.string().optional(),
    informant_id: vine.string().optional(),
    cover_img: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
        size: '10mb',
      })
      .optional(),
    media_url: vine
      .file({
        extnames: ['mp3', 'wav', 'mov', 'm4a', 'mp4'],
        size: '80mb',
      })
      .optional(),
  })
)

export const messagesProviderTradition = {
  'title.required': 'Le titre est obligatoire.',
  'title.string': 'Le titre doit être une chaîne de caractères.',
  'title.database.unique': 'Ce titre existe déjà. Veuillez en choisir un autre.',

  'transcription.required': 'La transcription est obligatoire.',
  'transcription.string': 'La transcription doit être une chaîne de caractères.',

  'cover_img.required': 'L’image de couverture est obligatoire.',
  'cover_img.file': 'Le fichier de couverture doit être une image valide.',
  'cover_img.extname': 'L’image de couverture doit être au format jpg, jpeg, png ou webp.',
  'cover_img.size': 'L’image de couverture ne doit pas dépasser 10 Mo.',

  'media_url.required': 'Le média est obligatoire.',
  'media_url.file': 'Le média doit être un fichier valide.',
  'media_url.extname': 'Le média doit être au format mp3,wav, mov, m4a, mp4.',
  'media_url.size': 'Le média ne doit pas dépasser 80 Mo.',
}

