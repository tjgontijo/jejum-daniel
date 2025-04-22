import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import type { User } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || 'segredo-temporario-para-desenvolvimento',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string; 
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais incompletas');
          return null;
        }

        try {
          // Busca usuário pelo e-mail
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Verifica se o usuário existe e tem senha
          if (!user || !user.passwordHash) {
            console.log('Usuário não encontrado ou sem senha:', credentials.email);
            return null;
          }

          // Valida a senha
          const isPasswordValid = await compare(credentials.password, user.passwordHash);
          if (!isPasswordValid) {
            console.log('Senha inválida para:', credentials.email);
            return null;
          }

          // Retorna apenas campos básicos
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          } as User;
        } catch (error) {
          console.error('Erro durante autenticação:', error);
          return null;
        }
      },
    }),
  ],
};
