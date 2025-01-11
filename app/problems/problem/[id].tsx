import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from 'react-native-error-boundary';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { ControlPanel } from '@/components/ControlPanel';
import { BoardRenderer } from '@/components/BoardRenderer';
import { GameProvider } from '@/contexts/GameContext';

export default function ProblemScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CONTROL_PANEL_HEIGHT = 70;
  const availableHeight =
    windowHeight - insets.top - insets.bottom - CONTROL_PANEL_HEIGHT;

  const range = { startX: 0, startY: 0, endX: 18, endY: 18 };

  // Placeholder navigation functions
  const handleFirst = () => {
    console.log('First move');
  };
  const handlePrevious = () => {
    console.log('Previous move');
  };
  const handleNext = () => {
    console.log('Next move');
  };
  const handleLast = () => {
    console.log('Last move');
  };

  return (
    <ErrorBoundary>
      <GameProvider>
        <SafeAreaView style={styles.container}>
          <View style={[styles.boardContainer, { height: availableHeight }]}>
            <BoardRenderer size={19} range={range} />
          </View>
          <ControlPanel
            onFirst={handleFirst}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onLast={handleLast}
          />
        </SafeAreaView>
      </GameProvider>
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
