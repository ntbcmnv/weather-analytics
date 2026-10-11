import { useEffect } from 'react';

import {
    useAppDispatch,
    useAppSelector,
} from '@/app/store';

import { getWeatherDataset } from '@/modules/data-access/api/weather-api';

export function WeatherDataLoader() {
    const dispatch = useAppDispatch();

    const retryCount = useAppSelector((state) => state.retryCount);

    useEffect(() => {
        const controller = new AbortController();

        dispatch({
            loadingStatus: 'loading',
            error: null,
        });

        async function loadData() {
            try {
                const dataset = await getWeatherDataset(controller.signal);

                if (controller.signal.aborted) return;

                dispatch({
                    dataset,
                    loadingStatus: 'success',
                    error: null,
                });
            } catch (error) {
                if (controller.signal.aborted) return;

                dispatch({
                    loadingStatus: 'error',
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Не удалось загрузить погодные данные',
                });
            }
        }

        void loadData();

        return () => {
            controller.abort();
        };
    }, [dispatch, retryCount]);

    return null;
}
