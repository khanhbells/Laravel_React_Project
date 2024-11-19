import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </ToastProvider>
)
