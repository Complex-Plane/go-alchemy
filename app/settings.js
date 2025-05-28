import React, { useState, useEffect } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Switch, ListItem, Button } from '@rneui/themed';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotifications } from '@/services/NotificationService';
import ToggleTheme from '@/components/ToggleTheme';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetSettings,
  toggleSfx,
  toggleHaptics,
  toggleShowCoordinates,
  toggleRandomizeBoard
} from '@/store/settingsSlice';
import ThemedScreen from '@/themes/themedComponents/ThemedScreen';
import ToggleShowCoordinates from '@/components/ToggleShowCoordinates';

/**
 * SettingsScreen - User preferences and app configuration
 *
 * This screen provides controls for customizing the app experience:
 *
 * Features:
 * - **Notifications**: Enable/disable daily problem reminders
 * - **Theme**: Toggle between dark and light modes
 * - **Sound Effects**: Enable/disable stone placement sounds
 * - **Haptics**: Enable/disable vibration feedback
 * - **Board Coordinates**: Show/hide coordinate labels (A-S, 1-19)
 * - **Board Randomization**: Randomize problem orientation for pattern training
 * - **Reset**: Restore all settings to defaults
 *
 * Settings are persisted using:
 * - Redux store with persistence for most settings
 * - AsyncStorage for notification preferences
 *
 * @component
 * @returns {JSX.Element} The settings screen
 */
const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const dispatch = useDispatch();

  // Get current settings from Redux store
  const sfxEnabled = useSelector((state) => state.settings?.sfxEnabled ?? true);
  const hapticsEnabled = useSelector(
    (state) => state.settings?.hapticsEnabled ?? true
  );
  const randomizeBoard = useSelector(
    (state) => state.settings?.randomizeBoard ?? true
  );
  const showCoordinates = useSelector(
    (state) => state.settings.showCoordinates
  );

  // Load notification settings on mount
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  /**
   * Load notification preference from local storage
   */
  const loadNotificationSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      setNotificationsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  /**
   * Handle notification toggle
   *
   * When enabling:
   * 1. Request permission from the OS
   * 2. Schedule daily notifications
   *
   * When disabling:
   * 1. Cancel all scheduled notifications
   *
   * @param {boolean} value - New notification state
   */
  const handleToggleNotifications = async (value) => {
    try {
      if (value) {
        // Request notification permissions
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please enable notifications in your device settings to receive reminders.'
          );
          return;
        }
      }

      // Save preference
      await AsyncStorage.setItem('notificationsEnabled', value.toString());
      setNotificationsEnabled(value);

      // Schedule or cancel notifications
      if (value) {
        scheduleNotifications();
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  return (
    <ThemedScreen>
      <ScrollView>
        {/* Notifications Setting */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Notifications</ListItem.Title>
            <ListItem.Subtitle>Receive notifications</ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
          />
        </ListItem>

        {/* Theme Toggle */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Dark Mode</ListItem.Title>
          </ListItem.Content>
          <ToggleTheme />
        </ListItem>

        {/* Sound Effects */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Sound Effects</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={sfxEnabled}
            onValueChange={() => dispatch(toggleSfx())}
          />
        </ListItem>

        {/* Haptic Feedback */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Vibration</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={hapticsEnabled}
            onValueChange={() => dispatch(toggleHaptics())}
          />
        </ListItem>

        {/* Board Coordinates */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Show Board Coordinates</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={showCoordinates}
            onValueChange={() => dispatch(toggleShowCoordinates())}
          />
        </ListItem>

        {/* Board Randomization */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Randomize Board</ListItem.Title>
          </ListItem.Content>
          <Switch
            value={randomizeBoard}
            onValueChange={() => dispatch(toggleRandomizeBoard())}
          />
        </ListItem>

        {/* Reset Settings */}
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>Reset settings to default</ListItem.Title>
          </ListItem.Content>
          <Button title='Reset' onPress={() => dispatch(resetSettings())} />
        </ListItem>
      </ScrollView>
    </ThemedScreen>
  );
};

export default SettingsScreen;
