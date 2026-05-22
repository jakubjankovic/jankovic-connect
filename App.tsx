import React from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import type {RootStackParamList} from './src/types/navigation';
import {colors} from './src/constants/theme';
import {PROFILE} from './src/constants/profile';
import HomeScreen from './src/screens/HomeScreen';
import NfcSetupScreen from './src/screens/NfcSetupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.gold,
  },
};

function NfcGlyph() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 7c2.4 2.6 2.4 7.4 0 10"
        stroke={colors.gold}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M11.6 4.6c4.3 4.6 4.3 10.2 0 14.8"
        stroke={colors.gold}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M15.2 2.4c6 6.4 6 12.8 0 19.2"
        stroke={colors.champagne}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

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
            options={({navigation}) => ({
              title: PROFILE.shortName,
              headerRight: () => (
                <Pressable
                  hitSlop={10}
                  style={styles.headerRight}
                  onPress={() => navigation.navigate('NfcSetup')}>
                  <NfcGlyph />
                  <Text style={styles.headerBtn}>NFC</Text>
                </Pressable>
              ),
            })}
          />
          <Stack.Screen
            name="NfcSetup"
            component={NfcSetupScreen}
            options={{title: 'NFC'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 4,
  },
  headerBtn: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '700',
  },
});
