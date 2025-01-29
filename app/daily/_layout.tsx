import { Stack } from 'expo-router';

export default function DailyLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ title: 'Daily Problems' }} />
      <Stack.Screen
        name='problem/[id]'
        options={{
          title: 'Daily Problem',
          presentation: 'card'
        }}
      />
    </Stack>
  );
}
