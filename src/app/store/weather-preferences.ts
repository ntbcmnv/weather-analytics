import type { WeatherLayerId } from '@/entities/weather-layer/model/types';
import { WEATHER_LAYERS } from '@/entities/weather-layer/model/types';

const STORAGE_KEY = 'weather-analytics-preferences';

export interface WeatherPreferences {
    activeLayers?: WeatherLayerId[];
    selectedTimestamp?: string;
}

export function readWeatherPreferences(): WeatherPreferences {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return {};
        }

        const parsed: unknown = JSON.parse(saved);

        if (!parsed || typeof parsed !== 'object') {
            return {};
        }

        const data = parsed as Record<string, unknown>;

        const activeLayers = Array.isArray(data.activeLayers)
            ? data.activeLayers.filter(
                (id): id is WeatherLayerId =>
                    typeof id === 'string' &&
                    WEATHER_LAYERS.some((layer) => layer.id === id),
            )
            : undefined;

        return {
            activeLayers,
            selectedTimestamp:
                typeof data.selectedTimestamp === 'string'
                    ? data.selectedTimestamp
                    : undefined,
        };
    } catch {
        return {};
    }
}

export function saveWeatherPreferences(
    preferences: WeatherPreferences,
): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
        // Сохранение настроек недоступно, например, в приватном режиме браузера.
    }
}
