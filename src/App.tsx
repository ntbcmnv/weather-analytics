import { useAppDispatch, useAppSelector } from '@/app/store';
import { AppProvider } from '@/app/providers/AppProvider';
import { DataStatus } from '@/shared/ui/DataStatus';
import { LayerToggle } from '@/features/layer-toggle/ui/LayerToggle';
import { TimelineControl } from '@/features/timeline-control/ui/TimelineControl';

import { lazy, Suspense } from 'react';

const WeatherMap = lazy(() =>
    import('@/modules/map/ui/WeatherMap').then((module) => ({
        default: module.WeatherMap,
    })),
);

const WeatherChart = lazy(() =>
    import('@/modules/analytics/ui/WeatherChart').then((module) => ({
        default: module.WeatherChart,
    })),
);

function AppContent() {
    const dispatch = useAppDispatch();

    const { loadingStatus, error, retryCount } = useAppSelector(
        (state) => ({
            loadingStatus: state.loadingStatus,
            error: state.error,
            retryCount: state.retryCount,
        }),
    );

    const handleRetry = () => {
        dispatch({ retryCount: retryCount + 1 });
    };

    return (
        <>
            <DataStatus
                status={loadingStatus}
                error={error}
                onRetry={handleRetry}
            />

            <main className="min-h-screen bg-slate-950 text-slate-100">
                <header className="border-b border-slate-800 px-4 py-4 sm:px-6 sm:py-5">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Weather Analytics
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Интерактивная карта погодных данных Кыргызстана
                    </p>
                </header>

                <div className="mx-auto grid max-w-[1800px] grid-cols-1 items-start gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-12">
                    <section className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-7">
                        <Suspense
                            fallback={
                                <div className="min-h-72 animate-pulse rounded-xl bg-slate-900" />
                            }
                        >
                            <WeatherMap />
                        </Suspense>
                        <TimelineControl />
                    </section>

                    <aside className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-5">
                        <LayerToggle />
                        <Suspense
                            fallback={
                                <div className="min-h-72 animate-pulse rounded-xl bg-slate-900" />
                            }
                        >
                            <WeatherChart />
                        </Suspense>
                    </aside>
                </div>
            </main>
        </>
    );
}

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
