import { createVedro } from 'vedro';

import type { WeatherDataset } from '@/entities/weather-data/model/types';
import type { WeatherLayerId } from '@/entities/weather-layer/model/types';

import { readWeatherPreferences } from '@/app/store/weather-preferences';

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AppState {
    activeLayers: WeatherLayerId[];
    selectedTimeIndex: number;
    dataset: WeatherDataset | null;
    loadingStatus: LoadingStatus;
    error: string | null;
    selectedLocationId: string | null;
    retryCount: number;
}

const savedPreferences = readWeatherPreferences();

export const initialState: AppState = {
    activeLayers: savedPreferences.activeLayers ?? ['temperature'],
    selectedTimeIndex: 0,
    dataset: null,
    loadingStatus: 'idle',
    error: null,
    selectedLocationId: null,
    retryCount: 0,
};

export const {
    Provider: AppStoreProvider,
    useSelector: useAppSelector,
    useDispatch: useAppDispatch,
    useStore: useAppStore,
} = createVedro(initialState);
