import type { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommentThread from '../components/CommentThread';
import HtmlText from '../components/HtmlText';
import { fonts, palette, spacing, stamp } from '../theme';
import { domainOf, timeAgo } from '../utils/format';
import type { RootNavigation, RootStackParamList } from '../navigation/types';

interface Props {
  route: RouteProp<RootStackParamList, 'Thread'>;
  navigation: RootNavigation;
}

export default function ThreadScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { story } = route.params;
  const domain = domainOf(story.url);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.s }]}>
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>THREAD</Text>
        <View style={styles.back} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.storyCard}>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.meta}>
            ▲ {story.score ?? 0} · {story.by} · {timeAgo(story.time)} · ✎{' '}
            {story.descendants ?? 0}
          </Text>
          {story.text ? (
            <View style={styles.selfText}>
              <HtmlText html={story.text} />
            </View>
          ) : null}
          {story.url && (
            <Pressable
              style={styles.openButton}
              onPress={() =>
                navigation.navigate('Reader', {
                  url: story.url!,
                  title: story.title,
                })
              }>
              <Text style={styles.openButtonText}>
                READ ON {domain?.toUpperCase() ?? 'THE WEB'} →
              </Text>
            </Pressable>
          )}
        </View>

        {story.kids?.length ? (
          story.kids.map(id => <CommentThread key={id} id={id} />)
        ) : (
          <Text style={styles.empty}>no comments yet — quiet press day.</Text>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: fonts.black,
    fontSize: 22,
    color: palette.ink,
  },
  headerTitle: {
    fontFamily: fonts.black,
    fontSize: 16,
    letterSpacing: 3,
    color: palette.ink,
  },
  content: {
    paddingHorizontal: spacing.l,
  },
  storyCard: {
    backgroundColor: palette.card,
    borderRadius: 10,
    padding: spacing.l,
    marginBottom: spacing.l,
    ...stamp,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    lineHeight: 24,
    color: palette.ink,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: palette.inkSoft,
    marginTop: spacing.s,
  },
  selfText: {
    marginTop: spacing.m,
  },
  openButton: {
    marginTop: spacing.m,
    backgroundColor: palette.coral,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: palette.line,
    paddingVertical: spacing.s,
    alignItems: 'center',
  },
  openButtonText: {
    fontFamily: fonts.bold,
    fontSize: 12.5,
    letterSpacing: 1,
    color: palette.card,
  },
  empty: {
    fontFamily: fonts.medium,
    color: palette.inkSoft,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
