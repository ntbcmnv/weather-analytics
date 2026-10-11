import type { PropsWithChildren } from 'react';

import { AppStoreProvider, initialState } from '@/app/store';
import { WeatherDataLoader } from '@/modules/data-access/model/WeatherDataLoader';

export function AppProvider({ children }: PropsWithChildren) {
    return (
        <AppStoreProvider state={initialState}>
            <WeatherDataLoader />
            {children}
        </AppStoreProvider>
    );
}
