import { AppProvider } from '@/app/providers/AppProvider';
import { LoaderCircle } from 'lucide-react';

function App() {
  return (
    <AppProvider>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 px-6 py-4">
          <h1 className="text-xl font-semibold">
            Weather Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Интерактивная карта погодных данных
          </p>
        </header>

        <section className="p-6 flex items-center justify-center gap-2">
          <LoaderCircle className="animate-spin text-slate-400" />
          <p className="text-slate-400">
            Подготавливаем карту и аналитику...
          </p>
        </section>
      </main>
    </AppProvider>
  );
}

export default App;
