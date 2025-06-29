'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsArticle } from '../types/news';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';

interface NewsCardProps {
  article: NewsArticle;
}

const defaultPlaceholderImage = '/placeholder-image.jpg';

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector((state) => state.favorites.items);

  const [imageLoadError, setImageLoadError] = useState(false);

  const isFavorited = favoriteItems.some(
    (item) => item.id === article.url && item.type === 'news'
  );

  useEffect(() => {
    setImageLoadError(false);
  }, [article.urlToImage]);

  const handleImageError = () => {
    setImageLoadError(true);
    console.error(`Image failed to load for: ${article.title}. URL: ${article.urlToImage}`);
  };

  const toggleFavorite = () => {
    if (isFavorited) {
      dispatch(removeFavorite({ id: article.url, type: 'news' }));
    } else {
      dispatch(addFavorite({ id: article.url, type: 'news', data: article }));
    }
  };

  const finalImageUrl = imageLoadError ? defaultPlaceholderImage : (article.urlToImage || defaultPlaceholderImage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
        <img
          src={finalImageUrl}
          alt={article.title || 'News Image'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
          {article.description || 'No description available.'}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <span>{article.source.name}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            Read More
            <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          </Link>
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label="Favorite"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
