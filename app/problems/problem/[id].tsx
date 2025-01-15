import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from 'react-native-error-boundary';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { ControlPanel } from '@/components/ControlPanel';
import { GoBoard } from '@/components/GoBoard';
import { GameProvider } from '@/contexts/GameContext';
import { useLocalSearchParams } from 'expo-router';
import { GameTreeProvider } from '@/contexts/GameTreeContext';
import { DebugPanel } from '@/components/DebugPanel';

export default function ProblemScreen() {
  const { id, category } = useLocalSearchParams();

  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CONTROL_PANEL_HEIGHT = 70;
  const availableHeight =
    windowHeight - insets.top - insets.bottom - CONTROL_PANEL_HEIGHT;

  const range = { startX: 0, startY: 0, endX: 8, endY: 8 };

  return (
    <ErrorBoundary>
      <GameTreeProvider category={category as string} id={id as string}>
        <GameProvider>
          <SafeAreaView style={styles.container}>
            <View style={[styles.boardContainer, { height: availableHeight }]}>
              <GoBoard size={19} range={range} />
            </View>
            <ControlPanel />
            {__DEV__ && <DebugPanel />}
          </SafeAreaView>
        </GameProvider>
      </GameTreeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6BA7A'
  }
});
