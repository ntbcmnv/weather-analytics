import type { PropsWithChildren } from 'react';

import { WeatherDataLoader } from '@/modules/data-access/model/WeatherDataLoader';
import { useEffect } from 'react';

import {
    AppStoreProvider,
    initialState,
    useAppSelector,
} from '@/app/store';

import { saveWeatherPreferences } from '@/app/store/weather-preferences';

function WeatherPreferencesPersistence() {
    const { dataset, selectedTimeIndex, activeLayers } = useAppSelector(
        (state) => ({
            dataset: state.dataset,
            selectedTimeIndex: state.selectedTimeIndex,
            activeLayers: state.activeLayers,
        }),
    );

    useEffect(() => {
        if (!dataset) {
            return;
        }

        const selectedTime = dataset.timePoints[selectedTimeIndex];

        if (!selectedTime) {
            return;
        }

        saveWeatherPreferences({
            activeLayers,
            selectedTimestamp: selectedTime.timestamp,
        });
    }, [dataset, selectedTimeIndex, activeLayers]);

    return null;
}

export function AppProvider({ children }: PropsWithChildren) {
    return (
        <AppStoreProvider state={initialState}>
            <WeatherDataLoader />
            <WeatherPreferencesPersistence />
            {children}
        </AppStoreProvider>
    );
}
