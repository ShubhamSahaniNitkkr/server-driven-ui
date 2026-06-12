import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@sdui/shared';

interface UserState {
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('sdui-token') : null;

const initialState: UserState = {
  profile: null,
  token: storedToken,
  isAuthenticated: !!storedToken,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: UserProfile; token: string }>) {
      state.profile = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('sdui-token', action.payload.token);
    },
    clearCredentials(state) {
      state.profile = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('sdui-token');
    },
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setProfile } = userSlice.actions;
export default userSlice.reducer;
