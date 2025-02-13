import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (
        userData: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post("http://localhost:8000/api/register", userData);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', userData);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
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
            .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload.message;
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
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

// Export the new actions
export const { loadUserFromLocalStorage, logoutUser } = authSlice.actions;

export default authSlice.reducer;