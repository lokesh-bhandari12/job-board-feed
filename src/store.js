import { configureStore, createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    searchTerm: '',
    selectedCompany: '',
    selectedLocation: '',
    sortBy: 'date',
    bookmarks: [],
    currentPage: 1,
    activeTab: 'all'
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
      state.currentPage = 1;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    toggleBookmark: (state, action) => {
      const jobId = action.payload;
      if (state.bookmarks.includes(jobId)) {
        state.bookmarks = state.bookmarks.filter((id) => id !== jobId);
      } else {
        state.bookmarks.push(jobId);
      }
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.currentPage = 1;
    }
  }
});

export const {
  setSearchTerm,
  setSelectedCompany,
  setSelectedLocation,
  setSortBy,
  toggleBookmark,
  setCurrentPage,
  setActiveTab
} = jobSlice.actions;

export const store = configureStore({
  reducer: {
    jobs: jobSlice.reducer
  }
});