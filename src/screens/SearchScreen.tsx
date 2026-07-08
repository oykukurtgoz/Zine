import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hitToItem, Item, searchStories } from '../api/hn';
import StoryCard from '../components/StoryCard';
import { fonts, palette, spacing, stamp } from '../theme';
import type { RootNavigation } from '../navigation/types';

export default function SearchScreen({
  navigation,
}: {
  navigation: RootNavigation;
}) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const hits = await searchStories(text.trim());
      setResults(hits.map(hitToItem));
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const onChange = (text: string) => {
    setQuery(text);
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    debounce.current = setTimeout(() => runSearch(text), 450);
  };

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
        DIG<Text style={{ color: palette.teal }}>*</Text>
      </Text>
      <View style={styles.inputWrap}>
        <Text style={styles.inputIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={onChange}
          placeholder="search the archives…"
          placeholderTextColor={palette.inkSoft}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => runSearch(query)}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={palette.teal} size="large" />
      ) : (
        <FlashList
          data={results}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <StoryCard
              story={item}
              accent={palette.teal}
              onPress={() => openStory(item)}
              onPressComments={() => navigation.navigate('Thread', { story: item })}
            />
          )}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            searched ? (
              <Text style={styles.empty}>nothing in the stacks for that.</Text>
            ) : (
              <Text style={styles.empty}>
                type something — 4 decades of nerd history await.
              </Text>
            )
          }
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
  heading: {
    fontFamily: fonts.black,
    fontSize: 34,
    letterSpacing: 2,
    color: palette.ink,
    paddingHorizontal: spacing.l,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 10,
    marginHorizontal: spacing.l,
    marginVertical: spacing.l,
    paddingHorizontal: spacing.m,
    ...stamp,
  },
  inputIcon: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: palette.teal,
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: palette.ink,
    paddingVertical: 12,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  empty: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: palette.inkSoft,
    textAlign: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
});
