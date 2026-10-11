import { Layers3 } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
    WEATHER_LAYERS,
    type WeatherLayerId,
} from '@/entities/weather-layer/model/types';

export function LayerToggle() {
    const dispatch = useAppDispatch();

    const { activeLayers } = useAppSelector((state) => ({
        activeLayers: state.activeLayers,
    }));

    const toggleLayer = (layerId: WeatherLayerId) => {
        dispatch((state) => ({
            activeLayers: state.activeLayers.includes(layerId)
                ? state.activeLayers.filter((id) => id !== layerId)
                : [...state.activeLayers, layerId],
        }));
    };

    return (
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-lg sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-800 p-2.5 text-sky-400">
                        <Layers3 size={20} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-50">
                            Погодные слои
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-400">
                            Настройте отображение карты
                        </p>
                    </div>
                </div>

                <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium tabular-nums text-slate-300">
                    {activeLayers.length} из {WEATHER_LAYERS.length}
                </span>
            </div>

            <div className="space-y-2">
                {WEATHER_LAYERS.map((layer) => {
                    const isActive = activeLayers.includes(layer.id);

                    return (
                        <label
                            key={layer.id}
                            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${isActive
                                    ? 'border-slate-500 bg-slate-800'
                                    : 'border-slate-800 bg-slate-900 hover:border-slate-600 hover:bg-slate-800/60'
                                }`}
                        >
                            <span className="flex min-w-0 items-center gap-3">
                                <span
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive
                                            ? 'bg-slate-700'
                                            : 'bg-slate-800'
                                        }`}
                                >
                                    <span
                                        className={`size-3 rounded-full transition-all ${isActive
                                                ? 'ring-4 ring-white/5'
                                                : 'opacity-40'
                                            }`}
                                        style={{
                                            backgroundColor: layer.color,
                                        }}
                                    />
                                </span>

                                <span className="min-w-0">
                                    <span
                                        className={`block text-sm font-medium ${isActive
                                                ? 'text-slate-50'
                                                : 'text-slate-400'
                                            }`}
                                    >
                                        {layer.name}
                                    </span>

                                    <span className="mt-0.5 block text-xs text-slate-500">
                                        Единицы: {layer.unit}
                                    </span>
                                </span>
                            </span>

                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => toggleLayer(layer.id)}
                                aria-label={`Включить слой «${layer.name}»`}
                                className="size-4 shrink-0 cursor-pointer rounded border-slate-600 bg-slate-800 accent-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                            />
                        </label>
                    );
                })}
            </div>

            {activeLayers.length === 0 && (
                <p className="mt-3 rounded-lg bg-slate-800/70 px-3 py-2 text-xs leading-relaxed text-slate-400">
                    Все слои отключены. Выберите хотя бы один показатель для отображения на карте.
                </p>
            )}
        </section>
    );
}
