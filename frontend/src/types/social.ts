// src/types/social.ts

// Defines the structure for the author of a social post
export interface SocialPostAuthor {
    name: string;      // This should match "name" in your mock data
    avatarUrl: string;
}

// Defines the structure of a single social post
export interface SocialPost {
    id: string;
    title: string; // This should be present in your mock data
    content: string;
    author: SocialPostAuthor; // 'author' is an object
    imageUrl?: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: string; // <-- ENSURE ONLY THIS IS PRESENT for the date field
    // Make sure 'publishedAt: string;' is NOT present here if you see it!
    hashtags?: string[]; // This should be present in your mock data
    // Add any other fields your social posts might have
}

// Defines the structure of the API response for social posts
export interface SocialApiResponse {
    posts: SocialPost[];
    totalResults: number;
}