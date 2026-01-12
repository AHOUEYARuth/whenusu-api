/* eslint-disable prettier/prettier */
import type { HttpContext } from '@adonisjs/core/http'

import { AuthService } from '#services/auth_service'
import { LoginValidator, messageProviderAuth, RegisterValidator, updateUserValidator } from '#validators/auth'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import Role from '#models/role'
import { SimpleMessagesProvider } from '@vinejs/vine'

export default class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  /**
   *
   * @register
   * @summary Création d'utilisateur
   * @requestFormDataBody {"last_name":{"type":"string", "required": "true"},"first_name":{"type":"string", "required": "true"},"email":{"type":"string"},"phone_number":{"type":"string", "required": "true"},"password":{"type":"string", "required": "true"},"region_id":{"type":"string"},"avatar_url":{"type":"string","format":"binary"}}
   * @responseBody 200 - <User>
   *
   */
  public async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(RegisterValidator, {
        messagesProvider: new SimpleMessagesProvider(messageProviderAuth),
      })
      /*  const file = request.file('avatar_url') */
      const roleId = request.input('role_id')
      const user = await this.authService.createUser(payload)

      if (roleId) {
        const role = await Role.query().where('id', roleId).firstOrFail()
        if (!role) {
          return response.status(404).json({
            message: 'Rôle non trouvé',
          })
        }
        await user.assignRoles([role.id])
      }

      return response.status(201).json({
        message: 'Utilisateur créé avec succès',
        data: user,
      })
    } catch (error) {
      console.log("Erreur lors de l'inscription :")
      console.log(error)
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite lors de l'inscription",
      })
    }
  }

  /**
   *
   * @login
   * @summary Se connecter à son compte
   * @requestFormDataBody {"email":{"type": "string"},"phoneNumber":{"type":"string", "required": "true"},"password":{"type":"string", "required": "true"}}
   * @responseBody 200 - <User>
   */
  public async login({ request, response }: HttpContext) {
    try {
      const { email, phoneNumber, password } = await request.validateUsing(LoginValidator)

      let userQuery = User.query()

      if (email) {
        userQuery.where('email', email).preload('roles', (rolesQuery) => {
          rolesQuery.preload('permissions')
        })
      } else if (phoneNumber) {
        userQuery.where('phone_number', phoneNumber).preload('roles', (rolesQuery) => {
          rolesQuery.preload('permissions')
        })
      }

      const user = await userQuery.first()

      if (!user)
        return response.status(404).json({
          message:
            'Utilisateur non trouvé, vérifiez votre addresse email ou votre numéro de téléphone',
        })

      const isValidPassword = await hash.verify(user.password, password)
      if (!isValidPassword) return response.status(401).json({ message: 'Mot de passe incorrect' })

      const token = await User.accessTokens.create(user, ['*'], { expiresIn: '2 days' })
      const userPersmisions = await user.getPermissions()
      return response.status(201).json({
        message: 'Connexion réussie',
        user: user,
        userPersmisions,
        token: token.value!.release(),
      })
    } catch (error) {
      console.log("Erreur lors de l'inscription :")
      console.log(error)
      return response.status(500).json({
        message: error.messages || "Une erreur s'est produite lors de la connexion",
      })
    }
  }

  /**
   *
   * @logout
   * @summary Déconnexion
   */
  public async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.status(200).json({ message: 'Déconnexion réussie' })
  }

  /**
   *
   * @assignRoleToUser
   * @summary Assigner un rôle à un utilisateur
   * @paramPath id - Identifiant de l'utilisateur - @type(string) @required
   * @requestFormDataBody {"roles": {"type": "array", "required": "true", "items": {"type": "string"}}}
   * @responseBody 200 - <User>
   */
  public async assignRoleToUser({ request, response }: HttpContext) {
    const userId = request.params().id
    const { rolesId } = request.body()

    const user = await User.query().where('id', userId).firstOrFail()

    await user.assignRoles(rolesId)

    return response.status(200).json({
      message: 'Rôle(s) assigné(s) avec succès',
      data: user,
    })
  }

  /**
   *
   * @unassignRoleToUser
   * @summary Détacher un rôle d'un utilisateur
   * @paramPath id - Identifiant de l'utilisateur - @type("string") @required
   * @requestFormDataBody {"roles": {"type": "array", "required": "true", "items":{"type": "string"}}}
   * @responseBody 200 - <User>
   */
  public async unassignRoleToUser({ request, response }: HttpContext) {
    const userId = request.params().id
    const { rolesId } = request.body()

    const user = await User.query().where('id', userId).firstOrFail()

    await user.unassignRoles(rolesId)

    return response.status(200).json({
      message: 'Rôle(s) desassigné(s) avec succès',
      data: user,
    })
  }

  /**
   *
   * @forgotPassword
   * @summary Mot de passe oublié
   * @requestFormDataBody {"userId": {"type": "string", "required": "true"}, "newPassWord": {"type": "string", "required": "true"}, "confirmPassword": {"type":"string", "required": "true"}}
   * @responseBody 200 - <User>
   */
  public async forgotPassword({ request, response }: HttpContext) {
    const { userId, newPassword, confirmPassword } = await request.body()
    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: 'Le mot de passe de confirmation ne correspond pas',
      })
    } else {
      const user = await this.authService.ressetPassword(userId, newPassword)
      console.log('user controller')
      console.log(user)
      if (!user) {
        return response.status(404).json({
          message: 'Utilisateur non trouvé',
        })
      } else {
        return response.status(200).json({
          message: 'Mot de passe réinitialisé avec succès',
          user,
        })
      }
    }
  }

  /**
   *
   * @verifyUser
   * @summary Vérification d'utilisateur
   * @requestFormDataBody {"email": {"type":"string", "required": "true"}, "phoneNumber": {"type": "string", "required": "true"}}
   */
  public async verifyUser({ request, response }: HttpContext) {
    const { email, phoneNumber } = await request.body()
    const user = await this.authService.verifyUser({ email, phoneNumber })
    if (!user) {
      return response.status(404).json({
        message: 'Utilisateur non trouvé',
      })
    } else {
      return response.status(200).json({
        message: 'Utilisateur vérifié avec succès',
      })
    }
  }

  /**
   *
   * @verifyOtpCode
   * @summary Vérification de code OTP
   * @requestFormDataBody {"email": {"type": "string", "required": "true"}, "phoneNumber": {"type":"string", "required": "true"}, "otpCode": {"type": "string", "required": "true"}}
   * @responseBody 200 - <User>
   */
  public async verifyOtpCode({ request, response }: HttpContext) {
    const { email, phoneNumber, otpCode } = await request.body()
    const user = await this.authService.verifyOtpCOde({ email, phoneNumber, otpCode })
    if (!user) {
      return response.status(404).json({
        message: 'Code OTP invalide',
      })
    } else {
      return response.status(200).json({
        message: 'Code OTP vérifié avec succès',
        user,
      })
    }
  }

  /**
   *
   * @deleteUserAccount
   * @summary Suppression de compte utilisateur
   * @requestFormDataBody {"password": {"type": "string", "required": "true"}}
   */
  public async deleteUserAccount({ request, response, auth }: HttpContext) {
    try {
      const { password } = request.body()
      await this.authService.deleteUserAccount(password, auth)
      return response.status(200).json({
        message: 'compte supprimé avec succès',
      })
    } catch (error) {
      return response.status(200).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @updatePassword
   * @summary Modification de password par ancien password
   * @requestFormDataBody {"password": {"type": "string", "required": "true"}, "newPassWord": {"type": "string", "required": "true"}}
   */
  public async updatePassword({ request, response, auth }: HttpContext) {
    try {
      const { password, newPassWord } = request.body()
      await this.authService.updatePassword(password, auth, newPassWord)
      return response.status(200).json({
        message: 'Mot de passe changé avec succès',
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @userDetails
   * @summary Listes des information de user (profile user)
   * @responseBody 200 - <User>
   */
  public async userDetails({ response, auth }: HttpContext) {
    return response.status(200).json({
      message: 'User details',
      data: auth.user,
    })
  }

  /**
   *
   * @updateUser
   * @summary Mise à jour de profile user
   * @requestFormDataBody {"last_name":{"type":"string"},"first_name":{"type":"string"},"email":{"type":"string"},"phone_number":{"type":"string"},"password":{"type":"string"},"region_id":{"type":"string"},"avatar_url":{"type":"string","format":"binary"}}
   * @responseBody 200 - <User>
   */
  public async updateUser({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateUserValidator)
      const user = await this.authService.updateUser(auth.user!.id, payload)
      return response.status(200).json({
        message: 'Profile modifié avec succès',
        data: user,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @getUsers
   * @summary Liste des users
   * @responseBody 200 - <User>
   */
  public async getUsers({ request, response }: HttpContext) {
    try {
      const page = request.input('page')
      const { users, statistics } = await this.authService.getUsers(page)
      return response.status(200).json({
        message: 'Liste des utilisateurs',
        statistics,
        data: users,
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }

  /**
   *
   * @sendNotifStatus
   * @summary Activer/désactivé l'envoie de notification
   */
  public async sendNotifStatus({ response, auth }: HttpContext) {
    try {
      await this.authService.changeSendNotifStatus(auth.user!.id)
      return response.status(200).json({
        message: 'Etat de notification modifié',
      })
    } catch (error) {
      return response.status(500).json({
        message: error.message || "Une erreur s'est produite",
      })
    }
  }
}
