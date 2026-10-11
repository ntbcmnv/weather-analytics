import type { WeatherLayerId } from '@/entities/weather-layer/model/types';

export interface TimePoint {
    id: string;
    timestamp: string;
    label: string;
}

export interface WeatherLocation {
    id: string;
    name: string;
    longitude: number;
    latitude: number;
}

export type WeatherValues = Record<WeatherLayerId, number>;

export interface WeatherMeasurement {
    locationId: string;
    values: WeatherValues;
}

export interface WeatherFrame {
    timeId: string;
    measurements: WeatherMeasurement[];
}

export interface WeatherDataset {
    locations: WeatherLocation[];
    timePoints: TimePoint[];
    frames: WeatherFrame[];
}
