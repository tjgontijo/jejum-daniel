export function getWelcomePurchaseEmailTemplate(
  setPasswordUrl: string,
  name: string,
  modules: string[]
) {
  const modulesList = modules
    .map((module) => `<li>${module}</li>`)
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
      <h2 style="color: #333; text-align: center;">Bem-vindo ao Jejum de Daniel!</h2>
      
      <p>Olá, ${name}!</p>
      
      <p>Sua compra foi processada com sucesso e seu acesso já está disponível.</p>
      
      <p>Você adquiriu acesso aos seguintes módulos:</p>
      
      <ul style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        ${modulesList}
      </ul>
      
      <p>Para acessar seu conteúdo, você precisa criar uma senha para sua conta:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${setPasswordUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Criar minha senha
        </a>
      </div>
      
      <p>Este link é válido por 24 horas. Após criar sua senha, você terá acesso completo a todo o conteúdo que adquiriu.</p>
      
      <p>Se você tiver qualquer dúvida, responda a este email ou entre em contato com nossa equipe de suporte.</p>
      
      <p>Agradecemos por escolher o Jejum de Daniel!</p>
      
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
      
      <p style="text-align: center; color: #777; font-size: 12px;">
        © ${new Date().getFullYear()} Jejum de Daniel. Todos os direitos reservados.
      </p>
    </div>
  `;
}
