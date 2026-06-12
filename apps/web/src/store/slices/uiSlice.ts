import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  open: boolean;
  schemaId?: string;
  title?: string;
}

interface UiState {
  modal: ModalState;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  modal: { open: false },
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<{ schemaId: string; title?: string }>) {
      state.modal = { open: true, ...action.payload };
    },
    closeModal(state) {
      state.modal = { open: false };
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { openModal, closeModal, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
