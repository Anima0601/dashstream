import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsApiResponse, NewsArticle } from '../../types/news';

const NEWS_API_BASE_URL = 'https://newsapi.org/v2/';
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

if (!NEWS_API_KEY) {
    console.error("NEWS_API_KEY is not defined. Please check your .env.local file.");
}

export const newsApi = createApi({
    reducerPath: 'newsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: NEWS_API_BASE_URL,
        prepareHeaders: (headers) => {
            if (NEWS_API_KEY) {
                headers.set('X-Api-Key', NEWS_API_KEY);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTopHeadlines: builder.query<NewsApiResponse, { categories?: string[]; pageSize?: number; page?: number }>({
            query: ({ categories, pageSize = 10, page = 1 }) => {
                const params = new URLSearchParams({
                    apiKey: NEWS_API_KEY || '',
                    country: 'us',
                    pageSize: pageSize.toString(),
                    page: page.toString(),
                });
                if (categories && categories.length > 0) {
                    params.append('category', categories[0]);
                }
                return `top-headlines?${params.toString()}`;
            },
            serializeQueryArgs: ({ queryArgs }) => {
                return queryArgs.categories ? queryArgs.categories.join(',') : 'general';
            },
            merge: (currentCache, newItems) => {
                currentCache.articles.push(...newItems.articles);
                if (newItems.totalResults !== undefined) {
                    currentCache.totalResults = newItems.totalResults;
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
        }),

        searchNews: builder.query<NewsApiResponse, { query: string; pageSize?: number; page?: number }>({
            query: ({ query, pageSize = 10, page = 1 }) => {
                const params = new URLSearchParams({
                    apiKey: NEWS_API_KEY || '',
                    q: query,
                    pageSize: pageSize.toString(),
                    page: page.toString(),
                });
                return `everything?${params.toString()}`;
            },

            serializeQueryArgs: ({ queryArgs }) => queryArgs.query,
            merge: (currentCache, newItems) => {
                currentCache.articles.push(...newItems.articles);
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

export const { useGetTopHeadlinesQuery, useSearchNewsQuery } = newsApi;
