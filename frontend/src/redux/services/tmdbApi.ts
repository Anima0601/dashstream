// src/redux/services/tmdbApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {TmdbApiResponse, Movie } from '../../types/tmdb'; 

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: TMDB_BASE_URL }),
  endpoints: (builder) => ({
    getPopularMovies: builder.query< TmdbApiResponse<Movie>, { page?: number }>({
      query: ({ page = 1 }) => {
        const params = new URLSearchParams({
          api_key: TMDB_API_KEY || '',
          language: 'en-US',
          page: page.toString(),
        });
        return `movie/popular?${params.toString()}`;
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.results.push(...newItems.results);
        if (newItems.total_pages !== undefined) {
            currentCache.total_pages = newItems.total_pages;
        }
        if (newItems.total_results !== undefined) {
            currentCache.total_results = newItems.total_results;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
    searchMovies: builder.query<TmdbApiResponse<Movie>, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => {
        const params = new URLSearchParams({
          api_key: TMDB_API_KEY || '',
          language: 'en-US',
          query: query,
          page: page.toString(),
        });
        return `search/movie?${params.toString()}`;
      },
      serializeQueryArgs: ({ queryArgs }) => queryArgs.query,
      merge: (currentCache, newItems) => {
          currentCache.results.push(...newItems.results);
          if (newItems.total_pages !== undefined) {
              currentCache.total_pages = newItems.total_pages;
          }
          if (newItems.total_results !== undefined) {
              currentCache.total_results = newItems.total_results;
          }
      },
      forceRefetch({ currentArg, previousArg }) {
          return currentArg?.page !== previousArg?.page;
      },
    }),
  }),
});

export const { useGetPopularMoviesQuery, useSearchMoviesQuery } = tmdbApi;