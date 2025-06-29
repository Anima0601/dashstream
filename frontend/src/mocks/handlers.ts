// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example: Mock a GET request to a news API
  http.get('https://api.example.com/news', () => {
    return HttpResponse.json([
      { id: '1', title: 'Test News Article 1', content: 'Content for article 1.' },
      { id: '2', title: 'Test News Article 2', content: 'Content for article 2.' },
    ]);
  }),

  // Example: Mock a GET request for a specific article
  http.get('https://api.example.com/news/:id', ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return HttpResponse.json({ id: '1', title: 'Test News Article 1', content: 'Content for article 1.' });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  // You can add more handlers for other APIs your app uses
];