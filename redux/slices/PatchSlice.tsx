import { createSlice } from '@reduxjs/toolkit';
import Patch from '../../datas/PatchData';

// Define a type for the slice state
export interface PatchStateInterface {
    patchTab: Patch[]
}
  
// Define the initial state using that type
const initialState: PatchStateInterface = {
    patchTab: []
}

const patchSlice = createSlice({
    name: 'isLogin',
    initialState,

    reducers: {
        addPatch: (state, action) => {
            state.patchTab.push(action.payload);
        },
        delPatch: (state, action) => {
            const i = state.patchTab.indexOf(action.payload);
            state.patchTab.splice(i,1)
        },
    },
});

export const { addPatch, delPatch } = patchSlice.actions;
export default patchSlice.reducer;