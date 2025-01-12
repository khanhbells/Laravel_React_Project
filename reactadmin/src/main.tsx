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
//User
import UserIndex from '@/modules/User/screens/View'
//UserCatalogue
import UserCatalogueIndex from '@/modules/UserCatalogue/screens/View';
import Permission from '@/modules/UserCatalogue/screens/Permission';
//PostCatalogue
import PostCatalogueIndex from '@/modules/PostCatalogue/screens/View';
import PostCatalogueStore from '@/modules/PostCatalogue/screens/Store';
//Post
import PostIndex from '@/modules/Post/screens/index';
import PostStore from '@/modules/Post/screens/Store';
//Tag
import TagIndex from '@/modules/Tag/screens';
//Permission
import PermissionIndex from '@/modules/Permission/screens';
//Hospital
import HospitalIndex from './modules/Hospital/screens';
import HospitalStore from './modules/Hospital/screens/Store';
//Specialty
import './index.css';
import SpecialtyIndex from './modules/Specialty/screens';
import SpecialtyStore from './modules/Specialty/screens/Store';
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
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/user/index", element: <UserIndex /> },
      { path: "/user/catalogue/index", element: <UserCatalogueIndex /> },
      { path: "/post/catalogue/index", element: <PostCatalogueIndex /> },
      { path: "/post/catalogue/create", element: <PostCatalogueStore /> },
      { path: "/post/catalogue/update/:id", element: <PostCatalogueStore /> },
      { path: "/post/index", element: <PostIndex /> },
      { path: "/post/create", element: <PostStore /> },
      { path: "/post/update/:id", element: <PostStore /> },
      { path: "/tag/index", element: <TagIndex /> },
      { path: "/permission/index", element: <PermissionIndex /> },
      { path: "user/catalogue/permission", element: <Permission /> },
      { path: "/hospital/index", element: <HospitalIndex /> },
      { path: "/hospital/create", element: <HospitalStore /> },
      { path: "/hospital/update/:id", element: <HospitalStore /> },
      { path: "/specialty/index", element: <SpecialtyIndex /> },
      { path: "/specialty/create", element: <SpecialtyStore /> },
      { path: "/specialty/update/:id", element: <SpecialtyStore /> },
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
