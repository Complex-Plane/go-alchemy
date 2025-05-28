/**
 * Home Screen Component - Main Landing Page
 *
 * The home screen serves as the main entry point and welcome page for the
 * Go Alchemy application. It provides app branding, welcome messaging,
 * and quick navigation to the main problem-solving sections.
 *
 * @file app/index.js
 * @author Go Alchemy Team
 * @version 0.1.2
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ThemedScreen from '@/themes/themedComponents/ThemedScreen';
import Footer from '@/components/Footer';
import HomeScreenHeader from '@/components/homeScreen/HomeScreenHeader';
import { Link } from 'expo-router';
import { Button, Text } from '@rneui/themed';
import ErrorBoundary from 'react-native-error-boundary';

/**
 * Home Screen Component
 *
 * Features:
 * - App branding and welcome message
 * - Quick access button to problems section
 * - Responsive design with scrollable content
 * - Error boundary for graceful error handling
 * - Themed components for consistent styling
 *
 * Navigation:
 * - Direct link to '/problems' route for immediate problem access
 * - Tab navigation remains accessible for other sections
 *
 * @returns {React.Component} Home screen with navigation and branding
 */
export default function HomeScreen() {
  return (
    <ErrorBoundary>
      <ThemedScreen>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* App Header - Contains user info and branding elements */}
          <HomeScreenHeader />

          <View style={styles.container}>
            {/* Main App Title */}
            <Text h1 style={{ marginBottom: 20 }}>
              Go Alchemy
            </Text>

            {/* Welcome Message */}
            <Text style={{ marginBottom: 20 }}>
              Welcome to your Go Problems training app!
            </Text>

            {/* Quick Navigation to Problems */}
            <Link href='/problems' asChild>
              <TouchableOpacity
                style={{
                  width: 200,
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: '#007bff',
                  borderRadius: 5
                }}
                accessible={true}
                accessibilityLabel='Navigate to problems section'
                accessibilityHint='Opens the problems browser where you can select categories and individual problems to solve'
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Problems</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Footer Component - App info and additional navigation */}
          <Footer />
        </ScrollView>
      </ThemedScreen>
    </ErrorBoundary>
  );
}

/**
 * Stylesheet for Home Screen
 *
 * Creates a centered, responsive layout that works well on various screen sizes.
 * The container uses flexbox for proper alignment and spacing.
 */
const styles = StyleSheet.create({
  // ScrollView content container for proper padding and flex behavior
  scrollContent: {
    padding: 10,
    flex: 1
  },

  // Main content container with centered alignment
  container: {
    flex: 1,
    padding: 16,
    gap: 16, // Consistent spacing between elements
    justifyContent: 'center', // Center content vertically
    alignItems: 'center' // Center content horizontally
  }
});

/**
 * Component Architecture:
 *
 * 1. ErrorBoundary: Wraps the entire component to catch and handle React errors gracefully
 * 2. ThemedScreen: Provides theme-aware background and basic screen structure
 * 3. ScrollView: Ensures content is scrollable on smaller screens
 * 4. HomeScreenHeader: Displays user information, tokens, and app branding
 * 5. Main Container: Houses the primary welcome content and navigation
 * 6. Footer: Additional app information and secondary navigation links
 *
 * The component uses Expo Router's Link component for type-safe navigation
 * and maintains consistency with the app's overall design system.
 */
