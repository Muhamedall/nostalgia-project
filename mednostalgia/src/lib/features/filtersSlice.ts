// slices/filtersSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  size: string[];
  brand: string[];
  genre: string[];
  color: string[];
  priceRange: [number, number];
}

const initialState: FiltersState = {
  size: [],
  brand: [],
  genre: [],
  color: [],
  priceRange: [0, 1000],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Action to update filters like size, brand, genre, color
    setFilters: (state, action: PayloadAction<{ key: keyof FiltersState; value: string[] }>) => {
      const { key, value } = action.payload;
      if (key !== 'priceRange') {
        state[key] = value;
      }
    },
    // Action to update priceRange
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
  },
});

export const { setFilters, setPriceRange } = filtersSlice.actions;
export default filtersSlice.reducer;