import { useAppSelector } from '@/app/store';

export function WeatherDataStatus() {
    const { loadingStatus, error, dataset } = useAppSelector((state) => ({
        loadingStatus: state.loadingStatus,
        error: state.error,
        dataset: state.dataset,
    }));

    if (loadingStatus === 'loading' || loadingStatus === 'idle') {
        return <p className="text-slate-400">Загружаем погодные данные...</p>;
    }

    if (loadingStatus === 'error') {
        return (
            <p role="alert" className="text-red-400">
                Ошибка загрузки: {error}
            </p>
        );
    }

    return (
        <p className="text-emerald-400">
            Загружено локаций: {dataset?.locations.length ?? 0} ·{' '}
            Временных точек: {dataset?.timePoints.length ?? 0}
        </p>
    );
}
