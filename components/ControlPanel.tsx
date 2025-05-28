import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useGameTree } from '@/contexts/GameTreeContext';
import ToggleShowHint from './ToggleShowHint';
import { useRouter } from 'expo-router';
import { useProblemContext } from '@/contexts/ProblemContext';

/**
 * ControlPanel - Navigation and control interface for Go problems
 *
 * This component provides controls for:
 * - Problem navigation (previous/next problem)
 * - Move navigation within a problem (forward/backward)
 * - Quick jumps (first/last position)
 * - Hint toggle functionality
 *
 * The panel adapts based on:
 * - Available problems in the current set
 * - Current position in the game tree
 * - Navigation possibilities (can go forward/backward)
 *
 * Layout:
 * [Prev Problem] [First] [Back] [Forward] [Last] [Hint] [Next Problem]
 *
 * @component
 * @returns {JSX.Element} The control panel component
 */
export const ControlPanel: React.FC = () => {
  const { navigate, canNavigate } = useGameTree();
  const router = useRouter();
  const { problemIds, category, currentProblemIndex, setCurrentProblemIndex } =
    useProblemContext();

  /**
   * Navigate to the previous problem in the set
   * Updates the problem index and routes to the new problem
   */
  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      const newIndex = currentProblemIndex - 1;
      setCurrentProblemIndex(newIndex);
      router.push({
        pathname: category ? '/problems/problem/[id]' : '/daily/problem/[id]',
        params: { id: problemIds[newIndex], category }
      });
    }
  };

  /**
   * Navigate to the next problem in the set
   * Updates the problem index and routes to the new problem
   */
  const handleNextProblem = () => {
    if (currentProblemIndex < problemIds.length - 1) {
      const newIndex = currentProblemIndex + 1;
      setCurrentProblemIndex(newIndex);
      router.push({
        pathname: category ? '/problems/problem/[id]' : '/daily/problem/[id]',
        params: { id: problemIds[newIndex] }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        {/* Previous Problem Button */}
        <Button
          icon={{ name: 'skip-previous', color: 'white' }}
          onPress={handlePreviousProblem}
          disabled={currentProblemIndex === 0}
          type='clear'
        />

        {/* Game Tree Navigation Controls */}
        <View style={styles.centerButtons}>
          {/* Jump to Start */}
          <Button
            icon={{ name: 'fast-rewind', color: 'white' }}
            onPress={navigate.first}
            type='clear'
          />

          {/* Move Backward */}
          <Button
            icon={{ name: 'arrow-back', color: 'white' }}
            onPress={navigate.backward}
            disabled={!canNavigate.backward}
            type='clear'
          />

          {/* Move Forward */}
          <Button
            icon={{ name: 'arrow-forward', color: 'white' }}
            onPress={navigate.forward}
            disabled={!canNavigate.forward}
            type='clear'
          />

          {/* Jump to End */}
          <Button
            icon={{ name: 'fast-forward', color: 'white' }}
            onPress={navigate.last}
            disabled={!canNavigate.forward}
            type='clear'
          />
        </View>

        {/* Hint Toggle */}
        <ToggleShowHint />

        {/* Next Problem Button */}
        <Button
          icon={{ name: 'skip-next', color: 'white' }}
          onPress={handleNextProblem}
          disabled={currentProblemIndex === problemIds.length - 1}
          type='clear'
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  centerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  }
});
