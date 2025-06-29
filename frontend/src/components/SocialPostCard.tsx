
import React from 'react';
import Image from 'next/image';
import { SocialPost } from '../types/social';

interface SocialPostCardProps {
  post: SocialPost;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center mb-4">
    
        {post.author.avatarUrl && (
          <Image
            src={post.author.avatarUrl} 
            alt={post.author.name} 
            width={40}
            height={40}
            className="rounded-full mr-3 object-cover"
          />
        )}
        <div>
          {/* Access name from post.author */}
          <p className="font-semibold text-gray-900 dark:text-white">{post.author.name}</p> {/* Corrected */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
        {post.title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
        {post.content}
      </p>
      {post.imageUrl && (
        <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}
      <div className="flex justify-around items-center text-sm text-gray-600 dark:text-gray-400 mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
          </svg>
          {post.likes}
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.673l-3.256 1.73a3 3 0 100 2.546l3.256 1.73A3 3 0 1015 12V8z"></path>
          </svg>
          {post.shares}
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.173-.953l-4.114 1.467c-.22.078-.458-.165-.316-.395L.672 15.02c-.528-.847-.872-1.807-.933-2.825C.067 8.082 3.582 5 8 5s8 3.134 8 7z" clipRule="evenodd"></path>
          </svg>
          {post.comments}
        </span>
      </div>
    </div>
  );
};

export default SocialPostCard;