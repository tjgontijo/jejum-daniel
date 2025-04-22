import { NodemailerService } from './nodemailer.service'
import { getVerificationEmailTemplate } from '../templates/auth/verification.template'
import { getResetPasswordEmailTemplate } from '../templates/auth/reset-password.template'
import { getSetInitialPasswordEmailTemplate } from '../templates/auth/set-initial-password.template'
import { getWelcomePurchaseEmailTemplate } from '../templates/auth/welcome-purchase.template'
import logger from '@/lib/logger'

const emailService = new NodemailerService()

interface SendEmailOptions {
  to: string
  token: string
  type: 'verification' | 'reset-password' | 'set-password' | 'welcome-purchase'
  name?: string
  modules?: string[]
}

export async function sendEmail({ to, token, type, name, modules = [] }: SendEmailOptions) {
  const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/+$/, '') // Remove trailing slashes

  try {
    if (type === 'verification') {
      
      const verificationUrl = `${baseUrl}/auth/verify?token=${token}`
      await emailService.sendEmail({
        to,
        subject: 'Confirme seu cadastro',
        html: getVerificationEmailTemplate(verificationUrl),
      })
    } else if (type === 'reset-password') {
      const resetPasswordUrl = `${baseUrl}/auth/reset-password?token=${token}`
      await emailService.sendEmail({
        to,
        subject: 'Redefinição de Senha',
        html: getResetPasswordEmailTemplate(resetPasswordUrl),
      })
    } else if (type === 'set-password') {
      const setPasswordUrl = `${baseUrl}/auth/set-password?token=${token}`
      await emailService.sendEmail({
        to,
        subject: 'Bem-vindo - Crie sua senha',
        html: getSetInitialPasswordEmailTemplate(setPasswordUrl, name || ''),
      })
    } else if (type === 'welcome-purchase') {
      const setPasswordUrl = `${baseUrl}/auth/set-password?token=${token}`
      await emailService.sendEmail({
        to,
        subject: 'Bem-vindo ao Jejum de Daniel - Acesse seu conteúdo',
        html: getWelcomePurchaseEmailTemplate(setPasswordUrl, name || '', modules),
      })
    } else {
      throw new Error('Invalid email type')
    }

    return true
  } catch (error) {
    logger.error('Erro ao enviar email', { 
      type, 
      to, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      context: 'email_service'
    })
    throw error
  }
}
