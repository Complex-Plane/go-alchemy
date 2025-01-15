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
import { useGameTree } from '@/hooks/useGameTree';
import { loadSgfFromAssets } from '@/utils/sgfLoader';
import { Text } from '@rneui/themed';
import { useLocalSearchParams } from 'expo-router';

export default function ProblemScreen() {
  const { id, category } = useLocalSearchParams();

  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CONTROL_PANEL_HEIGHT = 70;
  const availableHeight =
    windowHeight - insets.top - insets.bottom - CONTROL_PANEL_HEIGHT;

  const range = { startX: 0, startY: 0, endX: 18, endY: 18 };

  const { gameTree, currentNode, load, navigate, canNavigate } = useGameTree();

  useEffect(() => {
    async function loadProblem() {
      try {
        if (category && id) {
          const sgfContent = await loadSgfFromAssets(
            category as string,
            parseInt(id as string)
          );
          load(sgfContent);
        }
      } catch (error) {
        console.error('Error loading problem:', error);
      }
    }

    loadProblem();
  }, [category, id]);

  return (
    <ErrorBoundary>
      <GameProvider>
        <SafeAreaView style={styles.container}>
          <View style={[styles.boardContainer, { height: availableHeight }]}>
            <GoBoard size={19} range={range} />
          </View>
          <Text>{JSON.stringify(gameTree)}</Text>
          <Text>{JSON.stringify(currentNode)}</Text>
          <ControlPanel
            onFirst={navigate.first}
            onPrevious={navigate.backward}
            onNext={navigate.forward}
            onLast={navigate.last}
            canNavigate={canNavigate}
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
