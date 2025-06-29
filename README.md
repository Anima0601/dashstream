# Personalized Content Dashboard (DASHSTREAM)

A dynamic and personalized content dashboard built with React and Next.js, allowing users to aggregate and manage their favorite news articles, movie recommendations, and social media feeds. It features configurable user preferences, a robust search with debounce functionality, a dark mode toggle, and interactive content organization via drag-and-drop.

---

✨ **Features**

* **Personalized Content Feed:**
    * Fetches and displays the latest news articles.
    * Provides personalized movie recommendations (powered by TMDB API integration).
    * Displays social media posts (currently using a mock API via `json-server`).
    * Content sources are unified into a single, seamless feed.
* **User Preferences & Persistence:**
    * Users can configure content preferences (e.g., favorite categories, dark mode).
    * Preferences are managed with Redux Toolkit and persisted using local storage to maintain settings across sessions.
* **Interactive Content Cards:**
    * Displays content pieces (news articles, movies, social posts) with relevant information like images, headlines, and descriptions.
* **Drag-and-Drop Organization:**
    * Intuitive drag-and-drop functionality allows users to reorder content cards within their feed, personalizing their view even further.
* **Responsive Dashboard Layout:**
    * Features a responsive design with a top header (including search and settings access) and a navigation sidebar.
* **Favorites Section:**
    * Users can mark content as "favorite," and these items are conveniently displayed in a dedicated Favorites section.
* **Advanced Search Functionality:**
    * A powerful search bar in the header allows users to search across various content categories.
    * Includes a debounced search implementation for optimized performance as the user types.
* **Dark Mode Toggle:**
    * A seamless dark mode toggle provides a comfortable viewing experience, adapting the UI to user preference.
* **Robust State Management:**
    * Utilizes Redux Toolkit for efficient and scalable global state management across the application.
    * RTK Query is employed for streamlined and efficient asynchronous data fetching from various APIs.

---

🚀 **Technologies Used**

* **Framework:** React, Next.js
* **Language:** TypeScript
* **State Management:** Redux Toolkit, RTK Query
* **Styling:** Tailwind CSS (for utility-first styling and dark mode)
* **Testing:**
    * Jest (Unit & Integration Testing)
    * React Testing Library (for testing React components)
    * MSW (Mock Service Worker for API mocking in tests)
* **Drag-and-Drop:** [@dnd-kit/core](https://dndkit.com/), [@dnd-kit/sortable](https://dndkit.com/docs/api/sortable)
* **Local API Mocking:** [JSON Server](https://github.com/typicode/json-server)

---

📦 **Getting Started**

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* **Node.js**: Version 18 or higher recommended.
* **npm** or **Yarn**: A package manager for JavaScript.
* **json-server**: For the social posts mock API. Install globally:
    ```bash
    npm install -g json-server
    # or
    yarn global add json-server
    ```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Anima0601/dashstream 
    cd frontend 
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### API Keys & Environment Variables

This application relies on external APIs for data. You'll need to obtain API keys and set them up as environment variables.

1.  **Create a `.env.local` file** in the root of your frontend project directory:

    ```env
    # NewsAPI.org
    NEXT_PUBLIC_NEWS_API_KEY=YOUR_NEWS_API_KEY

    # TMDB (The Movie Database)
    NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY

    # Social Posts (json-server local backend)
    # This will be running locally, so the base URL points to your json-server instance
    NEXT_PUBLIC_SOCIAL_API_BASE_URL=http://localhost:3001/
    ```

2.  **Replace `YOUR_NEWS_API_KEY`** with your actual API key from [NewsAPI.org](https://newsapi.org/).
3.  **Replace `YOUR_TMDB_API_KEY`** with your actual API key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api).

### Backend Setup (for Social Posts)

The social posts feature relies on a local mock API server using `json-server`.

1.  **Create a `db.json` file** in the root of your project (e.g., at the same level as your `frontend` folder, or in the `frontend` root if it's a standalone project).

    Add the following content to `db.json`:

    ```json
    {
      "trending_posts": [
        { "id": 1, "user": "@tech_guru", "content": "Excited for the new AI advancements!", "likes": 120, "comments": 15, "shares": 8, "timestamp": "2025-06-28T10:00:00Z" },
        { "id": 2, "user": "@movie_buff", "content": "Just watched 'The Future Echoes'! Mind-blowing visuals.", "likes": 230, "comments": 25, "shares": 12, "timestamp": "2025-06-28T11:30:00Z" },
        { "id": 3, "user": "@news_daily", "content": "Local community project gains major funding.", "likes": 75, "comments": 8, "shares": 5, "timestamp": "2025-06-28T12:45:00Z" },
        { "id": 4, "user": "@dev_life", "content": "Debugging all night... but the code's finally clean!", "likes": 180, "comments": 30, "shares": 10, "timestamp": "2025-06-28T14:15:00Z" },
        { "id": 5, "user": "@travel_explorer", "content": "Planning my next adventure to the Himalayas! Any tips?", "likes": 90, "comments": 10, "shares": 7, "timestamp": "2025-06-28T16:00:00Z" },
        { "id": 6, "user": "@foodie_fusion", "content": "Tried a new fusion recipe today. Absolutely delicious!", "likes": 150, "comments": 20, "shares": 9, "timestamp": "2025-06-28T17:30:00Z" },
        { "id": 7, "user": "@sports_fan", "content": "What a game! Unbelievable comeback in the last minute.", "likes": 200, "comments": 40, "shares": 18, "timestamp": "2025-06-28T18:45:00Z" },
        { "id": 8, "user": "@art_lover", "content": "Visited the new gallery downtown. So much inspiring work.", "likes": 110, "comments": 12, "shares": 6, "timestamp": "2025-06-28T20:00:00Z" },
        { "id": 9, "user": "@bookworm_reads", "content": "Just finished an amazing fantasy novel. Highly recommend!", "likes": 95, "comments": 10, "shares": 4, "timestamp": "2025-06-28T21:15:00Z" },
        { "id": 10, "user": "@coding_ninja", "content": "Learned a new trick with React hooks today. Mind blown!", "likes": 250, "comments": 35, "shares": 15, "timestamp": "2025-06-28T22:30:00Z" }
      ]
    }
    ```

2.  **Run `json-server`:**
    Open a **separate terminal window** (keep your frontend terminal running the Next.js app). Navigate to the directory where your `db.json` file is located (e.g., `C:\Users\Lenovo\OneDrive\Documents\GitHub\dashstream\`).

    ```bash
    json-server --watch db.json --port 3001
    ```
    This will start the mock API server at `http://localhost:3001`. Your social posts will be available at `http://localhost:3001/trending_posts`.

### Running the Development Server

To start the development server:

1.  **Ensure `json-server` is running** in a separate terminal (see "Backend Setup" above).
2.  **In your frontend project directory**, run:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

The application will be accessible in your browser at `http://localhost:3000`.

### Running Tests

To run the unit and integration tests:

```bash
npm test
# or
yarn test