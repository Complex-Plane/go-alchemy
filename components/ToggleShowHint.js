import { Switch } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShowHint } from '@/store/settingsSlice';

const ToggleShowHint = () => {
  const dispatch = useDispatch();
  const showHint = useSelector((state) => state.settings.showHint);

  const toggleHint = () => {
    dispatch(toggleShowHint());
  };

  return <Switch value={showHint} onValueChange={toggleHint} />;
};

export default ToggleShowHint;
