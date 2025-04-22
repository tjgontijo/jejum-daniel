import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { faker } from '@faker-js/faker/locale/pt_BR'

const prisma = new PrismaClient()

function generateRandomUser(_index: number) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    firstName,
    lastName,
  };
}

export async function seedUsers() {
  const senhaPadrao = '12345678';
  const senhaHash = await hash(senhaPadrao, 10);

  // Buscar o módulo FRONT
  const frontModule = await prisma.modules.findUnique({
    where: { sku: 'FRONT' },
  });
  if (!frontModule) {
    throw new Error('Módulo FRONT não encontrado. Rode o seed dos módulos primeiro!');
  }

  for (let i = 0; i < 5; i++) {
    const userData = generateRandomUser(i);
    await prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: senhaHash,
        emailVerified: null,
        modeules: {
          connect: [{ id: frontModule.id }],
        },
      },
    });
  }

  console.log('Usuários criados! Senha padrão: 12345678 e todos com módulo FRONT habilitado.');

  await prisma.$disconnect();
}
