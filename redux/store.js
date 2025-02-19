import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

const tabSlice = createSlice({
  name: 'tabs',
  init: {
    active: "Home"
    tabs: ["Search","Home", "Settings"] //List of default tabs.
  },

  reducers:{
    setActive: (state, action) => {
      state.activeTab = action.payload;
    },

    setTab:  (state, action) => {
      state.tabs = action.payload; //Dynamic tab setting.
    },
  }
});

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    tabs: tabSlice.reducer,
  },
});

export default store;