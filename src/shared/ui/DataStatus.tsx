import { AlertCircle, LoaderCircle, RefreshCw } from 'lucide-react';

interface DataStatusProps {
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
    onRetry: () => void;
}

export function DataStatus({
    status,
    error,
    onRetry,
}: DataStatusProps) {
    if (status === 'success') {
        return null;
    }

    if (status === 'idle' || status === 'loading') {
        return (
            <div
                role="status"
                aria-live="polite"
                className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center"
            >
                <LoaderCircle
                    size={28}
                    className="animate-spin text-amber-400"
                />
                <div>
                    <p className="font-medium text-slate-100">
                        Загружаем погодные данные
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                        Получаем прогноз для городов Кыргызстана…
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            role="alert"
            className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-red-900/60 bg-slate-900/70 p-6 text-center"
        >
            <AlertCircle size={28} className="text-red-400" />

            <div>
                <p className="font-medium text-slate-100">
                    Не удалось загрузить данные
                </p>
                <p className="mt-1 max-w-lg text-sm text-slate-400">
                    {error || 'Проверьте подключение к интернету и попробуйте ещё раз.'}
                </p>
            </div>

            <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
                <RefreshCw size={16} />
                Повторить
            </button>
        </div>
    );
}
