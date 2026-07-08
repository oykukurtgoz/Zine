import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedKind, fetchFeedIds, fetchItems, Item } from '../api/hn';
import StoryCard from '../components/StoryCard';
import { feedColors, fonts, palette, spacing, stamp } from '../theme';
import type { RootNavigation } from '../navigation/types';

const PAGE_SIZE = 20;

const FEEDS: { kind: FeedKind; label: string }[] = [
  { kind: 'top', label: 'TOP' },
  { kind: 'new', label: 'NEW' },
  { kind: 'best', label: 'BEST' },
  { kind: 'ask', label: 'ASK' },
  { kind: 'show', label: 'SHOW' },
  { kind: 'job', label: 'JOBS' },
];

export default function FeedScreen({
  navigation,
}: {
  navigation: RootNavigation;
}) {
  const insets = useSafeAreaInsets();
  const [feed, setFeed] = useState<FeedKind>('top');
  const [ids, setIds] = useState<number[]>([]);
  const [stories, setStories] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const accent = feedColors[feed];

  const load = useCallback(async (kind: FeedKind) => {
    setError(false);
    try {
      const allIds = await fetchFeedIds(kind);
      const firstPage = await fetchItems(allIds.slice(0, PAGE_SIZE));
      setIds(allIds);
      setStories(firstPage);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setStories([]);
    load(feed).finally(() => setLoading(false));
  }, [feed, load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(feed);
    setRefreshing(false);
  }, [feed, load]);

  const onEndReached = useCallback(async () => {
    if (loading || refreshing || stories.length >= ids.length) {
      return;
    }
    const next = await fetchItems(
      ids.slice(stories.length, stories.length + PAGE_SIZE),
    );
    setStories(prev => [...prev, ...next]);
  }, [ids, stories.length, loading, refreshing]);

  const openStory = useCallback(
    (story: Item) => {
      if (story.url) {
        navigation.navigate('Reader', { url: story.url, title: story.title });
      } else {
        navigation.navigate('Thread', { story });
      }
    },
    [navigation],
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.s }]}>
      <View style={styles.masthead}>
        <Text style={styles.logo}>
          ZINE<Text style={{ color: accent }}>*</Text>
        </Text>
        <Text style={styles.tagline}>a tiny hacker news reader</Text>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {FEEDS.map(({ kind, label }) => {
            const active = kind === feed;
            return (
              <Pressable
                key={kind}
                onPress={() => setFeed(kind)}
                style={[
                  styles.chip,
                  active && { backgroundColor: feedColors[kind] },
                ]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>the presses are jammed.</Text>
          <Pressable style={styles.retry} onPress={() => load(feed)}>
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </Pressable>
        </View>
      ) : (
        <FlashList
          data={stories}
          keyExtractor={item => String(item.id)}
          renderItem={({ item, index }) => (
            <StoryCard
              story={item}
              index={index}
              accent={accent}
              onPress={() => openStory(item)}
              onPressComments={() => navigation.navigate('Thread', { story: item })}
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.6}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  masthead: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  logo: {
    fontFamily: fonts.black,
    fontSize: 34,
    letterSpacing: 2,
    color: palette.ink,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: palette.inkSoft,
    marginTop: -4,
  },
  chips: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.l,
    gap: spacing.s,
  },
  chip: {
    borderRadius: 8,
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    backgroundColor: palette.card,
    ...stamp,
    shadowOffset: { width: 2, height: 2 },
  },
  chipText: {
    fontFamily: fonts.bold,
    fontSize: 12.5,
    letterSpacing: 1,
    color: palette.ink,
  },
  chipTextActive: {
    color: palette.card,
  },
  list: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.l,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: palette.inkSoft,
  },
  retry: {
    backgroundColor: palette.coral,
    borderRadius: 8,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.s,
    ...stamp,
  },
  retryText: {
    fontFamily: fonts.bold,
    color: palette.card,
    letterSpacing: 1,
  },
});
