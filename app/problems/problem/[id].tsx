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
import CommentDisplay from '@/components/ui/CommentDisplay';
import ToggleShowCoordinates from '@/components/ToggleShowCoordinates';
import { useDispatch } from 'react-redux';
import { resetShowHint } from '@/store/settingsSlice';
import { TransformProvider } from '@/contexts/TransformContext';
import { TransformationPanel } from '@/components/TransformPanel';

// Route: '/problems/problem/[id]'

export default function ProblemScreen() {
  const { id, count, category } = useLocalSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetShowHint());
  }, [id, , category]);

  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CONTROL_PANEL_HEIGHT = 70;
  const availableHeight =
    windowHeight - insets.top - insets.bottom - CONTROL_PANEL_HEIGHT;

  return (
    <ErrorBoundary>
      <TransformProvider>
        <GameTreeProvider category={category as string} id={id as string}>
          <GameProvider>
            <SafeAreaView style={styles.container}>
              <TransformationPanel />
              <CommentDisplay />
              <View style={[styles.boardContainer]}>
                <GoBoard />
              </View>
              <ControlPanel />
              {/* <ToggleShowCoordinates /> */}
              {/* {__DEV__ && <DebugPanel />} */}
            </SafeAreaView>
          </GameProvider>
        </GameTreeProvider>
      </TransformProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
