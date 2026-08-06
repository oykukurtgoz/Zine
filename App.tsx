/**
 * Zine — a tiny, tracker-free Hacker News reader.
 * No accounts, no analytics, no SDKs phoning home. Just stories.
 */

import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { palette } from './src/theme';
import CodePush from '@appcircle/react-native-code-push';

const codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_START,
    installMode: CodePush.InstallMode.IMMEDIATE,
    updateDialog: {
      title: 'Güncelleme Mevcut',
      optionalUpdateMessage: 'Yeni bir güncelleme var. Almak ister misin?',
      optionalInstallButtonLabel: 'Evet',
      optionalIgnoreButtonLabel: 'Daha sonra',
      mandatoryUpdateMessage: 'Devam etmek için güncelleme gerekli.',
      mandatoryContinueButtonLabel: 'Güncelle',
    },
  };

function App() {

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={palette.paper} />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.paper,
  },
});

export default CodePush(codePushOptions)(App);
