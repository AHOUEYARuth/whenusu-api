/* eslint-disable prettier/prettier */
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    'required': 'Le champs {{ field }} est requis',
    'string': 'Le champs {{ field }} doit être une chaine de caractère',
    'email': 'Le champs {{ field }} doit être un email',
    'unique': 'Le champs {{ field }} existe déjà',
   
  },
  {
    name: 'nom',
    title: 'titre',
    phone_number: 'numéro de téléphone',
    phoneNumber: 'numéro de téléphone',
    email: 'adresse email',
    first_name: 'prénom',
  }
)
