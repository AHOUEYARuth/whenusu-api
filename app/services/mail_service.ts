/* eslint-disable prettier/prettier */

import mail from "@adonisjs/mail/services/main";


export class MailService {
  
  async sendMail(data: { userEmail: string, otpCode: string, subject: string}) {
    
    await mail.send((message) => {
       message
         .from('ruahoueya@gmail.com')
         .to(data.userEmail)
         .subject(data.subject)
         .htmlView('emails/otpcode_email_html', {data})
    })
    return 'Mail envoyé avec succès'
  }
}