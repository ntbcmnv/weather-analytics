import { Sun, Thermometer, Wind } from 'lucide-react';
import type { WeatherLayerId } from '@/entities/weather-layer/model/types';

export const LAYER_DETAILS = {
    temperature: {
        label: 'Температура',
        unit: '°C',
        icon: Thermometer,
        color: 'text-orange-500',
    },
    wind: {
        label: 'Ветер',
        unit: 'м/с',
        icon: Wind,
        color: 'text-sky-400',
    },
    insolation: {
        label: 'Инсоляция',
        unit: 'Вт/м²',
        icon: Sun,
        color: 'text-violet-400',
    },
} satisfies Record<
    WeatherLayerId,
    {
        label: string;
        unit: string;
        icon: typeof Thermometer;
        color: string;
    }
>;

function getTemperatureColor(value: number): string {
    if (value < 0) return '#c2410c';
    if (value < 10) return '#ea580c';
    if (value < 20) return '#f97316';
    if (value < 30) return '#fb923c';
    return '#fdba74';
}

function getWindColor(value: number): string {
    if (value < 2) return '#bae6fd';
    if (value < 5) return '#7dd3fc';
    if (value < 8) return '#38bdf8';
    return '#0284c7';
}

function getInsolationColor(value: number): string {
    if (value < 100) return '#ddd6fe';
    if (value < 300) return '#c4b5fd';
    if (value < 600) return '#a78bfa';
    return '#7c3aed';
}

export function getLayerColor(
    layerId: WeatherLayerId,
    value: number,
): string {
    if (!Number.isFinite(value)) return '#94a3b8';

    switch (layerId) {
        case 'temperature':
            return getTemperatureColor(value);
        case 'wind':
            return getWindColor(value);
        case 'insolation':
            return getInsolationColor(value);
        default:
            return '#94a3b8';
    }
}
