import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@pages/Home/Home';
import SignIn from '@pages/SignIn/components/SignIn/SignIn';
import Chat from '@pages/[id]/[id]';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: ':conversationID',
        element: <Chat />,
      },
    ],
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
]);

function Layout() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default Layout;
