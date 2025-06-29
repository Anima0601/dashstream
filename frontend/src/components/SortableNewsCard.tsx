
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
      {...attributes} 
      {...listeners} 
      className="relative" 
    >
      <NewsCard article={article} />
    </div>
  );
};

export default SortableNewsCard;