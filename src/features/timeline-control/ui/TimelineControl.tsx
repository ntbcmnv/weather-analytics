import { useEffect, useState } from 'react';
import {
    Clock3,
    Pause,
    Play,
    SkipBack,
    SkipForward,
} from 'lucide-react';

import {
    useAppDispatch,
    useAppSelector,
} from '@/app/store';

export function TimelineControl() {
    const { dataset, selectedTimeIndex } = useAppSelector((state) => ({
        dataset: state.dataset,
        selectedTimeIndex: state.selectedTimeIndex,
    }));

    const dispatch = useAppDispatch();
    const [isPlaying, setIsPlaying] = useState(false);

    const timePoints = dataset?.timePoints ?? [];

    const safeIndex = Math.max(
        0,
        Math.min(selectedTimeIndex, timePoints.length - 1),
    );

    useEffect(() => {
        if (!isPlaying || timePoints.length < 2) {
            return;
        }

        const intervalId = window.setInterval(() => {
            if (safeIndex >= timePoints.length - 1) {
                setIsPlaying(false);
                return;
            }

            dispatch({ selectedTimeIndex: safeIndex + 1 });
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [isPlaying, safeIndex, timePoints.length, dispatch]);

    useEffect(() => {
        if (timePoints.length === 0 && isPlaying) {
            return;
        }
    }, [timePoints.length, isPlaying]);

    if (!timePoints.length) {
        return (
            <section
                aria-label="Загрузка почасового прогноза"
                aria-busy="true"
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-xl shadow-slate-950/10"
            >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-xl bg-slate-800" />
                        <div className="h-5 w-48 max-w-full rounded-md bg-slate-800" />
                    </div>

                    <div className="h-12 w-28 rounded-xl bg-slate-800" />
                </div>

                <div className="p-5 sm:px-6 sm:py-5">
                    <div className="flex items-center justify-center gap-4">
                        <div className="size-11 rounded-xl bg-slate-800" />
                        <div className="size-12 rounded-2xl bg-slate-700" />
                        <div className="size-11 rounded-xl bg-slate-800" />
                    </div>

                    <div className="mt-7 h-2 rounded-full bg-slate-800" />

                    <div className="mt-3 flex justify-between gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                            <div
                                key={item}
                                className="h-6 w-9 rounded-md bg-slate-800"
                            />
                        ))}
                    </div>

                    <div className="mt-4 h-3 w-72 max-w-full rounded bg-slate-800" />
                </div>
            </section>
        );
    }

    const selectedTime = timePoints[safeIndex];

    const changeTime = (index: number) => {
        const nextIndex = Math.max(
            0,
            Math.min(index, timePoints.length - 1),
        );

        dispatch({ selectedTimeIndex: nextIndex });
    };

    const progress =
        timePoints.length > 1
            ? (safeIndex / (timePoints.length - 1)) * 100
            : 0;

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-xl shadow-slate-950/10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-800 p-2.5 text-amber-400">
                        <Clock3 size={21} />
                    </div>

                    <h2 className="font-semibold text-slate-50">
                        Почасовой прогноз погоды
                    </h2>
                </div>

                <div className="min-w-28 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-center">
                    <span className="mt-0.5 block text-xl font-bold tabular-nums text-amber-400">
                        {selectedTime.label}
                    </span>
                </div>
            </div>

            <div className="p-5 sm:px-6 sm:py-5">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        aria-label="Предыдущий час"
                        title="Предыдущий час"
                        disabled={safeIndex === 0}
                        onClick={() => changeTime(safeIndex - 1)}
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-500 hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        <SkipBack size={19} />
                    </button>

                    <button
                        type="button"
                        aria-label={isPlaying ? 'Остановить прогноз' : 'Воспроизвести прогноз'}
                        title={isPlaying ? 'Пауза' : 'Воспроизвести прогноз'}
                        onClick={() => {
                            if (safeIndex >= timePoints.length - 1) {
                                changeTime(0);
                                setIsPlaying(true);
                                return;
                            }

                            setIsPlaying((playing) => !playing);
                        }}
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/10 transition hover:bg-amber-300 active:scale-95"
                    >
                        {isPlaying ? (
                            <Pause size={21} fill="currentColor" />
                        ) : (
                            <Play
                                size={21}
                                className="translate-x-0.5"
                                fill="currentColor"
                            />
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label="Следующий час"
                        title="Следующий час"
                        disabled={safeIndex === timePoints.length - 1}
                        onClick={() => changeTime(safeIndex + 1)}
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-500 hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                    >
                        <SkipForward size={19} />
                    </button>
                </div>

                <div className="relative mt-7">
                    <input
                        aria-label="Выбор часа прогноза"
                        type="range"
                        min={0}
                        max={timePoints.length - 1}
                        step={1}
                        value={safeIndex}
                        onChange={(event) =>
                            changeTime(Number(event.target.value))
                        }
                        style={{
                            background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${progress}%, #334155 ${progress}%, #334155 100%)`,
                        }}
                        className="timeline-slider block h-2 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
                    />

                    <div className="mt-3 flex items-center justify-between gap-1">
                        {timePoints.map((point, index) =>
                            index % 3 === 0 ||
                                index === timePoints.length - 1 ? (
                                <button
                                    key={point.id}
                                    type="button"
                                    onClick={() => changeTime(index)}
                                    className={`rounded-md px-1.5 py-1 text-xs tabular-nums transition ${index === safeIndex
                                        ? 'bg-slate-700 font-semibold text-amber-400'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        }`}
                                >
                                    {point.label}
                                </button>
                            ) : null,
                        )}
                    </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                    Перемещайте ползунок или используйте кнопки, чтобы просматривать изменения погоды по часам.
                </p>
            </div>
        </section>
    );
}
