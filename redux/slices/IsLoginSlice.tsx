import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface IsLoginStateInterface {
    isLogin: boolean
}
  
// Define the initial state using that type
const initialState: IsLoginStateInterface = {
    isLogin: false
}

const isLoginSlice = createSlice({
    name: 'isLogin',
    initialState,
    reducers: {
      setIsLogin: (state, action) => {
        state.isLogin = action.payload;
      },
    },
});

export const { setIsLogin } = isLoginSlice.actions;
export default isLoginSlice.reducer;