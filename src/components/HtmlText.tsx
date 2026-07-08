import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import { fonts, palette } from '../theme';
import { decodeEntities } from '../utils/format';

/**
 * Minimal renderer for the small HTML subset HN uses in comments and
 * self-posts: <p>, <i>, <a href>, <pre><code>. Anything fancier is rendered
 * as plain text — no heavyweight HTML engine needed.
 */

type Segment =
  | { kind: 'text'; value: string }
  | { kind: 'italic'; value: string }
  | { kind: 'code'; value: string }
  | { kind: 'link'; value: string; href: string };

function parseInline(html: string): Segment[] {
  const segments: Segment[] = [];
  const tokenizer =
    /<i>([\s\S]*?)<\/i>|<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>|<code>([\s\S]*?)<\/code>/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenizer.exec(html)) !== null) {
    if (match.index > cursor) {
      segments.push({ kind: 'text', value: html.slice(cursor, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ kind: 'italic', value: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({
        kind: 'link',
        value: match[3] || match[2],
        href: decodeEntities(match[2]),
      });
    } else if (match[4] !== undefined) {
      segments.push({ kind: 'code', value: match[4] });
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < html.length) {
    segments.push({ kind: 'text', value: html.slice(cursor) });
  }
  return segments;
}

function cleanText(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, ''));
}

export default function HtmlText({ html }: { html: string }) {
  const paragraphs = html
    .replace(/<pre>/g, '<p><pre>')
    .split(/<p>/g)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {parseInline(paragraph).map((segment, i) => {
            switch (segment.kind) {
              case 'italic':
                return (
                  <Text key={i} style={styles.italic}>
                    {cleanText(segment.value)}
                  </Text>
                );
              case 'code':
                return (
                  <Text key={i} style={styles.code}>
                    {cleanText(segment.value)}
                  </Text>
                );
              case 'link':
                return (
                  <Text
                    key={i}
                    style={styles.link}
                    onPress={() => Linking.openURL(segment.href)}>
                    {cleanText(segment.value)}
                  </Text>
                );
              default:
                return <Text key={i}>{cleanText(segment.value)}</Text>;
            }
          })}
        </Text>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: palette.ink,
    marginBottom: 8,
  },
  italic: {
    fontFamily: fonts.regular,
    fontStyle: 'italic',
  },
  code: {
    fontFamily: 'Menlo',
    fontSize: 12.5,
    backgroundColor: '#EFE7D2',
    color: palette.ink,
  },
  link: {
    color: palette.teal,
    textDecorationLine: 'underline',
    fontFamily: fonts.medium,
  },
});
