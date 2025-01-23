import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Text } from '@rneui/themed';
import { useRouter } from 'expo-router';

const categories = [
  {
    key: 'tsumego',
    title: 'Tsumego',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#FF6B6B'
  },
  {
    key: 'tesuji',
    title: 'Tesuji',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#4ECDC4'
  },
  {
    key: 'shape',
    title: 'Shape',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#45B7D1'
  },
  {
    key: 'opening',
    title: 'Opening',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#FFBE0B'
  },
  {
    key: 'sabaki',
    title: 'Sabaki',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#9B5DE5'
  },
  {
    key: 'joseki',
    title: 'Joseki',
    src: require(`../../assets/images/tesuji_thumbnail.jpg`),
    tint: '#00F5D4'
  }
];

const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 48) / 2; // 48 = padding (16) * 2 + gap between items (16)

export default function Problems() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push(`/problems/${item.key}`)}
    >
      <View style={[styles.imageContainer, { backgroundColor: item.tint }]}>
        <Image source={item.src} style={styles.image} resizeMode='cover' />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  listContainer: {
    padding: 16
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16
  },
  itemContainer: {
    width: itemWidth
  },
  imageContainer: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)' // Optional overlay for better text visibility
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  }
});
