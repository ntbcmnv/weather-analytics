import type { PropsWithChildren } from 'react';

import { AppStoreProvider, initialState } from '@/app/store';

export function AppProvider({ children }: PropsWithChildren) {
    return (
        <AppStoreProvider state={initialState}>
            {children}
        </AppStoreProvider>
    );
}
