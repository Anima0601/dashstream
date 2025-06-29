Personalized Content Dashboard (DASHSTREAM)
A dynamic and personalized content dashboard built with React and Next.js, allowing users to aggregate and manage their favorite news articles, movie recommendations, and social media feeds. It features configurable user preferences, a robust search with debounce functionality, a dark mode toggle, and interactive content organization via drag-and-drop.

✨ Features
Personalized Content Feed:

Fetches and displays the latest news articles.

Provides personalized movie recommendations (powered by TMDB API integration).

Displays social media posts (currently using a mock API).

Content sources are unified into a single, seamless feed.

User Preferences & Persistence:

Users can configure content preferences (e.g., favorite categories, dark mode).

Preferences are managed with Redux Toolkit and persisted using local storage to maintain settings across sessions.

Interactive Content Cards:

Displays content pieces (news articles, movies, social posts) with relevant information like images, headlines, and descriptions.

Drag-and-Drop Organization:

Intuitive drag-and-drop functionality allows users to reorder content cards within their feed, personalizing their view even further.

Responsive Dashboard Layout:

Features a responsive design with a top header (including search and settings access) and a navigation sidebar.

Favorites Section:

Users can mark content as "favorite," and these items are conveniently displayed in a dedicated Favorites section.

Advanced Search Functionality:

A powerful search bar in the header allows users to search across various content categories.

Includes a debounced search implementation for optimized performance as the user types.

Dark Mode Toggle:

A seamless dark mode toggle provides a comfortable viewing experience, adapting the UI to user preference.

Robust State Management:

Utilizes Redux Toolkit for efficient and scalable global state management across the application.

RTK Query is employed for streamlined and efficient asynchronous data fetching from various APIs.

🚀 Technologies Used
Framework: React, Next.js

Language: TypeScript

State Management: Redux Toolkit, RTK Query

Styling: Tailwind CSS (for utility-first styling and dark mode)

Testing:

Jest (Unit & Integration Testing)

React Testing Library (for testing React components)

MSW (Mock Service Worker for API mocking in tests)

Drag-and-Drop: (Likely a drag-and-drop library like React DnD or Framer Motion, inferred from "Sortable" components)

📦 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js: Version 18 or higher recommended.

npm or Yarn: A package manager for JavaScript.

Installation
Clone the repository:

Bash

git clone <repository-url> # Replace with your actual repository URL
cd personalized-content-dashboard # Or the name of your project folder
Install dependencies:

Bash

npm install
# or
yarn install
Running the Development Server
To start the development server:

Bash

npm run dev
# or
yarn dev
The application will be accessible in your browser at http://localhost:3000.

Running Tests
To run the unit and integration tests:

Bash

npm test
# or
yarn test
This will execute all tests using Jest and MSW.

📁 Project Structure Overview
.
├── src/
│   ├── api/                 # API client configurations (if any specific to frontend, distinct from services)
│   ├── app/                 # Next.js App Router root, including pages and layout
│   │   ├── favorites/       # Dedicated page for favorite content
│   │   ├── favicon.ico
│   │   ├── globals.css      # Global styles, including Tailwind CSS imports and dark mode variables
│   │   ├── layout.tsx       # Root layout for the Next.js application
│   │   └── page.tsx         # Main dashboard page
│   ├── components/          # Reusable UI components
│   │   ├── __tests__/       # Jest tests for components
│   │   │   ├── Header.test.tsx
│   │   │   ├── NewsList.test.tsx
│   │   │   └── userPreferencesSlice.test.ts
│   │   ├── Header.tsx       # Top header with search, settings links, and theme toggle
│   │   ├── MainLayout.tsx   # Core layout wrapper component
│   │   ├── MovieCard.tsx    # Component to display movie details
│   │   ├── NewsCard.tsx     # Component to display news article details
│   │   ├── NewsList.tsx     # Component to render a list of news articles
│   │   ├── Sidebar.tsx      # Navigation sidebar component
│   │   ├── SocialPostCard.tsx # Component to display social media post details
│   │   ├── SortableMovieCard.tsx # Movie card with drag-and-drop capabilities
│   │   ├── SortableNewsCard.tsx  # News card with drag-and-drop capabilities
│   │   └── SortableSocialPostCard.tsx # Social post card with drag-and-drop capabilities
│   ├── data/                # Static or mock data files
│   │   └── mockSocialPosts.ts
│   ├── hooks/               # Custom React hooks
│   ├── mocks/               # Mock Service Worker setup for API mocking
│   │   ├── handlers.ts      # MSW request handlers
│   │   └── server.ts        # MSW server setup
│   ├── redux/               # Redux store configuration
│   │   ├── services/        # RTK Query API services
│   │   │   ├── newsApi.ts
│   │   │   ├── socialApi.ts
│   │   │   └── tmdbApi.ts
│   │   ├── slices/          # Redux slices for different state domains
│   │   │   ├── favoritesSlice.ts
│   │   │   └── userPreferencesSlice.ts
│   │   ├── hooks.ts         # Typed Redux hooks (useAppDispatch, useAppSelector)
│   │   └── store.ts         # Redux store definition
│   └── types/               # TypeScript type definitions
│       ├── news.ts
│       ├── social.ts
│       └── tmdb.ts
├── .babelrc
├── .env.local
├── .gitignore
├── db.json                  # Potentially for JSON server or similar local data
├── eslint.config.mjs
├── jest.config.ts           # Jest configuration
├── jest.polyfills.ts        # Polyfills for Jest environment
├── jest.setup.ts            # Jest setup file (e.g., MSW, @testing-library/jest-dom)
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs       # PostCSS configuration for Tailwind CSS
└── README.md
💡 Usage
Navigate: Use the sidebar to navigate between different sections of your dashboard (e.g., main feed, favorites).

Search: Type into the search bar in the header to find news, movies, or social posts. The results will update as you type with a slight delay for performance.

Toggle Theme: Click the theme controller (usually a sun/moon icon) in the header to switch between light and dark modes. Your preference will be saved.

Organize Content: Drag and drop the news, movie, or social post cards to reorder them according to your preference within the feed.

Manage Favorites: Explore the "Favorites" section to view content you've marked for quick access.