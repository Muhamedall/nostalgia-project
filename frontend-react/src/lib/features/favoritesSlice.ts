import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// Set axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;

interface FavoriteState {
  favoriteProducts: number[];
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: FavoriteState = {
  favoriteProducts: [],
  loading: false,
  error: null,
  status: 'idle',
};

const getAuthToken = () => {
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};

// Async Thunks
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("No authentication token found");
      
      const response = await axios.get("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.map((product: any) => product.id);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to view your favorites");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch favorites");
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (productId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("No authentication token found");
      
      const response = await axios.post(
        "/api/favorites",
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return productId;
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to add favorites");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to add favorite");
    }
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (productId: number, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("No authentication token found");
      
      await axios.delete(`/api/favorites/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return productId;
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to modify favorites");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to remove favorite");
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favoriteProducts = [];
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.loading = false;
        state.favoriteProducts = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = 'failed';
      })
      
      // Add Favorite
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        if (!state.favoriteProducts.includes(action.payload)) {
          state.favoriteProducts.push(action.payload);
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove Favorite
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.favoriteProducts = state.favoriteProducts.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;