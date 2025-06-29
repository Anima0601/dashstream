// src/app/page.tsx
'use client';

import MainLayout from '../components/MainLayout';
import NewsCard from '../components/NewsCard';
import MovieCard from '../components/MovieCard';
import SocialPostCard from '../components/SocialPostCard'; // Keep this if not all are sortable
import Header from '../components/Header';
import { useAppSelector } from '../redux/hooks';
import { useGetTopHeadlinesQuery, useSearchNewsQuery } from '../redux/services/newsApi';
import { useGetPopularMoviesQuery, useSearchMoviesQuery } from '../redux/services/tmdbApi';
import { useGetTrendingSocialPostsQuery, useSearchSocialPostsQuery } from '../redux/services/socialApi';
import { NewsArticle } from '../types/news';
import { Movie } from '../types/tmdb';
import { SocialPost } from '../types/social';
import React, { useState, useCallback, useEffect } from 'react';

// --- Dnd-kit Imports ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
// --- END Dnd-kit Imports ---

// Import the new SortableCard components
import SortableNewsCard from '../components/SortableNewsCard';
import SortableMovieCard from '../components/SortableMovieCard';
import SortableSocialPostCard from '../components/SortableSocialPostCard'; // NEW IMPORT


// --- Helper Components (keep them as they are) ---
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
  const [socialPage, setSocialPage] = useState(1);

  // --- NEW STATE FOR DRAG-AND-DROP NEWS, MOVIES & SOCIAL POSTS ---
  const [sortableNewsArticles, setSortableNewsArticles] = useState<NewsArticle[]>([]);
  const [sortableMovies, setSortableMovies] = useState<Movie[]>([]);
  const [sortableSocialPosts, setSortableSocialPosts] = useState<SocialPost[]>([]); // NEW STATE for social posts
  // --- END NEW STATE ---

  const favoriteCategories = useAppSelector(
    (state) => state.userPreferences.favoriteCategories
  );

  const categoryToFetch = favoriteCategories.length > 0 ? favoriteCategories[0] : 'general';
  const NEWS_PAGE_SIZE = 9;
  const MOVIE_PAGE_SIZE = 20;
  const SOCIAL_PAGE_SIZE = 10;

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
  } = useGetTrendingSocialPostsQuery({ page: socialPage }, {
    skip: searchQuery !== '',
  });

  const {
    data: socialSearchData,
    error: socialSearchError,
    isLoading: socialSearchIsLoading,
    isFetching: socialSearchIsFetching
  } = useSearchSocialPostsQuery({ query: searchQuery, page: socialPage }, {
    skip: searchQuery === '',
  });


  // --- Dnd-kit Sensors (shared for all contexts) ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Dnd-kit Drag End Handler for NEWS ---
  const handleDragEndNews = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortableNewsArticles((prevArticles) => {
        const oldIndex = prevArticles.findIndex(article => (article.url + article.publishedAt) === active.id);
        const newIndex = prevArticles.findIndex(article => (article.url + article.publishedAt) === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(prevArticles, oldIndex, newIndex);
        }
        return prevArticles;
      });
    }
  };

  // --- Dnd-kit Drag End Handler for MOVIES ---
  const handleDragEndMovies = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortableMovies((prevMovies) => {
        const oldIndex = prevMovies.findIndex(movie => String(movie.id) === String(active.id));
        const newIndex = prevMovies.findIndex(movie => String(movie.id) === String(over?.id));

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(prevMovies, oldIndex, newIndex);
        }
        return prevMovies;
      });
    }
  };

  // --- Dnd-kit Drag End Handler for SOCIAL POSTS ---
  const handleDragEndSocialPosts = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortableSocialPosts((prevPosts) => {
        const oldIndex = prevPosts.findIndex(post => String(post.id) === String(active.id));
        const newIndex = prevPosts.findIndex(post => String(post.id) === String(over?.id));

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(prevPosts, oldIndex, newIndex);
        }
        return prevPosts;
      });
    }
  };
  // --- END Dnd-kit Drag End Handlers ---


  // --- Effect to update sortableNewsArticles when news data changes ---
  useEffect(() => {
    if (searchQuery && newsSearchData?.articles) {
      setSortableNewsArticles(newsSearchData.articles);
    } else if (!searchQuery && newsCategoryData?.articles) {
      setSortableNewsArticles(newsCategoryData.articles);
    }
  }, [newsSearchData, newsCategoryData, searchQuery]);

  // --- Effect to update sortableMovies when movie data changes ---
  useEffect(() => {
    if (searchQuery && moviesSearchData?.results) {
      setSortableMovies(moviesSearchData.results);
    } else if (!searchQuery && moviesData?.results) {
      setSortableMovies(moviesData.results);
    }
  }, [moviesSearchData, moviesData, searchQuery]);

  // --- Effect to update sortableSocialPosts when social post data changes ---
  useEffect(() => {
    if (searchQuery && socialSearchData?.posts) {
      setSortableSocialPosts(socialSearchData.posts);
    } else if (!searchQuery && socialData?.posts) {
      setSortableSocialPosts(socialData.posts);
    }
  }, [socialSearchData, socialData, searchQuery]);


  // Reset pagination pages when search query or category changes
  useEffect(() => {
    setNewsPage(1);
    setMoviePage(1);
    setSocialPage(1);
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

  const handleLoadMoreSocialPosts = () => {
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
  // Note: currentNewsArticleCount now implicitly refers to sortableNewsArticles.length

  let showLoadMoreMoviesButton = false;
  let currentMoviesTotalResults = 0;
  // Note: currentMoviesArticleCount now implicitly refers to sortableMovies.length

  let showLoadMoreSocialPostsButton = false;
  let currentSocialPostsTotalResults = 0;
  // Note: currentSocialPostsArticleCount now implicitly refers to sortableSocialPosts.length


  if (searchQuery) {
    pageTitle = `Search Results for "${searchQuery}"`;

    // News Search Content (DND Enabled)
    if (newsSearchIsLoading && !newsSearchIsFetching) {
      newsContent = <LoadingSpinner message="Searching news..." />;
    } else if (newsSearchError) {
      newsContent = <ErrorMessage error={newsSearchError} type="News" />;
    } else if (sortableNewsArticles.length > 0) {
      newsContent = (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndNews}
        >
          <SortableContext
            items={sortableNewsArticles.map(article => article.url + article.publishedAt)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortableNewsArticles.map((article: NewsArticle) => (
                <SortableNewsCard key={article.url + article.publishedAt} article={article} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
      currentNewsTotalResults = newsSearchData?.totalResults || 0;
      showLoadMoreNewsButton = sortableNewsArticles.length < currentNewsTotalResults && sortableNewsArticles.length > 0;
    } else {
      newsContent = <NoResultsMessage message={`No news results for "${searchQuery}".`} />;
    }

    // Movies Search Content (DND Enabled)
    if (moviesSearchIsLoading && !moviesSearchIsFetching) {
      moviesContent = <LoadingSpinner message="Searching movies..." />;
    } else if (moviesSearchError) {
      moviesContent = <ErrorMessage error={moviesSearchError} type="Movies" />;
    } else if (sortableMovies.length > 0) {
      moviesContent = (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndMovies}
        >
          <SortableContext
            items={sortableMovies.map(movie => String(movie.id))}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortableMovies.map((movie: Movie) => (
                <SortableMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
      currentMoviesTotalResults = moviesSearchData?.total_results || 0;
      showLoadMoreMoviesButton = sortableMovies.length < currentMoviesTotalResults && sortableMovies.length > 0;
    } else {
      moviesContent = <NoResultsMessage message={`No movie results for "${searchQuery}".`} />;
    }

    // Social Search Content (NOW WITH DND)
    if (socialSearchIsLoading && !socialSearchIsFetching) {
      socialContent = <LoadingSpinner message="Searching social posts..." />;
    } else if (socialSearchError) {
      socialContent = <ErrorMessage error={socialSearchError} type="Social Posts" />;
    } else if (sortableSocialPosts.length > 0) { // Use local sortable state
      socialContent = (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndSocialPosts} // Use specific handler for Social Posts
        >
          <SortableContext
            items={sortableSocialPosts.map(post => String(post.id))} // Use post IDs as sortable items
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortableSocialPosts.map((post: SocialPost) => (
                <SortableSocialPostCard key={post.id} post={post} /> // Use SortableSocialPostCard
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
      currentSocialPostsTotalResults = socialSearchData?.totalResults || 0; // Use original data for total
      showLoadMoreSocialPostsButton = sortableSocialPosts.length < currentSocialPostsTotalResults && sortableSocialPosts.length > 0;
    } else {
      socialContent = <NoResultsMessage message={`No social posts for "${searchQuery}".`} />;
    }

  } else { // Not searching, show personalized feed
    pageTitle = 'Your Personalized Feed';
    subTitle = `Showing news for: ${categoryToFetch}`;

    // News Category Content (DND Enabled)
    if (newsCategoryIsLoading && !newsCategoryIsFetching) {
      newsContent = <LoadingSpinner message="Loading news..." />;
    } else if (newsCategoryError) {
      newsContent = <ErrorMessage error={newsCategoryError} type="News" />;
    } else if (sortableNewsArticles.length > 0) {
      newsContent = (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndNews}
        >
          <SortableContext
            items={sortableNewsArticles.map(article => article.url + article.publishedAt)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortableNewsArticles.map((article: NewsArticle) => (
                <SortableNewsCard key={article.url + article.publishedAt} article={article} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
      currentNewsTotalResults = newsCategoryData?.totalResults || 0;
      showLoadMoreNewsButton = sortableNewsArticles.length < currentNewsTotalResults && sortableNewsArticles.length > 0;
    } else {
      newsContent = <NoResultsMessage message={`No news articles for "${categoryToFetch}".`} />;
    }

    // Movies Content (DND Enabled)
    if (moviesIsLoading && !moviesIsFetching) {
      moviesContent = <LoadingSpinner message="Loading movies..." />;
    } else if (moviesError) {
      moviesContent = <ErrorMessage error={moviesError} type="Movies" />;
    } else if (sortableMovies.length > 0) {
      moviesContent = (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndMovies}
        >
          <SortableContext
            items={sortableMovies.map(movie => String(movie.id))}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortableMovies.map((movie: Movie) => (
                <SortableMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
      currentMoviesTotalResults = moviesData?.total_results || 0;
      showLoadMoreMoviesButton = sortableMovies.length < currentMoviesTotalResults && sortableMovies.length > 0;
    } else {
      moviesContent = <NoResultsMessage message="No popular movies found." />;
    }

    // Social Posts Content (NOW WITH DND)
    if (socialIsLoading && !socialIsFetching) {
      socialContent = <LoadingSpinner message="Loading social posts..." />;
    } else if (socialError) {
      socialContent = <ErrorMessage error={socialError} type="Social Posts" />;
    } else if (sortableSocialPosts.length > 0) { // Use local sortable state
      socialContent = (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndSocialPosts} // Use specific handler for Social Posts
        >
          <SortableContext
            items={sortableSocialPosts.map(post => String(post.id))} // Use post IDs as sortable items
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortableSocialPosts.map((post: SocialPost) => (
                <SortableSocialPostCard key={post.id} post={post} /> // Use SortableSocialPostCard
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
      currentSocialPostsTotalResults = socialData?.totalResults || 0; // Use original data for total
      showLoadMoreSocialPostsButton = sortableSocialPosts.length < currentSocialPostsTotalResults && sortableSocialPosts.length > 0;
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
                        {newsSearchIsFetching ? 'Loading...' : `Load More News (${sortableNewsArticles.length}/${currentNewsTotalResults})`}
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
                        {moviesSearchIsFetching ? 'Loading...' : `Load More Movies (${sortableMovies.length}/${currentMoviesTotalResults})`}
                    </button>
                </div>
            )}
          </section>

          {/* Social Section: Now with DND */}
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
                        {socialSearchIsFetching ? 'Loading...' : `Load More Posts (${sortableSocialPosts.length}/${currentSocialPostsTotalResults})`}
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
                        {newsCategoryIsFetching ? 'Loading...' : `Load More News (${sortableNewsArticles.length}/${currentNewsTotalResults})`}
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
                        {moviesIsFetching ? 'Loading...' : `Load More Movies (${sortableMovies.length}/${currentMoviesTotalResults})`}
                    </button>
                </div>
            )}
          </section>

          {/* Social Section: Now with DND */}
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
                        {socialIsFetching ? 'Loading...' : `Load More Posts (${sortableSocialPosts.length}/${currentSocialPostsTotalResults})`}
                    </button>
                </div>
            )}
          </section>
        </>
      )}
    </MainLayout>
  );
}