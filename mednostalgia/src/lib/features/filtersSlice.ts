// redux/filterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  size: string[];
  brand: string[];
  genre: string[];
  color: string[];
  priceRange: [number, number];
}

const initialState: FilterState = {
  size: [],
  brand: [],
  genre: [],
  color: [],
  priceRange: [0, 1000],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ key: string; value: string[] }>) => {
      const { key, value } = action.payload;
      state[key as keyof FilterState] = value;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
  },
});

export const { setFilters, setPriceRange } = filterSlice.actions;
export default filterSlice.reducer;