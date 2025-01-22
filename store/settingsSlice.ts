import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  darkMode: boolean;
  sfxEnabled: boolean;
  hapticsEnabled: boolean;
  showHint: boolean;
  showCoordinates: boolean;
  randomizeBoard: boolean;
}

const initialState: SettingsState = {
  darkMode: false,
  sfxEnabled: true,
  hapticsEnabled: false,
  showHint: false,
  showCoordinates: true,
  randomizeBoard: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    toggleSfx: (state) => {
      state.sfxEnabled = !state.sfxEnabled;
    },
    toggleHaptics: (state) => {
      state.hapticsEnabled = !state.hapticsEnabled;
    },
    toggleShowHint: (state) => {
      state.showHint = !state.showHint;
    },
    resetShowHint: (state) => {
      state.showHint = false;
    },
    toggleShowCoordinates: (state) => {
      state.showCoordinates = !state.showCoordinates;
    },
    toggleRandomizeBoard: (state) => {
      state.randomizeBoard = !state.randomizeBoard;
    },
    resetSettings: () => initialState
  }
});

export const {
  setDarkMode,
  toggleSfx,
  toggleHaptics,
  toggleShowHint,
  resetShowHint,
  toggleShowCoordinates,
  toggleRandomizeBoard,
  resetSettings
} = settingsSlice.actions;
export default settingsSlice.reducer;
