import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedModules() {
  // Lista de módulos disponíveis
  const modules = [
    {
      name: 'Jejum de Daniel - 21 dias de fé e oração',
      sku: 'FRONT',
    },
    {
      name: '50 Receitas para o Jejum de Daniel',
      sku: 'ORDERBUMP1',
    },
    {
      name: 'Comunidade',
      sku: 'ORDERBUMP2',
    },
  ]

  // Criar cada módulo
  for (const moduleData of modules) {
    await prisma.modules.upsert({
      where: { sku: moduleData.sku },
      update: moduleData,
      create: moduleData,
    })
  }

  console.log('Módulos criados com sucesso!')
}