
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferencesState { 
  favoriteCategories: string[];
  darkMode: boolean;
}

const initialState: UserPreferencesState = {
  favoriteCategories: ['technology', 'sports', 'business'],
  darkMode: false,
};

export const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setFavoriteCategories: (state, action: PayloadAction<string[]>) => {
      state.favoriteCategories = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { setFavoriteCategories, toggleDarkMode } = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;