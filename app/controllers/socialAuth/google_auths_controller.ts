/* eslint-disable prettier/prettier */
import type { HttpContext } from '@adonisjs/core/http'

import { GoogleAuthService } from '#services/google_auth_service'
import User from '#models/user'

export default class GoogleAuthsController {
  private googleAuthService: GoogleAuthService

  constructor() {
    this.googleAuthService = new GoogleAuthService()
  }

  /**
   * 
   * @loginWithGoogle 
   * @summary Connexion par google 
   * @requestFormDataBody {"id_token": {"type":"string"}}
   * @responseBody 200 - <User>
   */
 public async loginWithGoogle({ request, response }: HttpContext) {
    const idToken = request.input('id_token')

    if (!idToken) return response.status(400).json({ message: 'id_token est requis ' })

    let payload
    try {
      payload = await this.googleAuthService.verifyGoogleIdToken(idToken)
    } catch (error) {
      console.log('Erreur lors de la vérification du token Google :')
      console.log(error)

      return response.status(401).json({
        message: "Une erreur s'est produite lors de la vérification du token Google",
      })
    }

    let user = await User.query().where('email', payload.email!).first()
    if (!user) {
      user = await User.create({
        email: payload.email,
        firstName: payload.given_name ?? '',
        lastName: payload.family_name ?? '',
        avatarUrl: payload.picture ?? null,
        provider: 'google',
        googleId: payload.sub,
      })
    }
      const token = await User.accessTokens.create(user)
      return response.status(201).json({
        message: 'Connexion réussie via Google',
        user: user,
        token: token.value!.release(),
      })
  }
}
