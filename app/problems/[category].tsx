import React from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SGF_FILES } from '@/constants/sgfFiles';

export default function ProblemList() {
  const router = useRouter();
  const { category } = useLocalSearchParams();

  // Get problems for the current category
  const problems = category ? SGF_FILES[category as string]?.problems : [];
  console.log(category);
  console.log(problems);
  return (
    <View>
      <FlatList
        data={problems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            onPress={() =>
              router.push({
                pathname: '/problems/problem/[id]',
                params: { id: item.id, category }
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
    </View>
  );
}
