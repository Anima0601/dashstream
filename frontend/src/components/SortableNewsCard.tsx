import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NewsCard from './NewsCard';
import { NewsArticle } from '../types/news';

interface SortableNewsCardProps {
  article: NewsArticle;
}

const SortableNewsCard: React.FC<SortableNewsCardProps> = ({ article }) => {

  const id = article.url + article.publishedAt;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
    padding: '0.5rem',
    margin: '0.5rem',
    boxSizing: 'border-box'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // Only attributes, not listeners, on the main draggable div
      // We keep attributes here so screen readers still know it's draggable.
      {...attributes}
      className="relative"
    >
    
      <div
        className="absolute top-2 right-2 cursor-grab text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        style={{ zIndex: 11 }} 
        {...listeners}
      >
       
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>

    
      <NewsCard article={article} />
    </div>
  );
};

export default SortableNewsCard;