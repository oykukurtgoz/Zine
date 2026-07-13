import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootNavigation } from '../navigation/types';
import { fonts, palette, spacing, stamp } from '../theme';

const CONTACT_EMAIL = 'oykukurtgoz@gmail.com';
const CONTACT_URL = 'https://zine-web-pied.vercel.app/contact';
const PRIVACY_URL = 'https://zine-web-pied.vercel.app/privacy';

function LinkRow({
  glyph,
  label,
  detail,
  accent,
  onPress,
}: {
  glyph: string;
  label: string;
  detail: string;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Text style={[styles.rowGlyph, { color: accent }]}>{glyph}</Text>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <Text style={[styles.rowArrow, { color: accent }]}>→</Text>
    </Pressable>
  );
}

export default function AboutScreen({
  navigation,
}: {
  navigation: RootNavigation;
}) {
  const insets = useSafeAreaInsets();

  const openContactPage = () =>
    navigation.navigate('Reader', { url: CONTACT_URL, title: 'Contact' });

  // Some devices have no mail app (or block the intent) — fall back to the
  // web contact page so the row never dead-ends.
  const openEmail = async () => {
    try {
      await Linking.openURL(`mailto:${CONTACT_EMAIL}`);
    } catch {
      openContactPage();
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.s },
      ]}>
      <Text style={styles.heading}>
        ABOUT<Text style={{ color: palette.teal }}>*</Text>
      </Text>
      <Text style={styles.sub}>the maker behind this zine</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>CONTACT US</Text>
        <Text style={styles.cardBody}>
          questions, bug reports, feedback about zine — reach the developer
          directly:
        </Text>
        <LinkRow
          glyph="✉"
          label="Email"
          detail={CONTACT_EMAIL}
          accent={palette.coral}
          onPress={openEmail}
        />
        <LinkRow
          glyph="☞"
          label="Contact page"
          detail="zine-web-pied.vercel.app/contact"
          accent={palette.teal}
          onPress={openContactPage}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>PRIVACY</Text>
        <Text style={styles.cardBody}>
          no accounts, no tracking, no analytics. clippings live only on this
          device.
        </Text>
        <LinkRow
          glyph="§"
          label="Privacy policy"
          detail="zine-web-pied.vercel.app/privacy"
          accent={palette.mustard}
          onPress={() =>
            navigation.navigate('Reader', {
              url: PRIVACY_URL,
              title: 'Privacy Policy',
            })
          }
        />
      </View>

      <Text style={styles.colophon}>
        ZINE* — a tiny, tracker-free hacker news reader.{'\n'}stories via the
        official HN API, search via Algolia.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.paper,
  },
  content: {
    paddingBottom: spacing.xxl,
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
  card: {
    backgroundColor: palette.card,
    borderRadius: 10,
    padding: spacing.l,
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    ...stamp,
  },
  cardTitle: {
    fontFamily: fonts.black,
    fontSize: 16,
    letterSpacing: 1.5,
    color: palette.ink,
  },
  cardBody: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: palette.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: palette.paper,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    marginTop: spacing.s,
  },
  pressed: {
    transform: [{ translateX: 1 }, { translateY: 1 }],
  },
  rowGlyph: {
    fontSize: 18,
    marginRight: spacing.m,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: palette.ink,
  },
  rowDetail: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: palette.inkSoft,
  },
  rowArrow: {
    fontFamily: fonts.bold,
    fontSize: 16,
    marginLeft: spacing.s,
  },
  colophon: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: palette.inkSoft,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.s,
  },
});
