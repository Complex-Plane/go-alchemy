import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameTree } from '@/contexts/GameTreeContext';
import { useGame } from '@/contexts/GameContext';

export const DebugPanel = () => {
  const { gameTree, currentNode } = useGameTree();
  const { board, currentPlayer } = useGame();

  return __DEV__ ? (
    <View style={styles.debugContainer}>
      <Text style={styles.heading}>Debug Info</Text>
      <Text>GameTree: {gameTree ? 'Loaded' : 'Not Loaded'}</Text>
      <Text>Current Node ID: {currentNode?.id}</Text>
      <Text>Current Player: {currentPlayer === 1 ? 'Black' : 'White'}</Text>
      <Text>
        Board: {board ? `${board.width}x${board.height}` : 'Not Loaded'}
      </Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  debugContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 5
  }
});
