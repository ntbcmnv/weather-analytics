
import { useEffect } from 'react';
import { toast } from 'sonner';

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
        const toastId = `weather-data-${retryCount}`;

        dispatch({
            loadingStatus: 'loading',
            error: null,
        });

        toast.loading('Загружаем данные о погоде...', {
            id: toastId,
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

                toast.success('Данные о погоде загружены', {
                    id: toastId,
                    duration: 2000,
                });
            } catch (error) {
                if (controller.signal.aborted) return;

                const message =
                    error instanceof Error
                        ? error.message
                        : 'Не удалось загрузить погодные данные';

                dispatch({
                    loadingStatus: 'error',
                    error: message,
                });

                toast.error('Не удалось загрузить данные о погоде', {
                    id: toastId,
                    description: message,
                    duration: 5000,
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
