'use client';

import React from 'react';
import MainLayout from '../../components/MainLayout';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { removeFavorite, FavoriteItem } from '../../redux/slices/favoritesSlice';
import NewsCard from '../../components/NewsCard';
import MovieCard from '../../components/MovieCard';
import SocialPostCard from '../../components/SocialPostCard';
import { NewsArticle } from '../../types/news';
import { Movie } from '../../types/tmdb';
import { SocialPost } from '../../types/social';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector((state) => state.favorites.items);

  const handleRemoveFavorite = (id: string, type: 'news' | 'movie' | 'social') => {
    dispatch(removeFavorite({ id, type }));
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Favorites
      </h1>

      {favoriteItems.length === 0 ? (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-400">
          <p className="text-xl mb-4">No favorite items yet!</p>
          <p>Click the heart icon on news articles, movies, or social posts to add them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item: FavoriteItem) => (
            <div key={item.id} className="relative">
              {item.type === 'news' ? (
                <NewsCard article={item.data as NewsArticle} />
              ) : item.type === 'movie' ? (
                <MovieCard movie={item.data as Movie} />
              ) : (
                <SocialPostCard post={item.data as SocialPost} />
              )}
              <button
                onClick={() => handleRemoveFavorite(item.id, item.type)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 z-10"
                aria-label="Remove from favorites"
                title="Remove from favorites"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
