import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useGameTree } from '@/contexts/GameTreeContext';
import ToggleShowHint from './ToggleShowHint';
import { useRouter } from 'expo-router';
import { useProblemContext } from '@/contexts/ProblemContext';

export const ControlPanel: React.FC = () => {
  const { navigate, canNavigate } = useGameTree();
  const router = useRouter();
  const { problemIds, category, currentProblemIndex, setCurrentProblemIndex } =
    useProblemContext();

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
        <Button
          icon={{ name: 'skip-previous', color: 'white' }}
          onPress={handlePreviousProblem}
          disabled={currentProblemIndex === 0}
          type='clear'
        />
        <View style={styles.centerButtons}>
          <Button
            icon={{ name: 'fast-rewind', color: 'white' }}
            onPress={navigate.first}
            type='clear'
          />
          <Button
            icon={{ name: 'chevron-left', color: 'white' }}
            onPress={navigate.backward}
            disabled={!canNavigate?.backward}
            type='clear'
          />
          <Button
            icon={{ name: 'chevron-right', color: 'white' }}
            onPress={navigate.forward}
            disabled={!canNavigate?.forward}
            type='clear'
          />
          <ToggleShowHint />
        </View>
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
    backgroundColor: '#2c3e50',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#34495e'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  centerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  problemNavButton: {
    width: 40
  }
});
