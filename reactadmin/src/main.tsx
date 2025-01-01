import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './redux/store'
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import AuthMiddleware from './middleware/AuthMiddleware';
import NoAuthMiddleware from './middleware/NoAuthMiddleware';
import Layout from './components/layout';
import Dashboard from './modules/Dashboard';
import Login from './modules/Login';
import UserIndex from '@/modules/User/screens/View'
import UserCatalogueIndex from '@/modules/UserCatalogue/screens/View';
import PostCatalogueIndex from '@/modules/PostCatalogue/screens/View';
import PostCatalogueStore from '@/modules/PostCatalogue/screens/Store';
import './index.css';
import { ReactQueryDevtools } from 'react-query/devtools'

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <NoAuthMiddleware>
        <Login />
      </NoAuthMiddleware>
    )
  },
  {
    path: "/",
    element: (
      <AuthMiddleware>
        <Layout />
      </AuthMiddleware>
    ),
    children: [
      {
        path: "/dashboard", element: <Dashboard />
      },
      {
        path: "/user/index", element: <UserIndex />
      },
      {
        path: "/user/catalogue/index", element: <UserCatalogueIndex />
      },
      {
        path: "/post/catalogue/index", element: <PostCatalogueIndex />
      },
      {
        path: "/post/catalogue/create", element: <PostCatalogueStore />
      },
    ]
  },
]);

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  </Provider>
)
