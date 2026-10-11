import { createVedro } from 'vedro';

import type { WeatherDataset } from '@/entities/weather-data/model/types';
import type { WeatherLayerId } from '@/entities/weather-layer/model/types';

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AppState {
    activeLayers: WeatherLayerId[];
    selectedTimeIndex: number;
    dataset: WeatherDataset | null;
    loadingStatus: LoadingStatus;
    error: string | null;
}

export const initialState: AppState = {
    activeLayers: ['temperature'],
    selectedTimeIndex: 0,
    dataset: null,
    loadingStatus: 'idle',
    error: null,
};

export const {
    Provider: AppStoreProvider,
    useSelector: useAppSelector,
    useDispatch: useAppDispatch,
    useStore: useAppStore,
} = createVedro(initialState);
