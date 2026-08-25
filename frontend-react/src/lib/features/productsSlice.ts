import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: number;

  external_id?: string | null;

  title: string;

  price: string;

  old_price?: string | null;

  description?: string | null;

  sku?: string | null;

  url?: string | null;

  images?: string[];

  source?: string | null;

  handle?: string | null;

  available?: boolean;

  // Old fields - kept for your existing frontend
  background_image: string;

  main_image: string;
}

interface ProductsState {
  items: Product[];

  status:
    | 'idle'
    | 'loading'
    | 'succeeded'
    | 'failed';

  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  'products/fetchProducts',

  async (_, { rejectWithValue }) => {
    try {

      const response = await axios.get<Product[]>(
        'http://127.0.0.1:8000/api/products',
        {
          withCredentials: true,
        }
      );

      /*
       * Make sure Laravel really returned an array.
       */

      if (!Array.isArray(response.data)) {

        return rejectWithValue(
          'Invalid API response: products is not an array.'
        );
      }

      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {

        return rejectWithValue(
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch products'
        );
      }

      return rejectWithValue(
        'Failed to fetch products'
      );
    }
  }
);

const productsSlice = createSlice({

  name: 'products',

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(
        fetchProducts.pending,
        (state) => {

          state.status = 'loading';

          state.error = null;
        }
      )

      .addCase(
        fetchProducts.fulfilled,
        (state, action) => {

          state.status = 'succeeded';

          state.items = action.payload;
        }
      )

      .addCase(
        fetchProducts.rejected,
        (state, action) => {

          state.status = 'failed';

          state.error =
            action.payload ||
            'Failed to fetch products';
        }
      );
  },
});

export default productsSlice.reducer;