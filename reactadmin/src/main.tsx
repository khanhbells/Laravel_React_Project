import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthMiddleware from "./middleware/AuthMiddleware";
import NoAuthMiddleware from "./middleware/NoAuthMiddleware";
import Layout from "./components/Layout";
import Dashboard from "./modules/Dashboard";
//LOGIN ADMIN
import SignInAdminIndex from "./modules/Login/SignIn";
import SignUpAdminIndex from "./modules/Login/SignUp";
import ForgotPasswordAdminIndex from "./modules/Login/ForgotPassword";
import ResetPasswordAdminIndex from "./modules/Login/ResetPassword/ResetPassword";
//User
import UserIndex from "@/modules/User/screens";
//Patient
import PatientIndex from "@/modules/Patient/screens";
//UserCatalogue
import UserCatalogueIndex from "@/modules/UserCatalogue/screens";
import Permission from "@/modules/UserCatalogue/screens/Permission";
//PatientCatalogue
import PatientCatalogueIndex from "@/modules/PatientCatalogue/screens";
//PostCatalogue
import PostCatalogueIndex from "@/modules/PostCatalogue/screens";
import PostCatalogueStore from "@/modules/PostCatalogue/screens/Store";
//Post
import PostIndex from "@/modules/Post/screens/index";
import PostStore from "@/modules/Post/screens/Store";
//Tag
import TagIndex from "@/modules/Tag/screens";
//Permission
import PermissionIndex from "@/modules/Permission/screens";
//Hospital
import HospitalIndex from "./modules/Hospital/screens";
import HospitalStore from "./modules/Hospital/screens/Store";
//Specialty
import "./index.css";
import SpecialtyIndex from "./modules/Specialty/screens";
import SpecialtyStore from "./modules/Specialty/screens/Store";
//SpecialtyCatalogue
import SpecialtyCatalogueIndex from "./modules/SpecialtyCatalogue/screens";
import SpecialtyCatalogueStore from "./modules/SpecialtyCatalogue/screens/Store";
import { ReactQueryDevtools } from "react-query/devtools";
//Doctor
import DoctorIndex from "./modules/Doctor/screens";
import DoctorStore from "./modules/Doctor/screens/Store";
//TimeSlot
import TimeSlotIndex from "@/modules/TimeSlot/screens";
//Schedules
import ScheduleIndex from "@/modules/Schedule/screens";
import ScheduleCreate from "@/modules/Schedule/screens/Store";
//System
import SytemIndex from "@/modules/System/screens";
//Booking
import BookingIndex from "@/modules/Booking/screens";
import BookingMedicine from "./modules/Booking/screens/include/StoreBookingMedicine";
//Medicine
import MedicineIndex from "./modules/Medicine/screens";
import MedicineStore from "./modules/Medicine/screens/Store";
//Medicine Catalogue
import MedicineCatalogueIndex from "./modules/MedicineCatalogue/screens";
import MedicineCatalogueStore from "./modules/MedicineCatalogue/screens/Store";
/*--------------------------UI/UX------------------------- */
import LayoutFrontend from "./components/Frontend/Layout";
import HomePage from "./components/Frontend";
import DetailDoctor from "./components/Frontend/Section/Doctor";
import ScrollToTop from "./components/ScrollToTop";
import SpecialtyCatalogueFrontEndIndex from "./components/Frontend/Section/SpecialtyCatalogue";
import HospitalFrontEndIndex from "./components/Frontend/Section/Hospital";
import PostCatalogueFrontEndIndex from "./components/Frontend/Section/PostCatalogue";
import SpecialtyFrontEndIndex from "./components/Frontend/Section/Specialty";
import SuccessIndex from "./components/Frontend/Section/Success";
//Login Patient
import SignUpPatientIndex from "./components/Frontend/Section/Login/SignUp";
import SignInPatientIndex from "./components/Frontend/Section/Login/SignIn";
import ForgotPasswordPatientIndex from "./components/Frontend/Section/Login/ForgotPassword";
import ResetPasswordIPatientndex from "./components/Frontend/Section/Login/ResetPassword/ResetPassword";
//
import NoAuthPatientMiddleware from "./middleware/NoPatientMiddleware";
import AuthPatienMiddleware from "./middleware/AuthPatientMiddleware";
import HistoryIndex from "./components/Frontend/Section/History";

