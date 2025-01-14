import { persistor, store } from '@/store/store';
import { Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from '@/components/Loading';
import ThemeWrapper from '@/themes/ThemeWrapper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { copyAssetsToFs } from '@/utils/sgfLoader';

export default function RootLayout() {
  // const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       await copyAssetsToFs();
  //       setIsReady(true);
  //     } catch (error) {
  //       console.error('Error preparing app:', error);
  //     }
  //   }

  //   prepare();
  // }, []);

  // if (!isReady) {
  //   return <Loading />;
  // }

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ThemeWrapper>
          <SafeAreaProvider>
            <Tabs>
              <Tabs.Screen
                name='index'
                options={{
                  title: 'Home',
                  tabBarIcon: ({ color }) => (
                    <Icon type='material-community' name='home' color={color} />
                  )
                }}
              />
              <Tabs.Screen
                name='problems'
                options={{
                  title: 'Problems',
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
                    <Icon type='material-community' name='cog' color={color} />
                  )
                }}
              />
              <Tabs.Screen
                name='about'
                options={{
                  title: 'About',
                  tabBarIcon: ({ color }) => (
                    <Icon type='material-community' name='cog' color={color} />
                  )
                }}
              />
            </Tabs>
          </SafeAreaProvider>
        </ThemeWrapper>
      </PersistGate>
    </Provider>
  );
}
