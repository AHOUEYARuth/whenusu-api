/* eslint-disable prettier/prettier */
import { OAuth2Client } from "google-auth-library";
import env from '#start/env'

const client = new OAuth2Client(env.get('GOOGLE_CLIENT_ID'))

export class GoogleAuthService {
  async verifyGoogleIdToken(idToken: string) {
    
    const pass = await client.verifyIdToken({
      idToken,
      audience: env.get('GOOGLE_CLIENT_ID'),
    })
    
    const payload = pass.getPayload()

    if (!payload) throw new Error('Invalid Google ID Token')
    
    if (!payload.email_verified) throw new Error('Email google non vérifié')
    
    return payload
  }
}