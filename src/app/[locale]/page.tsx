'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { useSessionRedirect } from '@/hooks/use-session'

function SignInPageContent() {
  const { session, status } = useSessionRedirect('/dashboard')
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams?.get('registered')
  const email = searchParams?.get('email')

  const [formData, setFormData] = useState({
    email: email || '',
    password: '',
  })
  const [errorState, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(registered === 'true')

  useEffect(() => {
    if (registered === 'true') {
      setSuccess(true)
      // Limpar o parâmetro da URL para evitar mostrar a mensagem novamente
      router.replace('/auth/signin')
    }
  }, [registered, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Usando callbackUrl para redirecionar após login bem-sucedido
      // Isso evita expor credenciais na URL
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        // Traduzir mensagens de erro específicas
        const errorMessages: { [key: string]: string } = {
          'CredentialsSignin': 'Email ou senha incorretos. Verifique suas credenciais.',
          'default': 'Ocorreu um erro ao fazer login. Tente novamente.'
        }
        
        setError(errorMessages[result.error] || errorMessages['default'])
      } else if (result?.url) {
        // Usar router.replace em vez de push para não adicionar à história do navegador
        router.replace(result.url)
      }
    } catch {
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <>      
      <div className="flex min-h-screen w-full bg-[var(--theme-color)] items-center justify-center px-3 py-12">
        <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image 
            src="/icons/logo.png" 
            alt="Jejum Daniel" 
            width={120} 
            height={120} 
            className="rounded-full shadow-lg"
          />
        </div>      
        <div className="transform bg-[var(--theme-color)] px-4 py-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-[var(--accent-color)]/20 sm:rounded-lg sm:px-10">
          {success && (
            <div className="animate-fadeIn mb-4 rounded-md border border-green-700 bg-green-900/70 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-400 dark:text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-200">
                    Sua conta foi criada com sucesso! 
                    Por favor, verifique seu email para confirmar o cadastro.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorState && (
            <div className="animate-fadeIn mb-4 rounded-md border border-red-700 bg-red-900/70 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-200">{errorState}</p>
                </div>
              </div>
            </div>
          )}
        <div className="sm:mx-auto sm:w-full sm:max-w-md pb-8">
          <h2 className="text-center text-3xl font-bold text-[var(--accent-color)] transition-colors duration-200">
            Jejum de Daniel
          </h2>
        </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--text-color)]">
                Email
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="h-5 w-5 text-[var(--text-color)]/80" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-[var(--accent-color)]/10 bg-[var(--theme-color-light)] py-3 pl-10 text-[var(--text-color)] placeholder-[var(--text-color)]/40 shadow-sm transition-all duration-200 hover:border-[var(--accent-color)]/30 focus:border-[var(--accent-color)]/60 focus:ring-1 focus:ring-[var(--accent-color)]/20 sm:text-sm"
                  placeholder="seuemail@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--text-color)]">
                Senha
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-[var(--text-color)]/80" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-[var(--accent-color)]/10 bg-[var(--theme-color-light)] py-3 pl-10 text-[var(--text-color)] placeholder-[var(--text-color)]/40 shadow-sm transition-all duration-200 hover:border-[var(--accent-color)]/30 focus:border-[var(--accent-color)]/60 focus:ring-1 focus:ring-[var(--accent-color)]/20 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--accent-color)]/30 text-[var(--accent-color)] focus:ring-[var(--accent-color)]/50"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[var(--text-color)]">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/reset-password-request"
                  className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-color)]/80"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-[var(--accent-color)] px-4 py-3 text-sm font-medium text-[var(--theme-color)] shadow-md hover:bg-[var(--accent-color)]/90 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]/70 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>


              <div className="mt-6 text-center">
          <p className="text-sm text-zinc-300">
            Não tem uma conta?{' '}
            <Link
              href="#"
              className="font-medium text-[var(--accent-color)] hover:text-[var(--accent-color)]/80"
            >
              Inscreva-se
            </Link>
          </p>
        </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignInPageContent />
    </Suspense>
  )
}
