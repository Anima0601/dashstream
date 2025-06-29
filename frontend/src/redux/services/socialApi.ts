
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SocialApiResponse, SocialPost } from '../../types/social'; 
const MOCK_SOCIAL_BASE_URL = 'http://localhost:3001/';

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: fetchBaseQuery({ baseUrl: MOCK_SOCIAL_BASE_URL }),
  endpoints: (builder) => ({
    getTrendingSocialPosts: builder.query<SocialApiResponse, { page?: number }>({
      query: ({ page = 1 }) => `trending_posts?_page=${page}&_limit=10`,
     
      transformResponse: (response: SocialPost[], meta) => {
       
        const totalCountHeader = meta?.response?.headers.get('X-Total-Count');
        return {
          posts: response,
          totalResults: totalCountHeader ? parseInt(totalCountHeader, 10) : response.length,
        };
      },
      // ===========================================
      serializeQueryArgs: ({ endpointName }) => endpointName,
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
    searchSocialPosts: builder.query<SocialApiResponse, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => `posts?q=${query}&_page=${page}&_limit=10`,
   
      transformResponse: (response: SocialPost[], meta) => {
        const totalCountHeader = meta?.response?.headers.get('X-Total-Count');
        return {
          posts: response,
          totalResults: totalCountHeader ? parseInt(totalCountHeader, 10) : response.length,
        };
      },
      // ===========================================
      serializeQueryArgs: ({ queryArgs }) => queryArgs.query,
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