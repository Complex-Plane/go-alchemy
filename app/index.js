import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ThemedScreen from '@/themes/themedComponents/ThemedScreen';
import Footer from '@/components/Footer';
import HomeScreenHeader from '@/components/homeScreen/HomeScreenHeader';
import { Link } from 'expo-router';
import { Button, Text } from '@rneui/themed';
import ErrorBoundary from 'react-native-error-boundary';

export default function HomeScreen() {
  return (
    <ErrorBoundary>
      <ThemedScreen>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* App Header */}
          <HomeScreenHeader />
          <View style={styles.container}>
            <Text h1 style={{ marginBottom: 20 }}>
              Go Alchemy
            </Text>
            <Text style={{ marginBottom: 20 }}>
              Welcome to your Go Problems training app!
            </Text>
            <Link href='/problems' asChild>
              <TouchableOpacity
                style={{
                  width: 200,
                  alignItems: 'center',
                  padding: 10,
                  backgroundColor: '#007bff',
                  borderRadius: 5
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16 }}>Problems</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <Footer />
        </ScrollView>
      </ThemedScreen>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 10,
    flex: 1
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
