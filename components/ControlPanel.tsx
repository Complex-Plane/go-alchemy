import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useGameTree } from '@/contexts/GameTreeContext';
import ToggleShowHint from './ToggleShowHint';
import { useLocalSearchParams, useRouter } from 'expo-router';

export const ControlPanel: React.FC = () => {
  const { navigate, canNavigate } = useGameTree();
  const router = useRouter();
  const { id, count, category } = useLocalSearchParams();

  const currentId = parseInt(id as string);
  const totalProblems = parseInt(count as string);

  const handlePreviousProblem = () => {
    if (currentId > 0) {
      router.push({
        pathname: '/problems/problem/[id]',
        params: {
          id: currentId - 1,
          count: totalProblems,
          category
        }
      });
    }
  };

  const handleNextProblem = () => {
    if (currentId < totalProblems - 1) {
      router.push({
        pathname: '/problems/problem/[id]',
        params: {
          id: currentId + 1,
          count: totalProblems,
          category
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        <Button
          icon={{ name: 'skip-previous', color: 'white' }}
          onPress={handlePreviousProblem}
          disabled={currentId === 0}
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
          disabled={currentId === totalProblems - 1}
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
