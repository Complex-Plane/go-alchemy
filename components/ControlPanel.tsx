import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useGameTree } from '@/contexts/GameTreeContext';
import ToggleShowHint from './ToggleShowHint';
import { useRouter } from 'expo-router';

export const ControlPanel: React.FC = () => {
  const { navigate, canNavigate } = useGameTree();
  const router = useRouter();
  // console.log(id, count, category);

  // const handleLeftPress = () => {
  //   if (id > 0) {
  //     router.push({
  //       pathname: '/problems/problem/[id]',
  //       params: { id: parseInt(id) - 1, count, category }
  //     });
  //   }
  // };

  // const handleRightPress = () => {
  //   if (id < count) {
  //     router.push({
  //       pathname: '/problems/problem/[id]',
  //       params: { id: parseInt(id) + 1, count, category }
  //     });
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        {/* <Button
          icon={{ name: 'arrow-left', color: 'white' }}
          onPress={handleLeftPress}
          type='clear'
        /> */}
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
        {/* <Button
          icon={{ name: 'fast-forward', color: 'white' }}
          onPress={navigate.last}
          type='clear'
        /> */}
        {/* <Button
          icon={{ name: 'arrow-right', color: 'white' }}
          onPress={handleRightPress}
          type='clear'
        /> */}
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
    gap: 0
  }
});
