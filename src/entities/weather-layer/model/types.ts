export type WeatherLayerId = 'temperature' | 'wind' | 'insolation';

export type WeatherLayerType = 'heatmap' | 'points';

export interface WeatherLayerConfig {
    id: WeatherLayerId;
    name: string;
    unit: string;
    type: WeatherLayerType;
    color: string;
    min: number;
    max: number;
}

export const WEATHER_LAYERS: WeatherLayerConfig[] = [
    {
        id: 'temperature',
        name: 'Температура',
        unit: '°C',
        type: 'heatmap',
        color: '#f97316',
        min: -10,
        max: 40,
    },
    {
        id: 'wind',
        name: 'Ветер',
        unit: 'м/с',
        type: 'points',
        color: '#38bdf8',
        min: 0,
        max: 30,
    },
    {
        id: 'insolation',
        name: 'Инсоляция',
        unit: 'Вт/м²',
        type: 'heatmap',
        color: '#facc15',
        min: 0,
        max: 1200,
    },
];
