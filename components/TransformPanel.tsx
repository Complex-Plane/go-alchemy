import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTransform } from '@/contexts/TransformContext';
import { Button } from 'react-native-paper';

export const TransformationPanel: React.FC = () => {
  const {
    transformation,
    rotate,
    reflect,
    toggleColorInversion,
    randomTransformation
  } = useTransform();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          icon='rotate-left'
          onPress={() => rotate('counterclockwise')}
          mode='contained'
          style={styles.button}
        >
          CCW
        </Button>
        <Button
          icon='rotate-right'
          onPress={() => rotate('clockwise')}
          mode='contained'
          style={styles.button}
        >
          CW
        </Button>
        <Button
          icon='flip-horizontal'
          onPress={() => reflect('horizontal')}
          mode='contained'
          style={styles.button}
        >
          H
        </Button>
        <Button
          icon='flip-vertical'
          onPress={() => reflect('vertical')}
          mode='contained'
          style={styles.button}
        >
          V
        </Button>
        <Button
          icon='axis-z-rotate-clockwise'
          onPress={() => reflect('diagonal')}
          mode='contained'
          style={styles.button}
        >
          D
        </Button>
      </View>
      <View style={styles.row}>
        <Button
          icon='invert-colors'
          onPress={toggleColorInversion}
          mode={transformation.invertColors ? 'contained' : 'outlined'}
          style={styles.button}
        >
          Invert Colors
        </Button>
        <Button
          icon='invert-colors'
          onPress={randomTransformation}
          mode='contained'
          style={styles.button}
        >
          Random
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8
  },
  button: {
    flex: 1
  }
});
