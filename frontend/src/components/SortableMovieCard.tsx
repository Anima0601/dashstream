
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MovieCard from './MovieCard'; 
import { Movie } from '../types/tmdb'; 

interface SortableMovieCardProps {
  movie: Movie;
}

const SortableMovieCard: React.FC<SortableMovieCardProps> = ({ movie }) => {
  
  const id = String(movie.id); 

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
      <MovieCard movie={movie} />
    </div>
  );
};

export default SortableMovieCard;