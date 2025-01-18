import { Switch } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShowCoordinates } from '@/store/settingsSlice';

const ToggleShowCoordinates = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.settings.showCoordinates);

  const toggleValue = () => {
    dispatch(toggleShowCoordinates());
  };

  return <Switch value={value} onValueChange={toggleValue} />;
};

export default ToggleShowCoordinates;
