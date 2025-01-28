import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { capitalizeWord } from '@/utils/capitalizeWord';
import { Header } from '@rneui/themed';

export default function ProblemsLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Problem Categories' }} />
      {/* <Stack.Screen name='daily' options={{ title: 'Daily Problems' }} /> */}
      <Stack.Screen
        name='[category]'
        options={({ route }) => ({
          title: `${capitalizeWord(route.params.category)} Problems`
        })}
      />
      <Stack.Screen
        name='problem/[id]'
        options={({ route }) => ({
          title: `${capitalizeWord(route.params.category)} # ${
            parseInt(route.params.id) + 1
          }`
        })}
        // options={({ route }) => ({
        //   header: () => {
        //     const router = useRouter();
        //     return (
        //       <Header
        //         leftComponent={{
        //           icon: 'arrow-back',
        //           color: '#fff',
        //           onPress: () => router.back()
        //         }}
        //         centerComponent={{
        //           text: `${capitalizeWord(route.params.category)}`,
        //           style: { color: '#fff', fontSize: 20 }
        //         }}
        //         rightComponent={{ icon: 'menu', color: '#fff' }}
        //       />
        //     );
        //   }
        // })}
      />
    </Stack>
  );
}
