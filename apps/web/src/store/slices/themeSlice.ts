import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
  brandName: string;
  brandLogo?: string;
}

const initialState: ThemeState = {
  mode: (localStorage.getItem('sdui-theme') as 'light' | 'dark') ?? 'light',
  primaryColor: 'blue',
  brandName: 'SDUI Platform',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
      state.mode = action.payload;
      localStorage.setItem('sdui-theme', action.payload);
    },
    toggleThemeMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('sdui-theme', state.mode);
    },
    setThemeConfig(state, action: PayloadAction<Partial<ThemeState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setThemeMode, toggleThemeMode, setThemeConfig } = themeSlice.actions;
export default themeSlice.reducer;
