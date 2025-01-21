import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';
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
//Patient
import PatientIndex from '@/modules/Patient/screens'
//UserCatalogue
import UserCatalogueIndex from '@/modules/UserCatalogue/screens/View';
import Permission from '@/modules/UserCatalogue/screens/Permission';
//PatientCatalogue
import PatientCatalogueIndex from '@/modules/PatientCatalogue/screens';
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
//SpecialtyCatalogue
import SpecialtyCatalogueIndex from './modules/SpecialtyCatalogue/screens';
import SpecialtyCatalogueStore from './modules/SpecialtyCatalogue/screens/Store';
import { ReactQueryDevtools } from 'react-query/devtools'
//Doctor
import DoctorIndex from './modules/Doctor/screens';
import DoctorStore from './modules/Doctor/screens/Store';
//TimeSlot
import TimeSlotIndex from '@/modules/TimeSlot/screens';
//Schedules
import ScheduleIndex from '@/modules/Schedule/screens';
import ScheduleCreate from '@/modules/Schedule/screens/Store';
//System
import SytemIndex from '@/modules/System/screens';
/*--------------------------UI/UX------------------------- */
import LayoutFrontend from './components/Frontend/Layout';
import HomePage from './components/Frontend/HomePage';
import DetailDoctor from './components/Frontend/Section/DetailDoctor';
import ScrollToTop from './components/ScrollToTop';


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
      { path: "/patient/index", element: <PatientIndex /> },
      { path: "/user/catalogue/index", element: <UserCatalogueIndex /> },
      { path: "/patient/catalogue/index", element: <PatientCatalogueIndex /> },
      { path: "/post/catalogue/index", element: <PostCatalogueIndex /> },
      { path: "/post/catalogue/create", element: <PostCatalogueStore /> },
      { path: "/post/catalogue/update/:id", element: <PostCatalogueStore /> },
      { path: "/post/index", element: <PostIndex /> },
      { path: "/post/create", element: <PostStore /> },
      { path: "/post/update/:id", element: <PostStore /> },
      { path: "/setting/tag/index", element: <TagIndex /> },
      { path: "/user/permission/index", element: <PermissionIndex /> },
      { path: "/user/catalogue/permission", element: <Permission /> },
      { path: "/hospital/index", element: <HospitalIndex /> },
      { path: "/hospital/create", element: <HospitalStore /> },
      { path: "/hospital/update/:id", element: <HospitalStore /> },
      { path: "/specialty/index", element: <SpecialtyIndex /> },
      { path: "/specialty/create", element: <SpecialtyStore /> },
      { path: "/specialty/update/:id", element: <SpecialtyStore /> },
      { path: "/specialty/catalogue/index", element: <SpecialtyCatalogueIndex /> },
      { path: "/specialty/catalogue/create", element: <SpecialtyCatalogueStore /> },
      { path: "/specialty/catalogue/update/:id", element: <SpecialtyCatalogueStore /> },
      { path: "/user/doctor/index", element: <DoctorIndex /> },
      { path: "/user/doctor/update/:id", element: <DoctorStore /> },
      { path: "/setting/timeSlot/index", element: <TimeSlotIndex /> },
      { path: "/schedule/index", element: <ScheduleIndex /> },
      { path: "/schedule/create", element: <ScheduleCreate /> },
      { path: "/system/index", element: <SytemIndex /> },
    ]
  },
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <LayoutFrontend />
      </>
    ),
    children: [
      { path: "homepage", element: <HomePage /> },
      { path: "homepage/:specialId/:specialty/:doctorId/:name.html", element: <DetailDoctor /> },
      { path: "homepage/:specialId/:specialty.html", element: <HomePage /> },
    ]
  },
]);

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  </Provider>
)
