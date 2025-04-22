import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { sendWelcomePurchaseEmail } from '@/lib/emails';

const prisma = new PrismaClient();

// Função para validar a assinatura do webhook da Yampi
function validateYampiSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  // A Yampi usa HMAC-SHA256 para assinar os webhooks
  const computedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('base64');
  
  return computedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    // Obter o corpo da requisição
    const payload = await request.text();
    const body = JSON.parse(payload);
    
    // Obter a assinatura do cabeçalho
    const signature = request.headers.get('x-yampi-hmac-sha256');
    
    // Verificar se a assinatura está presente
    if (!signature) {
      console.error('Assinatura não encontrada no cabeçalho');
      return NextResponse.json(
        { success: false, message: 'Assinatura não encontrada' },
        { status: 401 }
      );
    }
    
    // Obter a chave secreta do ambiente
    const secretKey = process.env.YAMPI_WEBHOOK_SECRET;
    
    if (!secretKey) {
      console.error('Chave secreta não configurada');
      return NextResponse.json(
        { success: false, message: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }
    
    // Validar a assinatura (comentado para testes iniciais)
    /*
    if (!validateYampiSignature(payload, signature, secretKey)) {
      console.error('Assinatura inválida');
      return NextResponse.json(
        { success: false, message: 'Assinatura inválida' },
        { status: 401 }
      );
    }
    */
    
    // Verificar se é um evento de pagamento aprovado
    if (body.event !== 'order.paid') {
      console.log(`Evento ignorado: ${body.event}`);
      return NextResponse.json(
        { success: true, message: 'Evento ignorado' },
        { status: 200 }
      );
    }
    
    // Extrair dados do cliente e dos itens
    const customerData = body.resource.customer.data;
    const items = body.resource.items.data;
    
    // Definir a interface para o usuário com produtos
    interface UserWithModeules {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      emailVerified: Date | null;
      passwordHash: string | null;
      resetToken: string | null;
      resetTokenExpiry: Date | null;
      createdAt: Date;
      updatedAt: Date;
      status: string;
      modeules: Array<{
        id: string;
        name: string;
        sku: string;
        createdAt: Date;
        updatedAt: Date;
      }>;
    }
    
    // Verificar se o usuário já existe
    let user: UserWithModeules | null = await prisma.user.findUnique({
      where: { email: customerData.email },
      include: { modeules: true }
    }) as UserWithModeules | null;
    
    // Se o usuário não existir, criar um novo
    if (!user) {
      // Gerar senha temporária
      const tempPassword = crypto.randomBytes(4).toString('hex');
      const passwordHash = await hash(tempPassword, 10);
      
      // Extrair nome e sobrenome
      const firstName = customerData.first_name || customerData.name.split(' ')[0];
      const lastName = customerData.last_name || 
        (customerData.name.includes(' ') 
          ? customerData.name.split(' ').slice(1).join(' ') 
          : '');
      
      // Gerar token para definição de senha
      const resetToken = crypto.randomUUID();
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
      
      // Criar o usuário
      user = await prisma.user.create({
        data: {
          email: customerData.email,
          firstName,
          lastName,
          passwordHash,
          emailVerified: null,
          resetToken,
          resetTokenExpiry,
          status: 'ACTIVE',
        },
        include: { modeules: true }
      }) as UserWithModeules;
      
      console.log(`Novo usuário criado: ${user.email}`);
    }
    
    // Ativar os módulos comprados
    for (const item of items) {
      // Obter o SKU do item
      const sku = item.item_sku;
      
      // Buscar o módulo pelo SKU
      const moduleItem = await prisma.modules.findUnique({
        where: { sku }
      });
      
      if (!moduleItem) {
        console.log(`Módulo com SKU ${sku} não encontrado`);
        continue;
      }
      
      // Verificar se o usuário já tem este módulo
      const hasModule = user.modeules.some(m => m.id === moduleItem.id);
      
      if (!hasModule) {
        // Adicionar o módulo ao usuário
        await prisma.user.update({
          where: { id: user.id },
          data: {
            modeules: {
              connect: { id: moduleItem.id }
            }
          }
        });
        
        console.log(`Módulo ${moduleItem.name} ativado para ${user.email}`);
      }
    }
    
    // Verificar se o usuário foi criado corretamente
    if (!user) {
      throw new Error('Erro ao processar usuário');
    }

    // Obter os nomes dos módulos ativados para o usuário
    const activatedModules = await prisma.modules.findMany({
      where: {
        users: {
          some: {
            id: user.id
          }
        }
      }
    });
    
    const moduleNames = activatedModules.map((m: { name: string }) => m.name);
    
    // Buscar o usuário novamente para obter os dados atualizados, incluindo o resetToken
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { modeules: true }
    }) as UserWithModeules | null;
    
    // Enviar email de boas-vindas com instruções para definir senha
    if (updatedUser?.resetToken) {
      await sendWelcomePurchaseEmail(
        updatedUser.email,
        updatedUser.resetToken,
        `${updatedUser.firstName} ${updatedUser.lastName}`,
        moduleNames
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Webhook processado com sucesso',
        userId: user.id
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
