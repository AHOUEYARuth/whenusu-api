/* eslint-disable prettier/prettier */
import vine from '@vinejs/vine'

export const RegisterValidator = vine.compile(
  vine.object({
    last_name: vine.string().trim().minLength(3),
    first_name: vine.string().trim().minLength(3),
    email: vine.string().email().unique({ table: 'users', column: 'email' }).optional(),
    phone_number: vine.string().unique({ table: 'users', column: 'phone_number' }).minLength(8),
    password: vine.string().minLength(6),
    avatar_url: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
        size: '10mb',
      })
      .optional(),
    region_id: vine.string().optional()
  })
) 

export const LoginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase().optional(),
    phoneNumber: vine.string().trim().optional(),
    password: vine.string().minLength(6),
  })
)

export const ForgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    last_name: vine.string().trim().minLength(3).optional(),
    first_name: vine.string().trim().minLength(3).optional(),
    email: vine.string().email().unique({ table: 'users', column: 'email' }).optional(),
    phone_number: vine.string().unique({ table: 'users', column: 'phone_number' }).minLength(8).optional(),
    password: vine.string().minLength(6).optional(),
    avatar_url: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
        size: '10mb',
      })
      .optional(),
    region_id: vine.string().optional(),
  })
)

export const messageProviderAuth = {
  'last_name.required': 'Le nom  est obligatoire.',
  'last_name.minLength': 'Le nom doit contenir au moins 3 caractères.',

  'first_name.required': 'Le prénom est obligatoire.',
  'first_name.minLength': 'Le prénom doit contenir au moins 3 caractères.',

  /* 'email.required': "L'adresse e-mail est obligatoire.", */
  'email.email': "L'adresse e-mail doit être valide.",
  'email.database.unique': 'Cette adresse e-mail est déjà utilisée.',

  'password.required': 'Le mot de passe est obligatoire.',
  'password.minLength': 'Le mot de passe doit contenir au moins 6 caractères.',
  'phone_number.required': 'Le numéro de téléphone est obligatoire.',
  'phone_number.database.unique': 'Ce numéro de téléphone est déjà utilisé.',
  'phone_number.minLength': 'Le numéro de téléphone doit contenir au moins 8 caractères.',
  'avatar_url.extnames': "Le format de l'avatar doit être jpg, jpeg, png ou webp.",
  'avatar_url.size': "La taille de l'avatar ne doit pas dépasser 10 Mo.",
}

