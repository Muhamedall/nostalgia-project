import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  selectedFilters: { [key: string]: string[] };
}

const initialState: FiltersState = {
  selectedFilters: {
    size: [],
    brand: [],
    genre: [],
    categorie: [],
    color: [],
  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedFilters: (
      state,
      action: PayloadAction<{ [key: string]: string[] }>
    ) => {
      state.selectedFilters = action.payload;
    },
    toggleFilter: (
      state,
      action: PayloadAction<{ filterKey: string; value: string }>
    ) => {
      const { filterKey, value } = action.payload;
      const currentFilters = state.selectedFilters[filterKey];
      if (currentFilters.includes(value)) {
        state.selectedFilters[filterKey] = currentFilters.filter(
          (item) => item !== value
        );
      } else {
        state.selectedFilters[filterKey].push(value);
      }
    },
  },
});

// Adding async action support using redux-thunk
export const toggleFilterAsync = (
  filterKey: string,
  value: string
) => async (dispatch: any) => {
  // Simulate a delay or an async request (e.g., API call)
  setTimeout(() => {
    dispatch(toggleFilter({ filterKey, value }));
  }, 1000); // Adjust the delay as needed
};

export const { setSelectedFilters, toggleFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
