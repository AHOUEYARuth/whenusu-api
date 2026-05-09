/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'

export const CreateNotificationValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3),
    description: vine.string().trim().optional(),
    userId: vine.string().uuid(),
  })
)

export const UpdateNotificationValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).optional(),
    description: vine.string().trim().optional(),
    read: vine.boolean().optional(),
  })
)

export const BulkDeleteNotificationValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.string().uuid()).minLength(1),
  })
)

export const messagesProviderNotification = {
  'title.required': 'Le titre est obligatoire',
  'title.minLength': 'Le titre doit avoir au moins 3 caractères',
  'userId.uuid': "L'identifiant de l'utilisateur doit être un UUID valide",
  'userId.required': "L'identifiant de l'utilisateur est obligatoire",
  'ids.required': 'La liste des identifiants est obligatoire',
  'ids.minLength': 'La liste des identifiants ne peut pas être vide',
}
