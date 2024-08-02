import { configureStore, createSlice, combineReducers} from '@reduxjs/toolkit';

import isLoginSlice from './slices/IsLoginSlice';
import userSlice from './slices/UserSlice';
import patchSlice from './slices/PatchSlice';

const defaultMiddlewareConfig = {
   serializableCheck: false
 };

const store = configureStore({
   reducer: {
      isLoginReducer: isLoginSlice,
      userReducer: userSlice,
      patchReducer: patchSlice
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware(defaultMiddlewareConfig)
});

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']

export default store;