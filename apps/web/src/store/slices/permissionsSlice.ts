import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PermissionsState {
  permissions: string[];
}

const initialState: PermissionsState = {
  permissions: [],
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload;
    },
  },
});

export const { setPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
