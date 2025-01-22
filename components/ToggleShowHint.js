import { Button, Icon, makeStyles } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShowHint } from '@/store/settingsSlice';

const ToggleShowHint = () => {
  const dispatch = useDispatch();
  const styles = useStyles();
  const showHint = useSelector((state) => state.settings.showHint);

  const toggleHint = () => {
    dispatch(toggleShowHint());
  };

  return (
    <Button
      onPress={toggleHint}
      raised={!showHint}
      buttonStyle={[
        styles.button,
        showHint ? styles.buttonPressed : styles.buttonDefault
      ]}
      icon={
        <Icon
          name='question'
          type='font-awesome'
          color={showHint ? 'white' : 'black'}
          size={20}
        />
      }
    />
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 10,
    padding: 10
  },
  buttonDefault: {
    backgroundColor: 'rgba(40, 40, 200, 0.5)'
  },
  buttonPressed: {
    backgroundColor: 'rgba(40, 40, 200, 0.5)'
  }
}));

export default ToggleShowHint;
