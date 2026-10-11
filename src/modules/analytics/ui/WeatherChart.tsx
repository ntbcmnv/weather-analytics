import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAppSelector } from '@/app/store';
import {
  WEATHER_LAYERS,
  type WeatherLayerId,
} from '@/entities/weather-layer/model/types';

export function WeatherChart() {
  const { dataset, activeLayers } = useAppSelector((state) => ({
    dataset: state.dataset,
    activeLayers: state.activeLayers,
  }));

  const [selectedLocationId, setSelectedLocationId] = useState('');

  const [selectedLayerId, setSelectedLayerId] =
    useState<WeatherLayerId>('temperature');

  const locations = dataset?.locations ?? [];

  const locationId =
    locations.find((location) => location.id === selectedLocationId)?.id ??
    locations[0]?.id;

  const availableLayers = WEATHER_LAYERS.filter((layer) =>
    activeLayers.includes(layer.id),
  );

  const selectedLayer =
    availableLayers.find((layer) => layer.id === selectedLayerId) ??
    availableLayers[0];

  const chartData = useMemo(() => {
    if (!dataset || !locationId || !selectedLayer) {
      return [];
    }

    return dataset.frames.map((frame) => {
      const measurement = frame.measurements.find(
        (item) => item.locationId === locationId,
      );

      const timePoint = dataset.timePoints.find(
        (point) => point.id === frame.timeId,
      );

      return {
        time: timePoint?.label ?? frame.timeId,
        value: measurement?.values[selectedLayer.id] ?? null,
      };
    });
  }, [dataset, locationId, selectedLayer]);

  if (!dataset || locations.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold">Аналитика погоды</h2>
          <p className="mt-1 text-sm text-slate-400">
            Изменение погодных показателей во времени
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Локация
            <select
              value={locationId ?? ''}
              onChange={(event) => setSelectedLocationId(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Показатель
            <select
              value={selectedLayer?.id ?? ''}
              disabled={availableLayers.length === 0}
              onChange={(event) =>
                setSelectedLayerId(event.target.value as WeatherLayerId)
              }
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 disabled:opacity-50"
            >
              {availableLayers.map((layer) => (
                <option key={layer.id} value={layer.id}>
                  {layer.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {selectedLayer ? (
        <>
          <div className="mt-5">
            <p className="text-sm text-slate-400">{selectedLayer.name}</p>
            <p className="mt-1 text-2xl font-semibold">
              {chartData.at(-1)?.value ?? '—'}{' '}
              <span className="text-base font-normal text-slate-400">
                {selectedLayer.unit}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Значение за последний доступный временной интервал
            </p>
          </div>

          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#334155"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#475569' }}
                  tickLine={false}
                />

                <YAxis
                  width={48}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value) => [
                    `${ value ?? '—' } ${ selectedLayer.unit } `,
                    selectedLayer.name,
                  ]}
                  labelStyle={{ color: '#94a3b8' }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  name={selectedLayer.name}
                  stroke={selectedLayer.color}
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: selectedLayer.color,
                    strokeWidth: 0,
                  }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
          Включи хотя бы один погодный слой, чтобы увидеть график.
        </div>
      )}
    </section>
  );
}