import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import type {RootStackParamList} from './src/types/navigation';
import {colors} from './src/constants/theme';
import {PROFILE} from './src/constants/profile';
import HomeScreen from './src/screens/HomeScreen';
import ShareCardScreen from './src/screens/ShareCardScreen';
import NfcSetupScreen from './src/screens/NfcSetupScreen';
import FollowUpHelperScreen from './src/screens/FollowUpHelperScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.emerald,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {backgroundColor: colors.background},
            headerTintColor: colors.text,
            headerTitleStyle: {fontWeight: '700'},
            headerShadowVisible: false,
            contentStyle: {backgroundColor: colors.background},
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: PROFILE.shortName}}
          />
          <Stack.Screen
            name="ShareCard"
            component={ShareCardScreen}
            options={{title: 'Share My Card'}}
          />
          <Stack.Screen
            name="NfcSetup"
            component={NfcSetupScreen}
            options={{title: 'NFC Setup'}}
          />
          <Stack.Screen
            name="FollowUpHelper"
            component={FollowUpHelperScreen}
            options={{title: 'Follow-up Helper'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
