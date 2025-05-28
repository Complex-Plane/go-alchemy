import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageSourcePropType
} from 'react-native';
import { Text } from '@rneui/themed';
import { Problem } from '@/types/sgf';

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 56) / 4;
// Fallback image in case a problem has no image
const defaultImageSource = require('@/assets/images/placeholder.png');

/**
 * Props for the ProblemCard component.
 */
interface ProblemCardProps {
  /** A single problem item containing its image and ID. */
  problem: Problem;
  /** Callback triggered when the card is pressed. */
  onPress: () => void;
}

/**
 * A reusable card component that displays a problem image and ID.
 *
 * @component
 * @param {ProblemCardProps} props - The props for the ProblemCard component.
 * @returns {JSX.Element} The rendered ProblemCard component.
 *
 * @example
 * <ProblemCard
 *   problem={{ id: 0, image: require('./img.png') }}
 *   onPress={() => console.log('Pressed')}
 * />
 */
export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.imageContainer}>
        <View style={styles.placeholder} />
        <Image
          source={problem.image as ImageSourcePropType}
          style={styles.image}
          resizeMode='cover'
          defaultSource={defaultImageSource}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        # {problem.id + 1}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: itemWidth,
    marginRight: 8
  },
  imageContainer: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E1E1E1'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  name: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center'
  }
});
