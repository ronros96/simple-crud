import { createBrowserRouter } from 'react-router';
import Home from '@page/page';
import Dashboard from '@page/dashboard/dashboard';
import Profile from '@page/profile/profile';
import App from './App';

import { queryClient } from '@lib/queryClient';
import { usersQuery } from '@hooks/Profile';

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      HydrateFallback: () => <div>Loading...</div>,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: 'register',
          element: <Profile />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
          loader: () => queryClient.query(usersQuery()),
        },
      ],
    },
  ],
  {
    basename: '/simple-crud/',
  }
);