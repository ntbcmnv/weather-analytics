import { Marker } from 'react-map-gl/maplibre';

import type { WeatherLayerId } from '@/entities/weather-layer/model/types';
import type { WeatherDataset } from '@/entities/weather-data/model/types';
import {
    getLayerColor,
    LAYER_DETAILS,
} from '@/modules/map/lib/weather-layer-colors';

type WeatherLocation = WeatherDataset['locations'][number];
type WeatherMeasurement = WeatherDataset['frames'][number]['measurements'][number];

interface WeatherMarkerProps {
    location: WeatherLocation;
    measurement: WeatherMeasurement;
    activeLayers: WeatherLayerId[];
    isSelected: boolean;
    onSelect: (locationId: string) => void;
}

export function WeatherMarker({
    location,
    measurement,
    activeLayers,
    isSelected,
    onSelect,
}: WeatherMarkerProps) {
    return (
        <Marker
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="center"
        >
            <button
                type="button"
                aria-label={`Показать погоду: ${location.name}`}
                aria-pressed={isSelected}
                onClick={() => onSelect(location.id)}
                className={`rounded-full border border-white/30 bg-slate-950/90 p-1 shadow-lg transition hover:scale-110 ${isSelected
                        ? 'scale-110 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950'
                        : ''
                    }`}
            >
                {activeLayers.length > 0 ? (
                    <span className="flex items-center px-0.5">
                        {activeLayers.map((layerId, index) => {
                            const value = measurement.values[layerId];

                            return (
                                <span
                                    key={layerId}
                                    title={`${LAYER_DETAILS[layerId].label}: ${value} ${LAYER_DETAILS[layerId].unit}`}
                                    className={`relative size-3 shrink-0 rounded-full border border-slate-950 ${index > 0 ? '-ml-1.5' : ''
                                        }`}
                                    style={{
                                        zIndex: activeLayers.length - index,
                                        backgroundColor: getLayerColor(layerId, value),
                                    }}
                                />
                            );
                        })}
                    </span>
                ) : (
                    <span className="block size-3 rounded-full bg-slate-400" />
                )}
            </button>
        </Marker>
    );
}
