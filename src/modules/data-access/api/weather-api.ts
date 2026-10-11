import type {
    TimePoint,
    WeatherDataset,
    WeatherFrame,
    WeatherLocation,
    WeatherValues,
} from '@/entities/weather-data/model/types';

const locations: WeatherLocation[] = [
    {
        id: 'bishkek',
        name: 'Бишкек',
        longitude: 74.5698,
        latitude: 42.8746,
    },
    {
        id: 'tokmok',
        name: 'Токмок',
        longitude: 75.3015,
        latitude: 42.8419,
    },
    {
        id: 'kant',
        name: 'Кант',
        longitude: 74.8500,
        latitude: 42.8911,
    },
    {
        id: 'kara-balta',
        name: 'Кара-Балта',
        longitude: 73.8481,
        latitude: 42.8142,
    },
    {
        id: 'osh',
        name: 'Ош',
        longitude: 72.7985,
        latitude: 40.5283,
    },
];

const timePoints: TimePoint[] = Array.from({ length: 5 }, (_, index) => {
    const hour = 10 + index;

    return {
        id: `hour-${hour}`,
        timestamp: `2026-10-11T${String(hour).padStart(2, '0')}:00:00`,
        label: `${hour}:00`,
    };
});

function generateValues(
    locationIndex: number,
    timeIndex: number,
): WeatherValues {
    const temperature =
        14 + locationIndex * 1.8 + timeIndex * 2.2;

    const wind =
        2 + ((locationIndex * 3 + timeIndex * 2) % 9);

    const insolation =
        Math.max(
            0,
            250 + timeIndex * 150 - locationIndex * 45,
        );

    return {
        temperature: Number(temperature.toFixed(1)),
        wind: Number(wind.toFixed(1)),
        insolation,
    };
}

function generateFrame(
    timePoint: TimePoint,
    timeIndex: number,
): WeatherFrame {
    return {
        timeId: timePoint.id,
        measurements: locations.map((location, locationIndex) => ({
            locationId: location.id,
            values: generateValues(locationIndex, timeIndex),
        })),
    };
}

function createDataset(): WeatherDataset {
    return {
        locations,
        timePoints,
        frames: timePoints.map(generateFrame),
    };
}

export async function getWeatherDataset(
    signal?: AbortSignal,
): Promise<WeatherDataset> {
    await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(resolve, 500);

        signal?.addEventListener(
            'abort',
            () => {
                clearTimeout(timeoutId);
                reject(new DOMException('Request aborted', 'AbortError'));
            },
            { once: true },
        );
    });

    if (signal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError');
    }

    return createDataset();
}
