import { AppProvider } from '@/app/providers/AppProvider';
import { WeatherDataStatus } from '@/modules/data-access/ui/WeatherDataStatus';
import { LayerToggle } from '@/features/layer-toggle/ui/LayerToggle';
import { TimelineControl } from '@/features/timeline-control/ui/TimelineControl';

function App() {
  return (
    <AppProvider>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 px-6 py-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Weather Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Интерактивная карта погодных данных
          </p>
        </header>

        <div className="grid gap-6 p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <LayerToggle />
            <WeatherDataStatus />
          </aside>

          <section className="space-y-6">
            <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center">
              <div>
                <p className="font-medium text-slate-300">
                  Здесь появится интерактивная карта
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Следующим шагом подключим MapLibre GL JS
                </p>
              </div>
            </div>

            <TimelineControl />
          </section>
        </div>
      </main>
    </AppProvider>
  );
}

export default App;
