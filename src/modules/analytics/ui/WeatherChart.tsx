import { useEffect, useMemo, useRef, useState } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceDot,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
    WEATHER_LAYERS,
    type WeatherLayerId,
} from '@/entities/weather-layer/model/types';

type ChartPoint = {
    timeId: string;
    time: string;
} & Partial<Record<WeatherLayerId, number | null>>;

export function WeatherChart() {
    const dispatch = useAppDispatch();

    const {
        dataset,
        activeLayers,
        selectedTimeIndex,
        selectedLocationId,
    } = useAppSelector((state) => ({
        dataset: state.dataset,
        activeLayers: state.activeLayers,
        selectedTimeIndex: state.selectedTimeIndex,
        selectedLocationId: state.selectedLocationId,
    }));

    const locations = dataset?.locations ?? [];

    const [visibleLayerIds, setVisibleLayerIds] =
        useState<WeatherLayerId[]>(activeLayers);

    const previousActiveLayers = useRef<WeatherLayerId[]>(activeLayers);

    useEffect(() => {
        setVisibleLayerIds((current) => {
            const stillActive = current.filter((id) =>
                activeLayers.includes(id),
            );

            const newlyActive = activeLayers.filter(
                (id) => !previousActiveLayers.current.includes(id),
            );

            return [
                ...stillActive,
                ...newlyActive.filter((id) => !stillActive.includes(id)),
            ];
        });

        previousActiveLayers.current = [...activeLayers];
    }, [activeLayers]);

    const locationId =
        locations.find((location) => location.id === selectedLocationId)?.id ??
        locations[0]?.id;

    const availableLayers = WEATHER_LAYERS.filter((layer) =>
        activeLayers.includes(layer.id),
    );

    const visibleLayers = availableLayers.filter((layer) =>
        visibleLayerIds.includes(layer.id),
    );

    const safeTimeIndex =
        dataset && dataset.timePoints.length > 0
            ? Math.max(
                0,
                Math.min(selectedTimeIndex, dataset.timePoints.length - 1),
            )
            : 0;

    const selectedTimeId = dataset?.timePoints[safeTimeIndex]?.id;

    const chartData = useMemo<ChartPoint[]>(() => {
        if (!dataset || !locationId) return [];

        const timeLabels = new Map(
            dataset.timePoints.map((point) => [point.id, point.label]),
        );

        return dataset.frames.map((frame) => {
            const measurement = frame.measurements.find(
                (item) => item.locationId === locationId,
            );

            const values = Object.fromEntries(
                WEATHER_LAYERS.map((layer) => [
                    layer.id,
                    measurement?.values[layer.id] ?? null,
                ]),
            ) as Record<WeatherLayerId, number | null>;

            return {
                timeId: frame.timeId,
                time: timeLabels.get(frame.timeId) ?? frame.timeId,
                ...values,
            };
        });
    }, [dataset, locationId]);

    const currentPoint = chartData.find(
        (point) => point.timeId === selectedTimeId,
    );

    const toggleLayerVisibility = (layerId: WeatherLayerId) => {
        setVisibleLayerIds((current) =>
            current.includes(layerId)
                ? current.filter((id) => id !== layerId)
                : [...current, layerId],
        );
    };

    if (!dataset || locations.length === 0) {
        return (
            <section
                aria-label="Загрузка аналитики погоды"
                aria-busy="true"
                className="animate-pulse rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5"
            >
                <div>
                    <div className="h-6 w-44 rounded-md bg-slate-800" />
                    <div className="mt-2 h-4 w-52 max-w-full rounded-md bg-slate-800" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    {[1, 2].map((item) => (
                        <div key={item} className="space-y-2">
                            <div className="h-3 w-16 rounded bg-slate-800" />
                            <div className="h-10 rounded-lg border border-slate-800 bg-slate-950/60" />
                        </div>
                    ))}
                </div>

                <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                    <div className="h-3 w-36 rounded bg-slate-800" />
                    <div className="mt-3 h-8 w-24 rounded bg-slate-800" />
                    <div className="mt-2 h-3 w-40 max-w-full rounded bg-slate-800" />
                </div>

                <div className="mt-4 flex h-64 items-end gap-2 rounded-lg bg-slate-950/40 p-4">
                    {[35, 55, 42, 75, 60, 85, 48, 68, 90, 58, 72, 45].map(
                        (height, index) => (
                            <div
                                key={index}
                                className="flex-1 rounded-t bg-slate-800"
                                style={{ height: `${height}%` }}
                            />
                        ),
                    )}
                </div>

                <div className="mt-4 h-3 w-48 rounded bg-slate-800" />
            </section>
        );
    }

    const selectedLocation = locations.find(
        (location) => location.id === locationId,
    );

    return (
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <div>
                <h2 className="text-lg font-semibold">Аналитика погоды</h2>
                <p className="mt-1 text-sm text-slate-400">
                    Изменение показателей за сутки
                </p>
            </div>

            <div className="mt-4">
                <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-400">
                    Локация
                    <div className="relative">
                        <select
                            value={locationId ?? ''}
                            onChange={(event) =>
                                dispatch({
                                    selectedLocationId: event.target.value,
                                })
                            }
                            className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 py-2 pl-3 pr-9 text-sm text-slate-100 outline-none transition focus:border-sky-500"
                        >
                            {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                    </div>
                </label>
            </div>

            {availableLayers.length > 0 ? (
                <>
                    <div className="mt-4">
                        <p className="mb-2 text-xs font-medium text-slate-400">
                            Линии на графике
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {availableLayers.map((layer) => {
                                const isVisible = visibleLayerIds.includes(layer.id);

                                return (
                                    <button
                                        key={layer.id}
                                        type="button"
                                        aria-pressed={isVisible}
                                        onClick={() => toggleLayerVisibility(layer.id)}
                                        style={{
                                            borderColor: isVisible ? layer.color : '#334155',
                                            backgroundColor: isVisible
                                                ? `${layer.color}18`
                                                : 'transparent',
                                        }}
                                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${isVisible
                                                ? 'text-slate-100'
                                                : 'text-slate-400 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <span
                                            className="size-2.5 rounded-full"
                                            style={{ backgroundColor: layer.color }}
                                        />
                                        {layer.name}
                                        <span className="text-slate-500">{layer.unit}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {visibleLayers.length > 0 ? (
                        <>
                            <div
                                className={`mt-4 grid gap-2 ${visibleLayers.length === 1
                                        ? 'grid-cols-1'
                                        : visibleLayers.length === 2
                                            ? 'grid-cols-2'
                                            : 'grid-cols-1 sm:grid-cols-3'
                                    }`}
                            >
                                {visibleLayers.map((layer) => {
                                    const value = currentPoint?.[layer.id];
                                    const hasValue =
                                        typeof value === 'number' && Number.isFinite(value);

                                    return (
                                        <div
                                            key={layer.id}
                                            className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{ backgroundColor: layer.color }}
                                                />
                                                <p className="truncate text-xs text-slate-400">
                                                    {layer.name}
                                                </p>
                                            </div>

                                            <p className="mt-2 text-xl font-semibold tabular-nums text-slate-100">
                                                {hasValue ? value : '—'}{' '}
                                                <span className="text-sm font-normal text-slate-400">
                                                    {layer.unit}
                                                </span>
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {currentPoint?.time ?? 'Время не выбрано'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div
                                className="mt-4 h-72 w-full min-w-0"
                                aria-label={`График погоды для ${selectedLocation?.name ?? 'выбранной локации'
                                    }`}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 12,
                                            right: 8,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            stroke="#334155"
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="time"
                                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                                            axisLine={{ stroke: '#475569' }}
                                            tickLine={false}
                                            minTickGap={16}
                                        />

                                        {visibleLayers.map((layer, index) => (
                                            <YAxis
                                                key={layer.id}
                                                yAxisId={layer.id}
                                                orientation={index === 0 ? 'left' : 'right'}
                                                offset={index > 1 ? (index - 1) * 42 : 0}
                                                width={visibleLayers.length > 1 ? 34 : 42}
                                                tick={{ fill: layer.color, fontSize: 10 }}
                                                axisLine={false}
                                                tickLine={false}
                                                domain={['auto', 'auto']}
                                            />
                                        ))}

                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#f1f5f9',
                                            }}
                                            labelStyle={{ color: '#94a3b8' }}
                                            formatter={(value, name) => {
                                                const layer = WEATHER_LAYERS.find(
                                                    (item) => item.id === String(name),
                                                );

                                                return [
                                                    `${value ?? '—'} ${layer?.unit ?? ''}`,
                                                    layer?.name ?? String(name),
                                                ];
                                            }}
                                        />

                                        {visibleLayers.map((layer) => (
                                            <Line
                                                key={layer.id}
                                                type="monotone"
                                                dataKey={layer.id}
                                                name={layer.id}
                                                yAxisId={layer.id}
                                                stroke={layer.color}
                                                strokeWidth={2.5}
                                                dot={false}
                                                activeDot={{
                                                    r: 5,
                                                    fill: layer.color,
                                                    stroke: '#0f172a',
                                                    strokeWidth: 2,
                                                }}
                                                connectNulls
                                                isAnimationActive={false}
                                            />
                                        ))}

                                        {visibleLayers.map((layer) => {
                                            const value = currentPoint?.[layer.id];

                                            if (
                                                typeof value !== 'number' ||
                                                !Number.isFinite(value) ||
                                                !currentPoint
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <ReferenceDot
                                                    key={layer.id}
                                                    x={currentPoint.time}
                                                    y={value}
                                                    yAxisId={layer.id}
                                                    r={5}
                                                    fill="#fbbf24"
                                                    stroke={layer.color}
                                                    strokeWidth={2}
                                                />
                                            );
                                        })}
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                                <span className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-amber-400" />
                                    Выбранное время на таймлайне
                                </span>

                                <span className="text-slate-500">
                                    Шкалы показателей независимы
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                            Выберите хотя бы одну линию, чтобы отобразить её на графике.
                        </div>
                    )}
                </>
            ) : (
                <div className="mt-5 rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                    Включите хотя бы один погодный слой в блоке «Погодные слои».
                </div>
            )}
        </section>
    );
}
