import { Popup } from 'react-map-gl/maplibre';
import { X } from 'lucide-react';

import type { WeatherLayerId } from '@/entities/weather-layer/model/types';
import type { WeatherDataset } from '@/entities/weather-data/model/types';
import { LAYER_DETAILS } from '@/modules/map/lib/weather-layer-colors';

type WeatherLocation = WeatherDataset['locations'][number];
type WeatherMeasurement = WeatherDataset['frames'][number]['measurements'][number];

interface WeatherPopupProps {
    location: WeatherLocation;
    measurement: WeatherMeasurement;
    activeLayers: WeatherLayerId[];
    timeLabel: string;
    onClose: () => void;
}

export function WeatherPopup({
    location,
    measurement,
    activeLayers,
    timeLabel,
    onClose,
}: WeatherPopupProps) {
    const columnCount = Math.max(1, activeLayers.length);

    return (
        <Popup
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            offset={18}
            closeButton={false}
            closeOnClick={false}
            maxWidth="280px"
            onClose={onClose}
        >
            <div className="w-[250px] overflow-hidden rounded-xl bg-white text-slate-900">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div>
                        <h3 className="text-base font-bold">{location.name}</h3>
                        <p className="mt-1 text-xs text-slate-500">{timeLabel}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть карточку города"
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={16} />
                    </button>
                </div>

                {activeLayers.length > 0 ? (
                    <div
                        className="grid divide-x divide-slate-100 py-4"
                        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
                    >
                        {activeLayers.map((layerId) => {
                            const detail = LAYER_DETAILS[layerId];
                            const Icon = detail.icon;
                            const value = measurement.values[layerId];

                            return (
                                <div
                                    key={layerId}
                                    className="flex min-w-0 flex-col items-center gap-1 px-2"
                                >
                                    <Icon size={18} className={detail.color} />

                                    <span className="text-base font-bold">
                                        {Number.isFinite(value) ? value : '—'}
                                        {layerId === 'temperature' ? '°' : ''}
                                    </span>

                                    <span className="text-center text-[11px] text-slate-500">
                                        {detail.label}
                                        {layerId !== 'temperature' && `, ${detail.unit}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="px-4 py-5 text-sm text-slate-500">
                        Выберите хотя бы один погодный слой.
                    </p>
                )}
            </div>
        </Popup>
    );
}
