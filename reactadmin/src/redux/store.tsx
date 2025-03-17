import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./slide/toastSlice";
import authReducer from "./slide/authSlice";
import authPatientReducer from "./slide/authPatientSlice";
import idMedicineCatalogueReducer from "./slide/idMedicineCatalogueSlice";
import idDoctorReducer from "./slide/idDoctorSlice";

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        auth: authReducer,
        patient: authPatientReducer,
        idMedicineCatalogue: idMedicineCatalogueReducer,
        idDoctor: idDoctorReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
