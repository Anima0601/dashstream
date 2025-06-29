import { SocialPost } from '../types/social';

export const mockSocialPosts: SocialPost[] = [
  {
    id: 'soc1',
    author: {
      name: 'TechExplorer',
      avatarUrl: 'https://via.placeholder.com/40/FF5733/FFFFFF?text=TE',
    },
    // NEW: Add the 'title' property here
    title: 'AI Breakthrough in Robotics!', // <-- ADD THIS LINE
    content: "Just witnessed an incredible AI breakthrough in robotics! The future is here. #AI #Robotics #Innovation",
    imageUrl: 'https://source.unsplash.com/random/400x300/?robot',
    hashtags: ['AI', 'Robotics', 'Innovation'],
    likes: 1250,
    comments: 230,
    shares: 180,
    timestamp: '2025-06-28T14:30:00Z',
  },
  {
    id: 'soc2',
    author: {
      name: 'SportsFanatic',
      avatarUrl: 'https://via.placeholder.com/40/33FF57/FFFFFF?text=SF',
    },
    // NEW: Add the 'title' property here
    title: 'Underdogs Win Big Game!', // <-- ADD THIS LINE
    content: "What a game! The underdogs pulled off an amazing win. My jaw is still on the floor! #Sports #Gaming #Unexpected",
    imageUrl: 'https://source.unsplash.com/random/400x300/?basketball',
    hashtags: ['Sports', 'Gaming', 'Unexpected'],
    likes: 890,
    comments: 110,
    shares: 75,
    timestamp: '2025-06-28T10:15:00Z',
  },
  {
    id: 'soc3',
    author: {
      name: 'FoodieAdventures',
      avatarUrl: 'https://via.placeholder.com/40/3357FF/FFFFFF?text=FA',
    },
    // NEW: Add the 'title' property here
    title: 'Delicious Street Food Discovery!', // <-- ADD THIS LINE
    content: "Discovered the most delicious street food today! This fusion taco is a game changer. #Foodie #StreetFood #Tacos",
    imageUrl: 'https://source.unsplash.com/random/400x300/?taco',
    hashtags: ['Foodie', 'StreetFood', 'Tacos'],
    likes: 2100,
    comments: 340,
    shares: 210,
    timestamp: '2025-06-27T18:00:00Z',
  },
  {
    id: 'soc4',
    author: {
      name: 'TravelBug',
      avatarUrl: 'https://via.placeholder.com/40/FF33CC/FFFFFF?text=TB',
    },
   
    title: 'Breathtaking Mountain Sunrise!', 
    content: "Sunrise over the mountains was breathtaking. Truly felt connected to nature. #Travel #Nature #Mountains",
    imageUrl: 'https://source.unsplash.com/random/400x300/?mountains',
    hashtags: ['Travel', 'Nature', 'Mountains'],
    likes: 1500,
    comments: 190,
    shares: 120,
    timestamp: '2025-06-27T06:45:00Z',
  },
  {
    id: 'soc5',
    author: {
      name: 'ArtLover',
      avatarUrl: 'https://via.placeholder.com/40/CCFF33/FFFFFF?text=AL',
    },
   
    title: 'Gallery Visit Inspiration!', 
    content: "Spent the afternoon at the gallery. So much talent and emotion captured in every piece. #Art #Culture #Gallery",
    imageUrl: 'https://source.unsplash.com/random/400x300/?painting',
    hashtags: ['Art', 'Culture', 'Gallery'],
    likes: 950,
    comments: 80,
    shares: 40,
    timestamp: '2025-06-26T16:00:00Z',
  },
];