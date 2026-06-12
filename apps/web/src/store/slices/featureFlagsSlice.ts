import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FeatureFlagsState {
  flags: Record<string, boolean>;
}

const initialState: FeatureFlagsState = {
  flags: {},
};

const featureFlagsSlice = createSlice({
  name: 'featureFlags',
  initialState,
  reducers: {
    setFeatureFlags(state, action: PayloadAction<Record<string, boolean>>) {
      state.flags = action.payload;
    },
  },
});

export const { setFeatureFlags } = featureFlagsSlice.actions;
export default featureFlagsSlice.reducer;
