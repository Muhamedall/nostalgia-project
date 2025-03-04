
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import filtersReducer from './features/filtersSlice';
import productsReducer from './features/productsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        filters: filtersReducer,
        products: productsReducer,
    
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;