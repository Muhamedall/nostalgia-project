import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios'; // Import AxiosError

interface User {
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

interface ApiError {
    message: string;
    // Add other fields if your API error response contains more information
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk<User, { name: string; email: string; password: string; password_confirmation: string }, { rejectValue: ApiError }>(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8000/api/register", userData);
            return response.data.user;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>; // Cast error to AxiosError
            return rejectWithValue(axiosError.response?.data || { message: 'An error occurred' });
        }
    }
);

export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: ApiError }>(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', userData);
            return response.data.user;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>; // Cast error to AxiosError
            return rejectWithValue(axiosError.response?.data || { message: 'An error occurred' });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Add a reducer to load user from localStorage on initial load
        loadUserFromLocalStorage: (state) => {
            const userData = localStorage.getItem('user');
            if (userData) {
                state.user = JSON.parse(userData);
            }
        },
        // Add a reducer to clear user data on logout
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
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
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<ApiError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed';
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                // Save user data to localStorage
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<ApiError | undefined>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            });
    },
});

// Export the new actions
export const { loadUserFromLocalStorage, logoutUser } = authSlice.actions;

export default authSlice.reducer;