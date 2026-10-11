import { useAppDispatch, useAppSelector } from '@/app/store';

import Map, { NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LoaderCircle } from 'lucide-react';

import { WEATHER_MAP_STYLE } from '@/modules/map/lib/map-styles';
import '@/modules/map/lib/maplibre-worker';

import { WeatherMarker } from '@/modules/map/ui/WeatherMarker';
import { WeatherPopup } from '@/modules/map/ui/WeatherPopup';

export function WeatherMap() {
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

  const frame = dataset?.frames[selectedTimeIndex];

  const measurementsByLocation = new globalThis.Map(
    frame?.measurements.map((measurement) => [
      measurement.locationId,
      measurement,
    ]) ?? [],
  );

  if (!dataset || !frame) {
    return (
      <div
        className="flex min-h-[500px] items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70"
        role="status"
        aria-label="Загружаем карту погоды"
      >
        <LoaderCircle className="animate-spin text-amber-400" size={28} />
      </div>
    );
  }

  const selectedLocation = dataset.locations.find(
    (location) => location.id === selectedLocationId,
  );

  const selectedMeasurement = selectedLocation
    ? measurementsByLocation.get(selectedLocation.id)
    : undefined;

  const selectedTime = dataset.timePoints[selectedTimeIndex];
  const timeLabel = selectedTime?.label ?? 'Время не выбрано';

  const handleSelectLocation = (locationId: string) => {
    dispatch({ selectedLocationId: locationId });
  };

  const handleClosePopup = () => {
    dispatch({ selectedLocationId: null });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div>
          <h2 className="font-semibold">Карта погоды</h2>
          <p className="text-xs text-slate-400">{timeLabel}</p>
        </div>

        <span className="text-xs text-slate-400">
          Активных слоёв: {activeLayers.length}
        </span>
      </div>

      <div className="h-[500px]">
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

            if (!measurement) {
              return null;
            }

            return (
              <WeatherMarker
                key={location.id}
                location={location}
                measurement={measurement}
                activeLayers={activeLayers}
                isSelected={selectedLocationId === location.id}
                onSelect={handleSelectLocation}
              />
            );
          })}

          {selectedLocation && selectedMeasurement && (
            <WeatherPopup
              location={selectedLocation}
              measurement={selectedMeasurement}
              activeLayers={activeLayers}
              timeLabel={timeLabel}
              onClose={handleClosePopup}
            />
          )}
        </Map>
      </div>
    </div>
  );
}
