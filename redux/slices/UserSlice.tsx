import { createSlice } from '@reduxjs/toolkit';
import User from '../../datas/UserData';

// Define a type for the slice state
export interface UserStateInterface {
    user: User
}
  
// Define the initial state using that type
const initialState: UserStateInterface = {
    user: new User('', '', '', '', '', 0, '', '', '')
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
      },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;