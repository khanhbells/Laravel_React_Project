import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SheetState {
    isOpen: boolean;
    action: string;
    id: string | undefined;
}

const initialState: SheetState = {
    isOpen: false,
    action: '',
    id: undefined,
};

const sheetSlice = createSlice({
    name: 'sheet',
    initialState,
    reducers: {
        openSheet: (state, action: PayloadAction<{ action: string; id: string }>) => {
            state.isOpen = true;
            state.action = action.payload.action;
            state.id = action.payload.id;
        },
        closeSheet: (state) => {
            state.isOpen = false;
            state.action = '';
            state.id = undefined;
        },
    },
});

export const { openSheet, closeSheet } = sheetSlice.actions;

export default sheetSlice.reducer;