const router = createBrowserRouter([
    {
        path: "/admin",
        element: <NoAuthMiddleware />, // Middleware chung
        children: [
            { path: "", element: <SignInAdminIndex /> },
            { path: "signUp", element: <SignUpAdminIndex /> },
            { path: "forgotPassword", element: <ForgotPasswordAdminIndex /> },
            { path: "resetPassword", element: <ResetPasswordAdminIndex /> },
        ],
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
            { path: "/detail/dashboard", element: <Dashboard /> },
            { path: "/user/index", element: <UserIndex /> },
            { path: "/patient/index", element: <PatientIndex /> },
            { path: "/user/catalogue/index", element: <UserCatalogueIndex /> },
            {
                path: "/patient/catalogue/index",
                element: <PatientCatalogueIndex />,
            },
            { path: "/post/catalogue/index", element: <PostCatalogueIndex /> },
            { path: "/post/catalogue/create", element: <PostCatalogueStore /> },
            {
                path: "/post/catalogue/update/:id",
                element: <PostCatalogueStore />,
            },
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
            {
                path: "/specialty/catalogue/index",
                element: <SpecialtyCatalogueIndex />,
            },
            {
                path: "/specialty/catalogue/create",
                element: <SpecialtyCatalogueStore />,
            },
            {
                path: "/specialty/catalogue/update/:id",
                element: <SpecialtyCatalogueStore />,
            },
            { path: "/user/doctor/index", element: <DoctorIndex /> },
            { path: "/user/doctor/update/:id", element: <DoctorStore /> },
            { path: "/setting/timeSlot/index", element: <TimeSlotIndex /> },
            { path: "/schedule/index", element: <ScheduleIndex /> },
            { path: "/schedule/create", element: <ScheduleCreate /> },
            { path: "/system/index", element: <SytemIndex /> },
            { path: "/booking/index", element: <BookingIndex /> },
            { path: "/booking/medicine/:id", element: <BookingMedicine /> },
            { path: "/medicine/index", element: <MedicineIndex /> },
            { path: "/medicine/create", element: <MedicineStore /> },
            { path: "/medicine/update/:id", element: <MedicineStore /> },
            {
                path: "/medicine/catalogue/index",
                element: <MedicineCatalogueIndex />,
            },
            {
                path: "/medicine/catalogue/create",
                element: <MedicineCatalogueStore />,
            },
            {
                path: "/medicine/catalogue/update/:id",
                element: <MedicineCatalogueStore />,
            },
        ],
    },
    {
        path: "/patient",
        element: (
            <NoAuthPatientMiddleware>
                <LayoutFrontend />
            </NoAuthPatientMiddleware>
        ),
        children: [
            { path: "signup.html", element: <SignUpPatientIndex /> },
            { path: "signin.html", element: <SignInPatientIndex /> },
            {
                path: "forgotPassword.html",
                element: <ForgotPasswordPatientIndex />,
            },
            {
                path: "resetPassword.html",
                element: <ResetPasswordIPatientndex />,
            },
        ],
    },
    {
        path: "/",
        element: (
            <>
                <AuthPatienMiddleware>
                    <ScrollToTop />
                    <LayoutFrontend />
                </AuthPatienMiddleware>
            </>
        ),
        children: [
            { path: "homepage.html", element: <HomePage /> },
            {
                path: "homepage/specialty/:catalogueId/:catalogue.html",
                element: <SpecialtyCatalogueFrontEndIndex />,
            },
            {
                path: "homepage/hospital/:hospitalId/:hospital.html",
                element: <HospitalFrontEndIndex />,
            },
            {
                path: "homepage/specialty/:catalogueId/:catalogue/:specialId/:specialty.html",
                element: <SpecialtyFrontEndIndex />,
            },
            {
                path: "homepage/specialty/:catalogueId/:catalogue/:specialId/:specialty/:doctorId/:doctor.html",
                element: <DetailDoctor />,
            },
            {
                path: "homepage/post/:catalogueId/:catalogue.html",
                element: <PostCatalogueFrontEndIndex />,
            },
            { path: "homepage/success/:id.html", element: <SuccessIndex /> },
            { path: "homepage/history/:id.html", element: <HistoryIndex /> },
        ],
    },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <RouterProvider router={router} />
            </HelmetProvider>
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
    </Provider>
);
