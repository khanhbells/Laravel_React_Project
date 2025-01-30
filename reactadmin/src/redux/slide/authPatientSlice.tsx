import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Patient } from '../../types/Patient'


export interface AuthPatientState {
    isAuthenticated: boolean,
    patient: Patient | null
}

const initialState: AuthPatientState = {
    isAuthenticated: false,
    patient: null
}

export const authPatientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setAuthPatientLogin: (state, action: PayloadAction<Patient | null>) => {
            state.isAuthenticated = true
            state.patient = action.payload
        },

        setAuthPatientLogout: (state) => {
            state.isAuthenticated = false
            state.patient = null
        }
    },
})

// Action creators are generated for each case reducer function
export const { setAuthPatientLogin, setAuthPatientLogout } = authPatientSlice.actions

export default authPatientSlice.reducer