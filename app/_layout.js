import { persistor, store } from '@/store/store';
import { Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from '@/components/Loading';
import ThemeWrapper from '@/themes/ThemeWrapper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { ProblemProvider } from '@/contexts/ProblemContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ThemeWrapper>
          <SafeAreaProvider>
            <ProblemProvider>
              <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen
                  name='index'
                  options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='home'
                        color={color}
                      />
                    )
                  }}
                />
                <Tabs.Screen
                  name='daily'
                  options={{
                    title: 'Daily Problems',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='calendar'
                        color={color}
                      />
                    )
                  }}
                />
                <Tabs.Screen
                  name='problems'
                  options={{
                    title: 'Problems',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='puzzle'
                        color={color}
                      />
                    )
                  }}
                />
                <Tabs.Screen
                  name='settings'
                  options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='cog'
                        color={color}
                      />
                    )
                  }}
                />
                <Tabs.Screen
                  name='about'
                  options={{
                    title: 'About',
                    tabBarIcon: ({ color }) => (
                      <Icon
                        type='material-community'
                        name='information'
                        color={color}
                      />
                    )
                  }}
                />
              </Tabs>
            </ProblemProvider>
          </SafeAreaProvider>
        </ThemeWrapper>
      </PersistGate>
    </Provider>
  );
}
