
'use client';

import React, { useEffect, useState } from 'react';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
}

const NewsList: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
       
        const response = await fetch('https://api.example.com/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data: NewsArticle[] = await response.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading news...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div className="text-center p-4">No news available.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Latest News</h2>
      {articles.map((article) => (
        <div key={article.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-3">
          <h3 className="text-xl font-semibold dark:text-white">{article.title}</h3>
          <p className="text-gray-700 dark:text-gray-300">{article.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;