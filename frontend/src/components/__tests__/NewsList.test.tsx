// src/components/__tests__/NewsList.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server'; // Import the MSW server setup
import NewsList from '../NewsList';

describe('NewsList Component', () => {
  it('should display loading state initially, then articles on successful fetch', async () => {
    render(<NewsList />);

    // Check for loading state immediately after render
    expect(screen.getByText('Loading news...')).toBeInTheDocument();

    // Wait for the asynchronous data fetching to complete and content to render
    await waitFor(() => {
      expect(screen.getByText('Test News Article 1')).toBeInTheDocument();
      expect(screen.getByText('Test News Article 2')).toBeInTheDocument();
      // Ensure loading message is gone once content is loaded
      expect(screen.queryByText('Loading news...')).not.toBeInTheDocument();
    });
  });

  it('should display "No news available" when no articles are fetched', async () => {
    // Override the default MSW handler for this specific test
    // This handler will return an empty array, simulating no news
    server.use(
      http.get('https://api.example.com/news', () => {
        return HttpResponse.json([]);
      })
    );

    render(<NewsList />);

    // Wait for the component to process the empty response
    await waitFor(() => {
      expect(screen.getByText('No news available.')).toBeInTheDocument();
      expect(screen.queryByText('Loading news...')).not.toBeInTheDocument();
    });
  });

  it('should display an error message on failed fetch', async () => {
    // Override the default MSW handler for this specific test
    // This handler will return a 500 status code, simulating an API error
    server.use(
      http.get('https://api.example.com/news', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      })
    );

    render(<NewsList />);

    // Wait for the component to display the error message
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch news/i)).toBeInTheDocument();
      expect(screen.queryByText('Loading news...')).not.toBeInTheDocument();
    });
  });
});