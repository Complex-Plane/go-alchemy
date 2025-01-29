import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
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
  const { id, category } = useLocalSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetShowHint());
  }, [id, category]);

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Calculate fixed heights
  const CONTROL_PANEL_HEIGHT = 150;
  const COMMENT_DISPLAY_HEIGHT = 150;

  // Calculate available space for board
  const availableHeight =
    windowHeight -
    insets.top -
    insets.bottom -
    CONTROL_PANEL_HEIGHT -
    COMMENT_DISPLAY_HEIGHT;

  const availableWidth = windowWidth - insets.left - insets.right;

  return (
    <ErrorBoundary>
      <TransformProvider>
        <GameTreeProvider category={category as string} id={id as string}>
          <GameProvider>
            <SafeAreaView style={styles.container}>
              {/* <TransformationPanel /> */}
              <CommentDisplay />
              <View
                style={[
                  styles.boardContainer,
                  { height: availableHeight, width: availableWidth }
                ]}
              >
                <GoBoard
                  availableWidth={availableWidth}
                  availableHeight={availableHeight}
                />
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
    alignItems: 'center',
    backgroundColor: '#778',
    borderColor: 'black',
    borderWidth: 1
  }
});
