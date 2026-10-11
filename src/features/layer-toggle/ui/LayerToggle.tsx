import { Layers3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { WEATHER_LAYERS } from '@/entities/weather-layer/model/types';
import type { WeatherLayerId } from '@/entities/weather-layer/model/types';

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
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Layers3 size={18} className="text-sky-400" />
        <h2 className="font-semibold">Погодные слои</h2>
      </div>

      <div className="space-y-3">
        {WEATHER_LAYERS.map((layer) => {
          const isActive = activeLayers.includes(layer.id);

          return (
            <label
              key={layer.id}
              className="flex cursor-pointer items-center justify-between gap-3"
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-sm text-slate-200">
                  {layer.name}
                  <span className="ml-1 text-slate-500">
                    ({layer.unit})
                  </span>
                </span>
              </span>

              <input
                type="checkbox"
                checked={isActive}
                onChange={() => toggleLayer(layer.id)}
                className="h-4 w-4 accent-sky-500"
                aria-label={`Включить слой «${ layer.name }»`}
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
