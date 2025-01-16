import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameTree } from '@/contexts/GameTreeContext';
import { useGame } from '@/contexts/GameContext';

export const DebugPanel = () => {
  const { currentNode } = useGameTree();
  const { currentPlayer } = useGame();

  return __DEV__ ? (
    <View style={styles.debugContainer}>
      <Text style={styles.heading}>
        Debug Info: Current Player: {currentPlayer === 1 ? 'Black' : 'White'}
      </Text>
      <Text>
        Current Node [{currentNode?.id}]: {JSON.stringify(currentNode?.data)}
      </Text>
      <Text>
        Parent Node: [{currentNode?.parentId}], Children Nodes: [
        {JSON.stringify(
          currentNode?.children.map((node: any) => node.id).join(', ')
        )}
        ]
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
