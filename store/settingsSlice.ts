import { createSlice } from '@reduxjs/toolkit';

interface SettingsState {
  darkMode: boolean;
  sfxEnabled: boolean;
  hapticsEnabled: boolean;
  showHint: boolean;
  showCoordinates: boolean;
}

const initialState: SettingsState = {
  darkMode: false,
  sfxEnabled: true,
  hapticsEnabled: false,
  showHint: false,
  showCoordinates: true
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
    toggleShowCoordinates: (state) => {
      state.showCoordinates = !state.showCoordinates;
    },
    resetSettings: () => initialState
  }
});

export const {
  setDarkMode,
  toggleSfx,
  toggleHaptics,
  toggleShowHint,
  toggleShowCoordinates,
  resetSettings
} = settingsSlice.actions;
export default settingsSlice.reducer;
