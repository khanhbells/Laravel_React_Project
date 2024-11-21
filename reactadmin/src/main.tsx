import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './redux/store'
import { Provider } from 'react-redux'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AuthMiddleware from './middleware/authMiddleware';
import Layout from './components/layout';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import User from './pages/user/user'
import './index.css';

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Login />
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
