// src/app/page.tsx
'use client';

import MainLayout from '../components/MainLayout';
import NewsCard from '../components/NewsCard';
import MovieCard from '../components/MovieCard';
import SocialPostCard from '../components/SocialPostCard';
import Header from '../components/Header';
import { useAppSelector } from '../redux/hooks';
import { useGetTopHeadlinesQuery, useSearchNewsQuery } from '../redux/services/newsApi';
import { useGetPopularMoviesQuery, useSearchMoviesQuery } from '../redux/services/tmdbApi';
import { useGetTrendingSocialPostsQuery, useSearchSocialPostsQuery } from '../redux/services/socialApi'; // UPDATED IMPORTS
import { NewsArticle } from '../types/news';
import { Movie } from '../types/tmdb';
import { SocialPost } from '../types/social';
import React, { useState, useCallback, useEffect } from 'react';

// --- Helper Components ---
const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-center items-center h-24">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-700 dark:text-gray-300">{message}</p>
  </div>
);

const ErrorMessage: React.FC<{ error: any; type: string }> = ({ error, type }) => {
  const msg = 'message' in error ? error.message : 'An unknown error occurred';
  return (
    <div className="text-center p-4 text-red-500 dark:text-red-400">
      <p>Failed to load {type}:</p>
      <p>{msg}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Please check your API key/network or try a different search.</p>
    </div>
  );
};

const NoResultsMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center p-4 text-gray-600 dark:text-gray-400">
    {message}
  </div>
);
// --- End Helper Components ---


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newsPage, setNewsPage] = useState(1);
  const [moviePage, setMoviePage] = useState(1);
  const [socialPage, setSocialPage] = useState(1); // State for Social Post pagination

  const favoriteCategories = useAppSelector(
    (state) => state.userPreferences.favoriteCategories
  );

  const categoryToFetch = favoriteCategories.length > 0 ? favoriteCategories[0] : 'general';
  const NEWS_PAGE_SIZE = 9;
  const MOVIE_PAGE_SIZE = 20; // TMDB default is 20 per page
  const SOCIAL_PAGE_SIZE = 10; // Assuming a page size for mock API


  // --- News API Queries ---
  const {
    data: newsCategoryData,
    error: newsCategoryError,
    isLoading: newsCategoryIsLoading,
    isFetching: newsCategoryIsFetching
  } = useGetTopHeadlinesQuery({
    categories: [categoryToFetch],
    pageSize: NEWS_PAGE_SIZE,
    page: newsPage,
  }, {
    skip: searchQuery !== '',
  });

  const {
    data: newsSearchData,
    error: newsSearchError,
    isLoading: newsSearchIsLoading,
    isFetching: newsSearchIsFetching
  } = useSearchNewsQuery({
    query: searchQuery,
    pageSize: NEWS_PAGE_SIZE,
    page: newsPage,
  }, {
    skip: searchQuery === '',
  });

  // --- TMDB API Queries ---
  const {
    data: moviesData,
    error: moviesError,
    isLoading: moviesIsLoading,
    isFetching: moviesIsFetching
  } = useGetPopularMoviesQuery({ page: moviePage }, {
    skip: searchQuery !== '',
  });

  const {
    data: moviesSearchData,
    error: moviesSearchError,
    isLoading: moviesSearchIsLoading,
    isFetching: moviesSearchIsFetching
  } = useSearchMoviesQuery({ query: searchQuery, page: moviePage }, {
    skip: searchQuery === '',
  });

  // --- Social API Queries ---
  const {
    data: socialData,
    error: socialError,
    isLoading: socialIsLoading,
    isFetching: socialIsFetching
  } = useGetTrendingSocialPostsQuery({ page: socialPage }, { // Corrected parameter usage
    skip: searchQuery !== '',
  });

  const {
    data: socialSearchData,
    error: socialSearchError,
    isLoading: socialSearchIsLoading,
    isFetching: socialSearchIsFetching
  } = useSearchSocialPostsQuery({ query: searchQuery, page: socialPage }, { // Corrected parameter usage
    skip: searchQuery === '',
  });


  // Reset pagination pages when search query or category changes
  useEffect(() => {
    setNewsPage(1);
    setMoviePage(1);
    setSocialPage(1); // Reset social page
  }, [searchQuery, categoryToFetch]);


  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);


  const handleLoadMoreNews = () => {
    setNewsPage((prevPage) => prevPage + 1);
  };

  const handleLoadMoreMovies = () => {
    setMoviePage((prevPage) => prevPage + 1);
  };

  const handleLoadMoreSocialPosts = () => { // Handler for social posts
    setSocialPage((prevPage) => prevPage + 1);
  };


  // --- Conditional Content Rendering variables ---
  let newsContent;
  let moviesContent;
  let socialContent;
  let pageTitle;
  let subTitle = '';

  let showLoadMoreNewsButton = false;
  let currentNewsTotalResults = 0;
  let currentNewsArticleCount = 0;

  let showLoadMoreMoviesButton = false;
  let currentMoviesTotalResults = 0;
  let currentMoviesArticleCount = 0;

  let showLoadMoreSocialPostsButton = false;
  let currentSocialPostsTotalResults = 0;
  let currentSocialPostsArticleCount = 0;


  if (searchQuery) {
    pageTitle = `Search Results for "${searchQuery}"`;

    // News Search Content
    if (newsSearchIsLoading && !newsSearchIsFetching) {
      newsContent = <LoadingSpinner message="Searching news..." />;
    } else if (newsSearchError) {
      newsContent = <ErrorMessage error={newsSearchError} type="News" />;
    } else if (newsSearchData?.articles) {
      newsContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsSearchData.articles.map((article: NewsArticle) => (
            <NewsCard key={article.url + article.publishedAt} article={article} />
          ))}
        </div>
      );
      currentNewsTotalResults = newsSearchData.totalResults || 0;
      currentNewsArticleCount = newsSearchData.articles.length;
      showLoadMoreNewsButton = currentNewsArticleCount < currentNewsTotalResults && currentNewsArticleCount > 0;
    } else {
      newsContent = <NoResultsMessage message={`No news results for "${searchQuery}".`} />;
    }

    // Movies Search Content
    if (moviesSearchIsLoading && !moviesSearchIsFetching) {
      moviesContent = <LoadingSpinner message="Searching movies..." />;
    } else if (moviesSearchError) {
      moviesContent = <ErrorMessage error={moviesSearchError} type="Movies" />;
    } else if (moviesSearchData?.results) {
      moviesContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moviesSearchData.results.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      );
      currentMoviesTotalResults = moviesSearchData.total_results || 0;
      currentMoviesArticleCount = moviesSearchData.results.length;
      showLoadMoreMoviesButton = currentMoviesArticleCount < currentMoviesTotalResults && currentMoviesArticleCount > 0;
    } else {
      moviesContent = <NoResultsMessage message={`No movie results for "${searchQuery}".`} />;
    }

    // Social Search Content
    if (socialSearchIsLoading && !socialSearchIsFetching) {
      socialContent = <LoadingSpinner message="Searching social posts..." />;
    } else if (socialSearchError) {
      socialContent = <ErrorMessage error={socialSearchError} type="Social Posts" />;
    } else if (socialSearchData?.posts) {
      socialContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialSearchData.posts.map((post: SocialPost) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>
      );
      currentSocialPostsTotalResults = socialSearchData.totalResults || 0;
      currentSocialPostsArticleCount = socialSearchData.posts.length;
      showLoadMoreSocialPostsButton = currentSocialPostsArticleCount < currentSocialPostsTotalResults && currentSocialPostsArticleCount > 0;
    } else {
      socialContent = <NoResultsMessage message={`No social posts for "${searchQuery}".`} />;
    }

  } else { // Not searching, show personalized feed
    pageTitle = 'Your Personalized Feed';
    subTitle = `Showing news for: ${categoryToFetch}`;

    // News Category Content
    if (newsCategoryIsLoading && !newsCategoryIsFetching) {
      newsContent = <LoadingSpinner message="Loading news..." />;
    } else if (newsCategoryError) {
      newsContent = <ErrorMessage error={newsCategoryError} type="News" />;
    } else if (newsCategoryData?.articles) {
      newsContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsCategoryData.articles.map((article: NewsArticle) => (
            <NewsCard key={article.url + article.publishedAt} article={article} />
          ))}
        </div>
      );
      currentNewsTotalResults = newsCategoryData.totalResults || 0;
      currentNewsArticleCount = newsCategoryData.articles.length;
      showLoadMoreNewsButton = currentNewsArticleCount < currentNewsTotalResults && currentNewsArticleCount > 0;
    } else {
      newsContent = <NoResultsMessage message={`No news articles for "${categoryToFetch}".`} />;
    }

    // Movies Content
    if (moviesIsLoading && !moviesIsFetching) {
      moviesContent = <LoadingSpinner message="Loading movies..." />;
    } else if (moviesError) {
      moviesContent = <ErrorMessage error={moviesError} type="Movies" />;
    } else if (moviesData?.results) {
      moviesContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moviesData.results.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      );
      currentMoviesTotalResults = moviesData.total_results || 0;
      currentMoviesArticleCount = moviesData.results.length;
      showLoadMoreMoviesButton = currentMoviesArticleCount < currentMoviesTotalResults && currentMoviesArticleCount > 0;
    } else {
      moviesContent = <NoResultsMessage message="No popular movies found." />;
    }

    // Social Posts Content
    if (socialIsLoading && !socialIsFetching) {
      socialContent = <LoadingSpinner message="Loading social posts..." />;
    } else if (socialError) {
      socialContent = <ErrorMessage error={socialError} type="Social Posts" />;
    } else if (socialData?.posts) {
      socialContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialData.posts.map((post: SocialPost) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>
      );
      currentSocialPostsTotalResults = socialData.totalResults || 0;
      currentSocialPostsArticleCount = socialData.posts.length;
      showLoadMoreSocialPostsButton = currentSocialPostsArticleCount < currentSocialPostsTotalResults && currentSocialPostsArticleCount > 0;
    } else {
      socialContent = <NoResultsMessage message="No trending social posts found." />;
    }
  }

  return (
    <MainLayout header={<Header onSearch={handleSearch} searchQuery={searchQuery} />}>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {pageTitle}
      </h1>
      {subTitle && (
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 capitalize">
          {subTitle}
        </p>
      )}

      {/* Unified Feed/Search Results */}
      {searchQuery ? (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              News Results
            </h2>
            {newsContent}
            {newsSearchIsFetching && <LoadingSpinner message="Loading more news..." />}
            {showLoadMoreNewsButton && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMoreNews}
                        disabled={newsSearchIsLoading || newsSearchIsFetching}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {newsSearchIsFetching ? 'Loading...' : `Load More News (${currentNewsArticleCount}/${currentNewsTotalResults})`}
                    </button>
                </div>
            )}
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Movie Results
            </h2>
            {moviesContent}
            {moviesSearchIsFetching && <LoadingSpinner message="Loading more movies..." />}
            {showLoadMoreMoviesButton && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMoreMovies}
                        disabled={moviesSearchIsLoading || moviesSearchIsFetching}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {moviesSearchIsFetching ? 'Loading...' : `Load More Movies (${currentMoviesArticleCount}/${currentMoviesTotalResults})`}
                    </button>
                </div>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Social Post Results
            </h2>
            {socialContent}
            {socialSearchIsFetching && <LoadingSpinner message="Loading more social posts..." />}
            {showLoadMoreSocialPostsButton && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMoreSocialPosts}
                        disabled={socialSearchIsLoading || socialSearchIsFetching}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {socialSearchIsFetching ? 'Loading...' : `Load More Posts (${currentSocialPostsArticleCount}/${currentSocialPostsTotalResults})`}
                    </button>
                </div>
            )}
          </section>
        </>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Latest News
            </h2>
            {newsContent}
            {newsCategoryIsFetching && <LoadingSpinner message="Loading more news..." />}
            {showLoadMoreNewsButton && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMoreNews}
                        disabled={newsCategoryIsLoading || newsCategoryIsFetching}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {newsCategoryIsFetching ? 'Loading...' : `Load More News (${currentNewsArticleCount}/${currentNewsTotalResults})`}
                    </button>
                </div>
            )}
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Popular Movies
            </h2>
            {moviesContent}
            {moviesIsFetching && <LoadingSpinner message="Loading more movies..." />}
            {showLoadMoreMoviesButton && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMoreMovies}
                        disabled={moviesIsLoading || moviesIsFetching}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {moviesIsFetching ? 'Loading...' : `Load More Movies (${currentMoviesArticleCount}/${currentMoviesTotalResults})`}
                    </button>
                </div>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Trending Social Posts
            </h2>
            {socialContent}
            {socialIsFetching && <LoadingSpinner message="Loading more social posts..." />}
            {showLoadMoreSocialPostsButton && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleLoadMoreSocialPosts}
                        disabled={socialIsLoading || socialIsFetching}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {socialIsFetching ? 'Loading...' : `Load More Posts (${currentSocialPostsArticleCount}/${currentSocialPostsTotalResults})`}
                    </button>
                </div>
            )}
          </section>
        </>
      )}
    </MainLayout>
  );
}