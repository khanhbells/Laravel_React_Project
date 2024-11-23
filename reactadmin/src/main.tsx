import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './redux/store'
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthMiddleware from './middleware/AuthMiddleware';
import NoAuthMiddleware from './middleware/NoAuthMiddleware';
import Layout from './components/layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import User from './pages/user/User'
import './index.css';

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
        path: "/user", element: <User />
      }
    ]
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer />
  </Provider>
)
