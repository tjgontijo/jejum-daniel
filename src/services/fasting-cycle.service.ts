import { prisma } from '@/lib/prisma';

/**
 * Serviço para gerenciar operações relacionadas aos ciclos de jejum
 */
export class FastingCycleService {
  /**
   * Busca o ciclo de jejum ativo do usuário
   * @param userId ID do usuário
   * @returns Ciclo de jejum ativo ou null se não existir
   */
  static async getActiveCycle(userId: string) {
    return await prisma.fastingCycle.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  /**
   * Calcula o progresso do ciclo de jejum
   * @param cycleStartDate Data de início do ciclo
   * @param cycleEndDate Data de término do ciclo (opcional)
   * @returns Objeto com informações de progresso
   */
  static calculateProgress(cycleStartDate: Date, cycleEndDate: Date | null = null) {
    const startDate = new Date(cycleStartDate);
    const today = new Date();
    
    // Calcular dias decorridos
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = Math.min(diffDays, 21); // Limitar a 21 dias
    
    // Calcular data de término (21 dias após o início)
    const endDate = cycleEndDate || 
      new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000);
    
    return {
      currentDay,
      totalDays: 21, // Jejum de Daniel é sempre 21 dias
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }
}
