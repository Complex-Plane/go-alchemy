import { createSlice } from '@reduxjs/toolkit';

/**
 * Settings Slice - User preferences and app configuration state
 *
 * This Redux slice manages all user-configurable settings that affect
 * the app's behavior and appearance. Settings are automatically persisted
 * across app sessions through Redux Persist.
 */

/**
 * SettingsState interface
 *
 * @interface
 * @property {boolean} darkMode - Whether dark theme is enabled
 * @property {boolean} sfxEnabled - Whether sound effects are enabled
 * @property {boolean} hapticsEnabled - Whether haptic feedback is enabled
 * @property {boolean} showHint - Whether to show move hints on the board
 * @property {boolean} showCoordinates - Whether to display board coordinates
 * @property {boolean} randomizeBoard - Whether to randomize board orientation
 */
interface SettingsState {
  darkMode: boolean;
  sfxEnabled: boolean;
  hapticsEnabled: boolean;
  showHint: boolean;
  showCoordinates: boolean;
  randomizeBoard: boolean;
}

/**
 * Initial settings state
 * These are the default values for new installations
 */
const initialState: SettingsState = {
  darkMode: false,
  sfxEnabled: true,
  hapticsEnabled: false,
  showHint: false,
  showCoordinates: true,
  randomizeBoard: false
};

/**
 * Settings slice definition
 *
 * Actions:
 * - setDarkMode: Set dark mode to specific value
 * - toggleSfx: Toggle sound effects on/off
 * - toggleHaptics: Toggle haptic feedback on/off
 * - toggleShowHint: Toggle hint display on/off
 * - resetShowHint: Force hints off (used when changing problems)
 * - toggleShowCoordinates: Toggle coordinate display on/off
 * - toggleRandomizeBoard: Toggle board randomization on/off
 * - resetSettings: Reset all settings to defaults
 */
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
