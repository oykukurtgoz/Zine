import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Item } from '../api/hn';
import StoryCard from '../components/StoryCard';
import { useBookmarks } from '../store/useBookmarks';
import { fonts, palette, spacing } from '../theme';
import type { RootNavigation } from '../navigation/types';

export default function SavedScreen({
  navigation,
}: {
  navigation: RootNavigation;
}) {
  const insets = useSafeAreaInsets();
  const bookmarks = useBookmarks(s => s.bookmarks);

  const openStory = (story: Item) => {
    if (story.url) {
      navigation.navigate('Reader', { url: story.url, title: story.title });
    } else {
      navigation.navigate('Thread', { story });
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.s }]}>
      <Text style={styles.heading}>
        CLIPPINGS<Text style={{ color: palette.mustard }}>*</Text>
      </Text>
      <Text style={styles.sub}>
        {bookmarks.length
          ? `${bookmarks.length} scrap${bookmarks.length > 1 ? 's' : ''} taped into your zine`
          : ' '}
      </Text>
      <FlashList
        data={bookmarks}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <StoryCard
            story={item}
            accent={palette.mustard}
            onPress={() => openStory(item)}
            onPressComments={() => navigation.navigate('Thread', { story: item })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyGlyph}>✂</Text>
            <Text style={styles.empty}>
              nothing clipped yet.{'\n'}hit the + on any story to save it here —
              works offline, lives only on this device.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  heading: {
    fontFamily: fonts.black,
    fontSize: 34,
    letterSpacing: 2,
    color: palette.ink,
    paddingHorizontal: spacing.l,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: palette.inkSoft,
    paddingHorizontal: spacing.l,
    marginTop: -2,
    marginBottom: spacing.l,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    gap: spacing.m,
  },
  emptyGlyph: {
    fontSize: 40,
    color: palette.mustard,
  },
  empty: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    color: palette.inkSoft,
    textAlign: 'center',
  },
});
