
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import filtersReducer from './features/filtersSlice';
import productsReducer from './features/productsSlice';
import searchReducer from './features/searchSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        filters: filtersReducer,
        products: productsReducer,
        search: searchReducer,
    
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;