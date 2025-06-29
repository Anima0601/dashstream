// src/redux/services/socialApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SocialApiResponse, SocialPost } from '../../types/social'; // Adjust imports if types are different or missing

// Mock data (replace with actual API base URL if available)
// Assuming a simple JSON server or similar for mock API that uses _page, _limit for pagination
const MOCK_SOCIAL_BASE_URL = 'http://localhost:3001/';

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: fetchBaseQuery({ baseUrl: MOCK_SOCIAL_BASE_URL }),
  endpoints: (builder) => ({
    getTrendingSocialPosts: builder.query<SocialApiResponse, { page?: number }>({ // ADDED `{ page?: number }` argument
      query: ({ page = 1 }) => `trending_posts?_page=${page}&_limit=10`, // Example with json-server pagination
      serializeQueryArgs: ({ endpointName }) => endpointName, // Cache key for trending posts
      merge: (currentCache, newItems) => {
        currentCache.posts.push(...newItems.posts);
        // Ensure totalResults is updated (assuming your mock API returns it in the body)
        if (newItems.totalResults !== undefined) {
            currentCache.totalResults = newItems.totalResults;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page; // Refetch only when page changes
      },
    }),
    searchSocialPosts: builder.query<SocialApiResponse, { query: string; page?: number }>({ // ADDED `{ query: string; page?: number }` argument
      query: ({ query, page = 1 }) => `posts?q=${query}&_page=${page}&_limit=10`, // Example with json-server search and pagination
      serializeQueryArgs: ({ queryArgs }) => queryArgs.query, // Cache key for search results
      merge: (currentCache, newItems) => {
          currentCache.posts.push(...newItems.posts);
          if (newItems.totalResults !== undefined) {
              currentCache.totalResults = newItems.totalResults;
          }
      },
      forceRefetch({ currentArg, previousArg }) {
          return currentArg?.page !== previousArg?.page;
      },
    }),
  }),
});

export const { useGetTrendingSocialPostsQuery, useSearchSocialPostsQuery } = socialApi;