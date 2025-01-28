import { useGameTree } from '@/contexts/GameTreeContext';
import { makeStyles, Text } from '@rneui/themed';
import { View } from 'react-native';

const CommentDisplay = () => {
  const { currentComment } = useGameTree();
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {currentComment && <Text style={styles.comment}>{currentComment}</Text>}
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    height: 120,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  comment: {
    fontSize: 20,
    color: 'black'
  }
}));

export default CommentDisplay;
