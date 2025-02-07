import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface AuthPatientState {
    isAuthenticated: boolean,
    idMedicineCatalogue: string | null
}

const initialState: AuthPatientState = {
    isAuthenticated: false,
    idMedicineCatalogue: null
}

export const idMedicineCatalogueSlice = createSlice({
    name: 'idMedicineCatalogue',
    initialState,
    reducers: {
        setIdMedicineCatalogue: (state, action: PayloadAction<string | null>) => {
            state.isAuthenticated = true
            state.idMedicineCatalogue = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setIdMedicineCatalogue } = idMedicineCatalogueSlice.actions

export default idMedicineCatalogueSlice.reducer