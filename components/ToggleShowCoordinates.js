import { makeStyles, Switch, Text } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShowCoordinates } from '@/store/settingsSlice';
import { View } from 'react-native';

const ToggleShowCoordinates = () => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const value = useSelector((state) => state.settings.showCoordinates);

  const toggleValue = () => {
    dispatch(toggleShowCoordinates());
  };

  return (
    <View style={styles.container}>
      <Text>Show Coordinates</Text>
      <Switch value={value} onValueChange={toggleValue} />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row'
  }
}));

export default ToggleShowCoordinates;
