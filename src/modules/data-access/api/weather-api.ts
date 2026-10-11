import type {
    TimePoint,
    WeatherDataset,
    WeatherFrame,
    WeatherLocation,
    WeatherValues,
} from '@/entities/weather-data/model/types';

const locations: WeatherLocation[] = [
    { id: 'bishkek', name: 'Бишкек', longitude: 74.5698, latitude: 42.8746 },
    { id: 'osh', name: 'Ош', longitude: 72.7985, latitude: 40.5283 },
    { id: 'jalal-abad', name: 'Джалал-Абад', longitude: 73, latitude: 40.9333 },
    { id: 'karakol', name: 'Каракол', longitude: 78.3936, latitude: 42.4907 },
    { id: 'tokmok', name: 'Токмок', longitude: 75.3015, latitude: 42.8419 },
    { id: 'kant', name: 'Кант', longitude: 74.85, latitude: 42.8911 },
    { id: 'kara-balta', name: 'Кара-Балта', longitude: 73.8481, latitude: 42.8142 },
    { id: 'naryn', name: 'Нарын', longitude: 76, latitude: 41.4287 },
    { id: 'talas', name: 'Талас', longitude: 72.2427, latitude: 42.5228 },
    { id: 'batken', name: 'Баткен', longitude: 70.8194, latitude: 40.0626 },
    { id: 'balykchy', name: 'Балыкчы', longitude: 76.186, latitude: 42.4602 },
    { id: 'cholpon-ata', name: 'Чолпон-Ата', longitude: 77.081, latitude: 42.6494 },
    { id: 'kara-suu', name: 'Кара-Суу', longitude: 72.8667, latitude: 40.7046 },
    { id: 'uzgen', name: 'Узген', longitude: 73.3, latitude: 40.7667 },
    { id: 'kyzyl-kiya', name: 'Кызыл-Кия', longitude: 72.1279, latitude: 40.2568 },
    { id: 'tash-kumyr', name: 'Таш-Кумыр', longitude: 72.2171, latitude: 41.3461 },
    { id: 'kochkor', name: 'Кочкор', longitude: 75.7566, latitude: 42.2155 },
    { id: 'at-bashy', name: 'Ат-Башы', longitude: 75.8103, latitude: 41.1702 },
];

interface OpenMeteoResponse {
    hourly: {
        time: string[];
        temperature_2m: (number | null)[];
        wind_speed_10m: (number | null)[];
        shortwave_radiation: (number | null)[];
    };
}

interface LocationForecast {
    location: WeatherLocation;
    response: OpenMeteoResponse;
}

function readNumber(
    values: (number | null)[],
    index: number,
    field: string,
    locationName: string,
): number {
    const value = values[index];

    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(
            `Нет корректного значения "${field}" для города ${locationName}`,
        );
    }

    return value;
}

async function fetchLocationForecast(
    location: WeatherLocation,
    signal?: AbortSignal,
): Promise<LocationForecast> {
    const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        hourly: 'temperature_2m,wind_speed_10m,shortwave_radiation',
        forecast_hours: '24',
        timezone: 'Asia/Bishkek',
        wind_speed_unit: 'ms',
    });

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`,
        { signal },
    );

    const data = (await response.json()) as OpenMeteoResponse;

    if (
        !data.hourly ||
        !Array.isArray(data.hourly.time) ||
        data.hourly.time.length === 0
    ) {
        throw new Error(`Не удалось получить погодные данные для города ${location.name}`);
    }

    return { location, response: data };
}

function createDataset(
    forecasts: LocationForecast[],
): WeatherDataset {
    const firstForecast = forecasts[0]?.response.hourly;

    if (!firstForecast) {
        throw new Error('Нет данных о погоде');
    }

    const timePoints: TimePoint[] = firstForecast.time.map(
        (timestamp, index) => ({
            id: `hour-${index}`,
            timestamp,
            label: timestamp.slice(11, 16),
        }),
    );

    for (const { location, response } of forecasts) {
        const times = response.hourly.time;

        if (
            times.length !== timePoints.length ||
            times.some((time, index) => time !== timePoints[index]?.timestamp)
        ) {
            throw new Error(
                `Временные отметки прогноза для ${location.name} не совпадают`,
            );
        }
    }

    const frames: WeatherFrame[] = timePoints.map((timePoint, timeIndex) => ({
        timeId: timePoint.id,
        measurements: forecasts.map(({ location, response }) => {
            const hourly = response.hourly;

            const values: WeatherValues = {
                temperature: readNumber(
                    hourly.temperature_2m,
                    timeIndex,
                    'temperature_2m',
                    location.name,
                ),
                wind: readNumber(
                    hourly.wind_speed_10m,
                    timeIndex,
                    'wind_speed_10m',
                    location.name,
                ),
                insolation: readNumber(
                    hourly.shortwave_radiation,
                    timeIndex,
                    'shortwave_radiation',
                    location.name,
                ),
            };

            return {
                locationId: location.id,
                values,
            };
        }),
    }));

    return {
        locations,
        timePoints,
        frames,
    };
}

export async function getWeatherDataset(
    signal?: AbortSignal,
): Promise<WeatherDataset> {
    const forecasts = await Promise.all(
        locations.map((location) =>
            fetchLocationForecast(location, signal),
        ),
    );

    if (signal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError');
    }

    return createDataset(forecasts);
}
