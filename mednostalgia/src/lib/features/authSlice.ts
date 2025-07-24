import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import axios from 'axios';

interface User {
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

interface ApiError {
    message: string;
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    return null;
};

// Helper function to safely set localStorage
const setLocalStorageItem = (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
    }
};

// Helper function to safely remove localStorage
const removeLocalStorageItem = (key: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};

const initialState: AuthState = {
    user: typeof window !== 'undefined' ? JSON.parse(getLocalStorageItem('user') || 'null') : null,
    token: getLocalStorageItem('token'),
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk<
    User,
    { name: string; email: string; password: string; password_confirmation: string },
    { rejectValue: ApiError }
>(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/register", userData);
            return response.data.user;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            return rejectWithValue(axiosError.response?.data || { message: 'An error occurred' });
        }
    }
);

export const loginUser = createAsyncThunk<
    { user: User; token: string },
    { email: string; password: string },
    { rejectValue: ApiError }
>(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/login', userData);
            const { user, token } = response.data;
            setLocalStorageItem('token', token);
            setLocalStorageItem('user', JSON.stringify(user));
            return { user, token };
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            return rejectWithValue(axiosError.response?.data || { message: 'An error occurred' });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loadUserFromLocalStorage: (state) => {
            if (typeof window !== 'undefined') {
                const userData = getLocalStorageItem('user');
                const token = getLocalStorageItem('token');
                if (userData && token) {
                    state.user = JSON.parse(userData);
                    state.token = token;
                }
            }
        },
        logoutUser: (state) => {
            state.user = null;
            state.token = null;
            removeLocalStorageItem('user');
            removeLocalStorageItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                setLocalStorageItem('user', JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<ApiError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed';
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<ApiError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            });
    },
});

export const { loadUserFromLocalStorage, logoutUser } = authSlice.actions;
export default authSlice.reducer;