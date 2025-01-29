import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SGF_FILES } from '@/assets/problems';
import { Problem } from '@/types/sgf';
import { useProblemContext } from '@/contexts/ProblemContext';
import { ProblemCard } from '@/components/ProblemCard';

// Route: '/problems/[category]'

const windowWidth = Dimensions.get('window').width;
// const itemPadding = 8;
// const itemsPerRow = 4;
// const itemWidth =
//   (windowWidth - itemPadding * 2 * (itemsPerRow - 1)) / itemsPerRow;
const itemWidth = (windowWidth - 56) / 4; // 56 = padding (16) * 2 + gap between items (8) * 3

export default function ProblemList() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { setProblemContext } = useProblemContext();

  const problems = category ? SGF_FILES[category as string]?.problems : [];

  useEffect(() => {
    if (problems.length > 0) {
      setProblemContext(
        problems.map((p) => p.id),
        category as string
      );
      setIsLoading(false);
    }
  }, [problems, category]);

  const renderItem = useCallback(
    ({ item }: { item: Problem }) => {
      const handlePress = () => {
        router.push({
          pathname: '/problems/problem/[id]',
          params: { id: item.id, category }
        });
      };

      return <ProblemCard problem={item} onPress={handlePress} />;
    },
    [router]
  );

  const keyExtractor = useCallback((item: Problem) => item.id.toString(), []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemWidth + styles.row.marginBottom,
      offset: (itemWidth + styles.row.marginBottom) * Math.floor(index / 4),
      index
    }),
    []
  );

  if (isLoading) {
    return <ActivityIndicator size='large' />;
  }

  return (
    <FlatList
      data={problems}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={4}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.row}
      initialNumToRender={16}
      maxToRenderPerBatch={16}
      windowSize={5}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16
  },
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
