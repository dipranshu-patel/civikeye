import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  pageTitle: 'Dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
    },
  },
});

export const { toggleSidebar, setPageTitle } = uiSlice.actions;
export default uiSlice.reducer;
