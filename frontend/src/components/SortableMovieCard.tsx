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
      // Only attributes, not listeners, on the main draggable div
      // We keep attributes here so screen readers still know it's draggable.
      {...attributes}
      className="relative"
    >
      {/* Drag Handle: This is the element that will receive the listeners */}
      <div
        className="absolute top-2 right-2 cursor-grab text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        style={{ zIndex: 11 }} // Ensure handle is above other elements
        {...listeners} // <-- Only the drag handle gets the listeners
      >
        {/* You can use a drag icon here, e.g., from Heroicons or a custom SVG */}
        {/* For now, just a simple visual indicator: */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </div>

      {/* The original MovieCard which now has its favorite button clickable */}
      <MovieCard movie={movie} />
    </div>
  );
};

export default SortableMovieCard;