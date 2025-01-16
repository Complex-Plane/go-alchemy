import { useGame } from '@/contexts/GameContext';
import { Slider, Switch, Text } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

const GameSettings: React.FC = () => {
  const {
    autoPlayOpponent,
    setAutoPlayOpponent,
    autoPlayDelay,
    setAutoPlayDelay
  } = useGame();

  return (
    <View style={styles.container}>
      <View style={styles.setting}>
        <Text>Auto-play opponent moves</Text>
        <Switch value={autoPlayOpponent} onValueChange={setAutoPlayOpponent} />
      </View>
      {autoPlayOpponent && (
        <View style={styles.setting}>
          <Text>Delay (ms)</Text>
          <Slider
            value={autoPlayDelay}
            onValueChange={setAutoPlayDelay}
            minimumValue={0}
            maximumValue={2000}
            step={100}
          />
          <Text>{autoPlayDelay}ms</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  }
});

export default GameSettings;
