import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsArticle } from '../../types/news';
import { Movie } from '../../types/tmdb';
import { SocialPost } from '../../types/social';

export interface FavoriteItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  data: NewsArticle | Movie | SocialPost;
}

interface FavoritesState {
  items: FavoriteItem[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const exists = state.items.some(
        (item) => item.id === action.payload.id && item.type === action.payload.type
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<{ id: string; type: 'news' | 'movie' | 'social' }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.type === action.payload.type)
      );
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
