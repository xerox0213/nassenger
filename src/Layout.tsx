import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@pages/Home/Home';
import SignIn from '@pages/SignIn/components/SignIn/SignIn';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
