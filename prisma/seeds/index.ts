import { PrismaClient } from '@prisma/client'
import { seedUsers } from './seed-users'
import { seedModules } from './seed-modules'

const prisma = new PrismaClient();

async function cleanDatabase() {  
  // Limpar tabelas na ordem correta para evitar erros de chave estrangeira
  try {
    // Primeiro desconectar todas as relações entre usuários e módulos
    await prisma.$executeRaw`UPDATE "User" SET "products" = '{}' WHERE "email" LIKE '%@%'`;
    console.log('Relações entre usuários e módulos removidas');
  } catch (error) {
    console.log('Nenhuma relação usuário-módulo para limpar');
  }
  
  // Agora podemos excluir com segurança
  await prisma.user.deleteMany();
  await prisma.modules.deleteMany();
}

async function createInitialData() {  
  await cleanDatabase();
  try {    
    await seedModules();
    await seedUsers();  
  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
    throw error; // Garante que o erro será propagado
  }
}

createInitialData()
  .catch((error) => {
    if (error instanceof Error) {
      } else {
      }
  })
  .finally(() => {
    prisma.$disconnect();
  
  });
