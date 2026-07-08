import type { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { fonts, palette, spacing } from '../theme';
import { domainOf } from '../utils/format';
import type { RootNavigation, RootStackParamList } from '../navigation/types';

interface Props {
  route: RouteProp<RootStackParamList, 'Reader'>;
  navigation: RootNavigation;
}

export default function ReaderScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { url } = route.params;
  const [progress, setProgress] = useState(0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← close</Text>
        </Pressable>
        <Text numberOfLines={1} style={styles.domain}>
          {domainOf(url) ?? url}
        </Text>
      </View>
      {progress < 1 && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${Math.max(progress, 0.08) * 100}%` }]} />
        </View>
      )}
      <WebView
        source={{ uri: url }}
        onLoadProgress={e => setProgress(e.nativeEvent.progress)}
        style={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    gap: spacing.l,
    borderBottomWidth: 2,
    borderBottomColor: palette.line,
  },
  backText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: palette.coral,
  },
  domain: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: palette.inkSoft,
    textAlign: 'right',
  },
  progressTrack: {
    height: 3,
    backgroundColor: palette.paper,
  },
  progressBar: {
    height: 3,
    backgroundColor: palette.coral,
  },
  web: {
    flex: 1,
  },
});
