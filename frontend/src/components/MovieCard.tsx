'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '../types/tmdb';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';

interface MovieCardProps {
  movie: Movie;
}

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const defaultPlaceholderImage = '/placeholder-image.jpg';

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector((state) => state.favorites.items);
  const [imageLoadError, setImageLoadError] = useState(false);

  const isFavorited = favoriteItems.some(
    (item) => item.id === String(movie.id) && item.type === 'movie'
  );

  useEffect(() => {
    setImageLoadError(false);
  }, [movie.poster_path]);

  const handleImageError = () => {
    setImageLoadError(true);
    console.error(`Image failed to load for movie: ${movie.title}. Path: ${movie.poster_path}`);
  };

  const toggleFavorite = () => {
     console.log('Favorite button clicked for:', movie.title); // Add this line
  console.log('Is currently favorited:', isFavorited);
    if (isFavorited) {
      dispatch(removeFavorite({ id: String(movie.id), type: 'movie' }));
    } else {
      dispatch(addFavorite({ id: String(movie.id), type: 'movie', data: movie }));
    }
  };

  const imageUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : defaultPlaceholderImage;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-64 sm:h-72 overflow-hidden">
        <Image
          src={imageUrl}
          alt={movie.title || 'Movie Poster'}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
          {movie.overview || 'No overview available.'}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            Details
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

export default MovieCard;
