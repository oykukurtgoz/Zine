import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import AboutScreen from '../screens/AboutScreen';
import FeedScreen from '../screens/FeedScreen';
import ReaderScreen from '../screens/ReaderScreen';
import SavedScreen from '../screens/SavedScreen';
import SearchScreen from '../screens/SearchScreen';
import ThreadScreen from '../screens/ThreadScreen';
import { fonts, palette } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.paper,
    card: palette.paper,
    text: palette.ink,
    primary: palette.coral,
    border: palette.line,
  },
};

function TabIcon({ glyph, focused }: { glyph: string; focused: boolean }) {
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {glyph}
    </Text>
  );
}

const feedIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon glyph="▣" focused={focused} />
);
const searchIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon glyph="⌕" focused={focused} />
);
const savedIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon glyph="✂" focused={focused} />
);
const aboutIcon = ({ focused }: { focused: boolean }) => (
  <TabIcon glyph="✉" focused={focused} />
);

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: palette.coral,
        tabBarInactiveTintColor: palette.inkSoft,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'FEED',
          tabBarIcon: feedIcon,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'DIG',
          tabBarIcon: searchIcon,
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'CLIPPINGS',
          tabBarIcon: savedIcon,
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: 'ABOUT',
          tabBarIcon: aboutIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Thread" component={ThreadScreen} />
        <Stack.Screen name="Reader" component={ReaderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: palette.card,
    borderTopWidth: 2,
    borderTopColor: palette.line,
  },
  tabLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1,
  },
  tabIcon: {
    fontSize: 18,
    color: palette.inkSoft,
  },
  tabIconFocused: {
    color: palette.coral,
  },
});
