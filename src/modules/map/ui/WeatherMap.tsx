import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useAppSelector } from '@/app/store';
import { WEATHER_LAYERS } from '@/entities/weather-layer/model/types';
import { WEATHER_MAP_STYLE } from '@/modules/map/lib/map-styles';

export function WeatherMap() {
  const {
    dataset,
    activeLayers,
    selectedTimeIndex,
  } = useAppSelector((state) => ({
    dataset: state.dataset,
    activeLayers: state.activeLayers,
    selectedTimeIndex: state.selectedTimeIndex,
  }));

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  const frame = dataset?.frames[selectedTimeIndex];

  const measurementsByLocation = new globalThis.Map(
    frame?.measurements.map((measurement) => [
      measurement.locationId,
      measurement,
    ]) ?? [],
  );

  if (!dataset) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-xl bg-slate-900 text-slate-400">
        Загружаем карту и погодные данные...
      </div>
    );
  }

  return (
    <div className="h-[500px] overflow-hidden rounded-xl border border-slate-800">
      <Map
        initialViewState={{
          longitude: 74.5,
          latitude: 41.5,
          zoom: 6,
        }}
        mapStyle={WEATHER_MAP_STYLE}
        attributionControl={{ compact: true }}
      >
        <NavigationControl position="top-right" />

        {dataset.locations.map((location) => {
          const measurement = measurementsByLocation.get(location.id);

          if (!measurement) return null;

          const primaryLayer = WEATHER_LAYERS.find((layer) =>
            activeLayers.includes(layer.id),
          );

          if (!primaryLayer) return null;

          const value = measurement.values[primaryLayer.id];

          const normalizedValue = Math.max(
            0,
            Math.min(
              1,
              (value - primaryLayer.min) /
                (primaryLayer.max - primaryLayer.min),
            ),
          );

          const markerSize = 12 + normalizedValue * 20;
          const isSelected = selectedLocationId === location.id;

          return (
            <Marker
              key={location.id}
              longitude={location.longitude}
              latitude={location.latitude}
              anchor="center"
            >
              <button
                type="button"
                title={`${ location.name }: ${ value } ${ primaryLayer.unit } `}
                aria-label={`Погода в локации ${ location.name } `}
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedLocationId(isSelected ? null : location.id)
                }
                className={`rounded - full border - 2 border - white / 80 shadow - lg transition - transform hover: scale - 125 ${
    isSelected ? 'ring-4 ring-sky-400/60' : ''
} `}
                style={{
                  width: markerSize,
                  height: markerSize,
                  backgroundColor: primaryLayer.color,
                }}
              >
                <span className="sr-only">{location.name}</span>
              </button>
            </Marker>
          );
        })}
      </Map>

      {selectedLocationId && (() => {
        const location = dataset.locations.find(
          (item) => item.id === selectedLocationId,
        );
        const measurement = measurementsByLocation.get(selectedLocationId);

        if (!location || !measurement) return null;

        return (
          <div className="border-t border-slate-800 bg-slate-900 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{location.name}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Показатели на {frame?.timeId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLocationId(null)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Закрыть
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              {WEATHER_LAYERS.map((layer) => (
                <div
                  key={layer.id}
                  className="rounded-lg bg-slate-800 px-3 py-2"
                >
                  <p className="text-xs text-slate-400">{layer.name}</p>
                  <p className="mt-1 font-medium">
                    {measurement.values[layer.id]} {layer.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}