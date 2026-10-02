import { createBrowserRouter } from 'react-router';
import App from './App';
import { CancelledError } from '@tanstack/react-query';
import { queryClient } from '@lib/queryClient';
import { usersQuery } from '@hooks/Profile';

import Success from '@src/pages/success';
import NotFound from '@src/pages/not_found';

function Fallback() {
  return (
    <div className="preloader">
      <div className="progress"/>
    </div>
  );
}

const usersLoader = async () => {
  try {
    return await queryClient.query(usersQuery());
  } catch (e) {
    if (e instanceof CancelledError) return null; // component's useQuery will refetch
    throw e;
  }
};

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      HydrateFallback: Fallback,
      children: [
        {
          path: '/',
          index: true,
          lazy: async () => {
            const { default: Component } = await import('@page/dashboard/dashboard');
            return { Component, loader: usersLoader};
          },
        },
        {
          path: 'login',
          lazy: async () => {
            const { default: Component } = await import('@page/page');
            return { Component, loader: usersLoader};
          },
        },
        {
          path: 'register',
          lazy: async () => {
            const { default: Component } = await import('@page/profile/profile');
            return { Component, loader: usersLoader};
          },
        },
        {
          path: 'update/:id',
          lazy: async () => {
            const { default: Component } = await import('@page/profile/profile');
            return { Component, loader: usersLoader};
          },
        },
        {
          path: 'success',
          element: <Success/>
        },
        {
          path: '*',
          element: <NotFound/>
        },
      ],
    },
  ],
  {
    basename: '/simple-crud/',
  }
);