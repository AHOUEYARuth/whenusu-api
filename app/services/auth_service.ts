/* eslint-disable prettier/prettier */

import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import { MailService } from './mail_service.js'
import hash from '@adonisjs/core/services/hash'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

export class AuthService {
  public mailSerice: MailService

  constructor() {
    this.mailSerice = new MailService()
  }

  async createUser(data: any) {
    const user = new User()
    user.lastName = data.last_name
    user.firstName = data.first_name
    user.email = data.email
    user.phoneNumber = data.phone_number
    user.password = data.password
    user.regionId = data.region_id

    if (data.avatar_url) {
      const fileName = `${cuid()}.${data.avatar_url.extname}`

      await data.avatar_url.move('uploads/avatars', {
        name: fileName,
        overwrite: true,
      })

      user.avatarUrl = `/uploads/avatars/${fileName}`
    }

    await user.save()

    return user
  }

  async generateOtpCode() {
    const otpCode = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .slice(2)
    return otpCode
  }

  async verifyOtpCOde(data: { email?: string; phoneNumber?: string; otpCode: string }) {
    const user = await User.query().where(
        data.email ? 'email' : 'phone_number',
        data.email ? data.email : (data.phoneNumber ?? '')
      )
      .andWhere('otp_code', data.otpCode)
      .first()
    return user
  }

  async verifyUser(data: { email?: string; phoneNumber?: string }) {
    const user = data.email
      ? await User.findBy('email', data.email)
      : await User.findBy('phone_number', data.phoneNumber)
    const otpCode = await this.generateOtpCode()
    if (user) {
      user!.otpCode = otpCode
      const subject = 'Mot de passe oublié - code OTP de validation'
      await this.mailSerice.sendMail({ userEmail:user.email || "",otpCode, subject: subject})
      await user!.save()
      return user
    } else {
      return null
    }
    
  }

  async ressetPassword(userId: string, newPassword: string) {
    const user = await User.findBy('id', userId)
    if (!user) {
      console.log('no user')
      return null
    }
    user.password = newPassword
    user.otpCode = null
    await user.save()
    return user
  }

  async deleteUserAccount(password: string, auth: Authenticator<Authenticators>) {
    const isValidPassword = await hash.verify(auth.user!.password, password)
    if (!isValidPassword) throw new Error('Mot de passe incorret')
    auth.use('api').invalidateToken()
    auth.user!.delete()
  }
  
  async updatePassword(password: string, auth: Authenticator<Authenticators>, newPassWord: string) {
    const isValidPassword = await hash.verify(auth.user!.password, password)
    if (!isValidPassword) throw new Error('Mot de passe incorret')
    auth.user!.password = newPassWord
    await auth.user!.save()
    return auth.user
  }

  async updateUser(userId: string, data: any) {
    const user = await User.query().where("id", userId).first()
    if (!user) throw new Error('Utilisateur non trouvé')
    user.lastName = data.last_name || user.lastName
    user.firstName = data.first_name || user.firstName
    user.email = data.email || user.email
    user.phoneNumber = data.phone_number || user.phoneNumber
    user.regionId = data.region_id || user.regionId

    if (data.avatar_url) {
      const fileName = `${cuid()}.${data.avatar_url.extname}`

      await data.avatar_url.move('uploads/avatars', {
        name: fileName,
        overwrite: true,
      })

      user.avatarUrl = `/uploads/avatars/${fileName}` || user.avatarUrl
    }
    await user.save()
    return user
  }
  async getUsers(page: number = 1) {
    const users = User.query();
    const allUsers = await users;
    const usersPaginate = await users.paginate(page, 2);
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    //@ts-ignore
    const monthUsers = await users.whereBetween('created_at', [startOfMonth, endOfMonth])

    const statistics = {
      totalUsers: allUsers.length,
      totalMonthUser: monthUsers.length,
    }
    return {
      users: usersPaginate,
      statistics,
    }
  }

  async changeSendNotifStatus(userId: string) {
    const user = await User.query().where("id", userId).first()
    if (!user) throw new Error('Utilisateur non trouvé')
    user.sendNotif = !user.sendNotif
    user.save()
  }
}
