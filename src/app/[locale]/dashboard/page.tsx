import LogoutButton from '@/components/dashboard/logout-button';

export default async function DashboardPage() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-zinc-400 font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="text-zinc-200">Bem-vindo ao seu painel de controle do Jejum Daniel.</p>
    </div>
  );
}