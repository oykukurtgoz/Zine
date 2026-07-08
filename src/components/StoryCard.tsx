import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Item } from '../api/hn';
import { useBookmarks } from '../store/useBookmarks';
import { fonts, palette, spacing, stamp } from '../theme';
import { domainOf, timeAgo } from '../utils/format';

interface Props {
  story: Item;
  index?: number;
  accent: string;
  onPress: () => void;
  onPressComments: () => void;
}

export default function StoryCard({
  story,
  index,
  accent,
  onPress,
  onPressComments,
}: Props) {
  const isBookmarked = useBookmarks(s => s.isBookmarked(story.id));
  const toggle = useBookmarks(s => s.toggle);
  const domain = domainOf(story.url);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.topRow}>
        {index !== undefined && (
          <Text style={[styles.index, { color: accent }]}>
            {String(index + 1).padStart(2, '0')}
          </Text>
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{story.title}</Text>
          {domain && (
            <View style={[styles.domainPill, { backgroundColor: accent }]}>
              <Text style={styles.domainText}>{domain}</Text>
            </View>
          )}
        </View>
        <Pressable
          hitSlop={10}
          onPress={() => toggle(story)}
          style={[styles.pin, isBookmarked && { backgroundColor: palette.mustard }]}>
          <Text style={styles.pinText}>{isBookmarked ? '✂' : '+'}</Text>
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          ▲ {story.score ?? 0} · {story.by} · {timeAgo(story.time)}
        </Text>
        <Pressable hitSlop={8} onPress={onPressComments}>
          <Text style={[styles.comments, { color: accent }]}>
            ✎ {story.descendants ?? 0} comments
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: 10,
    padding: spacing.l,
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    ...stamp,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  index: {
    fontFamily: fonts.black,
    fontSize: 22,
    marginRight: spacing.m,
    marginTop: -2,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15.5,
    lineHeight: 21,
    color: palette.ink,
  },
  domainPill: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: palette.line,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: 6,
  },
  domainText: {
    fontFamily: fonts.semiBold,
    fontSize: 10.5,
    color: palette.card,
  },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.s,
    backgroundColor: palette.paper,
  },
  pinText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: palette.ink,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.m,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: palette.inkSoft,
  },
  comments: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
});
