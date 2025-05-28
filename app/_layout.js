/**
 * Root Layout Component - Main App Navigation
 *
 * This is the root layout component that sets up the entire application structure
 * with tab-based navigation using Expo Router. It configures all the global
 * providers and contexts that the app needs to function properly.
 *
 * @file app/_layout.js
 * @author Go Alchemy Team
 * @version 0.1.2
 */

import { persistor, store } from '@/store/store';
import { Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from '@/components/Loading';
import ThemeWrapper from '@/themes/ThemeWrapper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { ProblemProvider } from '@/contexts/ProblemContext';

/**
 * Root Layout Component
 *
 * Sets up the entire app structure with:
 * - Redux state management with persistence
 * - Theme support (light/dark modes)
 * - Safe area handling for different devices
 * - Problem context for navigation between problems
 * - Tab-based navigation with 5 main sections
 *
 * The component hierarchy ensures that all child components have access
 * to global state, theming, and navigation contexts.
 *
 * @returns {React.Component} Root layout with tab navigation
 */
export default function RootLayout() {
  return (
    // Redux Provider - Provides global state management
    <Provider store={store}>
      {/* PersistGate - Delays rendering until persisted state is restored */}
      <PersistGate loading={<Loading />} persistor={persistor}>
        {/* ThemeWrapper - Provides theme context for light/dark modes */}
        <ThemeWrapper>
          {/* SafeAreaProvider - Handles device safe areas (notches, etc.) */}
          <SafeAreaProvider>
            {/* ProblemProvider - Manages problem navigation state */}
            <ProblemProvider>
              {/* Tab Navigation - Main app navigation structure */}
              <Tabs screenOptions={{ headerShown: false }}>
                {/* Home Tab - Main landing page */}
                <Tabs.Screen
                  name='index'
                  options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='home'
                        color={color}
                      />
                    )
                  }}
                />

                {/* Daily Problems Tab - Curated daily practice problems */}
                <Tabs.Screen
                  name='daily'
                  options={{
                    title: 'Daily Problems',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='calendar'
                        color={color}
                      />
                    )
                  }}
                />

                {/* Problems Tab - Browse all problem categories */}
                <Tabs.Screen
                  name='problems'
                  options={{
                    title: 'Problems',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='puzzle'
                        color={color}
                      />
                    )
                  }}
                />

                {/* Settings Tab - App configuration and preferences */}
                <Tabs.Screen
                  name='settings'
                  options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='cog'
                        color={color}
                      />
                    )
                  }}
                />

                {/* About Tab - App information and credits */}
                <Tabs.Screen
                  name='about'
                  options={{
                    title: 'About',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='information'
                        color={color}
                      />
                    )
                  }}
                />
              </Tabs>
            </ProblemProvider>
          </SafeAreaProvider>
        </ThemeWrapper>
      </PersistGate>
    </Provider>
  );
}

/**
 * Provider Stack Explanation:
 *
 * 1. Provider (Redux): Provides global state management for the entire app
 * 2. PersistGate: Ensures app waits for persisted state to be restored before rendering
 * 3. ThemeWrapper: Provides theme context (light/dark mode) to all components
 * 4. SafeAreaProvider: Handles device-specific safe areas (notches, home indicators)
 * 5. ProblemProvider: Manages problem navigation state and context
 * 6. Tabs: Creates the main tab navigation with 5 primary sections
 *
 * This structure ensures that all components in the app have access to:
 * - Global state via Redux hooks
 * - Theme information for consistent styling
 * - Safe area insets for proper layout
 * - Problem navigation context
 * - Tab navigation capabilities
 */
