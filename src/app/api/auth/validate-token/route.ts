import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const { token, type = 'VERIFICATION' } = await request.json()

    if (!token) {
      return NextResponse.json({ message: 'Token é obrigatório' }, { status: 400 })
    }

    // Usar transação para garantir atomicidade
    const result = await prisma.$transaction(async (prisma) => {
      // Buscar o token de acordo com o tipo
      const validToken = await prisma.token.findFirst({
        where: {
          token: token,
          type: type,
          expires: {
            gt: new Date(),
          },
        },
      })

      if (!validToken) {
        throw new Error('TOKEN_INVALID')
      }

      // Buscar e atualizar o usuário
      const user = await prisma.user.findUnique({
        where: { id: validToken.userId },
      })

      if (!user) {
        throw new Error('USER_NOT_FOUND')
      }

      // Se for token de verificação, atualizar o usuário como verificado
      if (type === 'VERIFICATION') {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            emailVerified: new Date(),
            status: 'ACTIVE'
          },
        })
      }

      return { user, token: validToken }
    })

    logger.info(`Token ${type} validado com sucesso para usuário ${result.user.id}`)
    return NextResponse.json({ message: 'Token válido' }, { status: 200 })
  } catch (error) {
    logger.error('Erro na validação de token', error instanceof Error ? { message: error.message, stack: error.stack } : { error })
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 400 })
  }
}
