import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthPatientState {
    isAuthenticated: boolean;
    idDoctor: string | null;
}

const initialState: AuthPatientState = {
    isAuthenticated: false,
    idDoctor: null,
};

export const idDoctorSlice = createSlice({
    name: "idDoctor",
    initialState,
    reducers: {
        setIdDoctor: (state, action: PayloadAction<string | null>) => {
            state.isAuthenticated = true;
            state.idDoctor = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setIdDoctor } = idDoctorSlice.actions;

export default idDoctorSlice.reducer;
