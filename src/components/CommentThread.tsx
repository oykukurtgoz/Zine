import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchItem, Item } from '../api/hn';
import { fonts, palette, spacing } from '../theme';
import { timeAgo } from '../utils/format';
import HtmlText from './HtmlText';

const DEPTH_COLORS = [
  palette.coral,
  palette.teal,
  palette.mustard,
  palette.pink,
  '#5E60CE',
];

const AUTO_EXPAND_DEPTH = 2;

export default function CommentThread({
  id,
  depth = 0,
}: {
  id: number;
  depth?: number;
}) {
  const [comment, setComment] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReplies, setShowReplies] = useState(depth < AUTO_EXPAND_DEPTH);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchItem(id)
      .then(item => alive && setComment(item))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return depth === 0 ? (
      <ActivityIndicator style={styles.loader} color={palette.coral} />
    ) : null;
  }
  if (!comment || comment.deleted || comment.dead || !comment.text) {
    return null;
  }

  const railColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];

  return (
    <View style={[styles.wrap, depth > 0 && [styles.nested, { borderLeftColor: railColor }]]}>
      <Pressable onPress={() => setCollapsed(c => !c)}>
        <Text style={styles.author}>
          <Text style={{ color: railColor }}>◆ </Text>
          {comment.by} · {timeAgo(comment.time)}
          {collapsed ? '  [+]' : ''}
        </Text>
      </Pressable>
      {!collapsed && (
        <>
          <HtmlText html={comment.text} />
          {!!comment.kids?.length &&
            (showReplies ? (
              comment.kids.map(kid => (
                <CommentThread key={kid} id={kid} depth={depth + 1} />
              ))
            ) : (
              <Pressable onPress={() => setShowReplies(true)}>
                <Text style={[styles.more, { color: railColor }]}>
                  ↳ {comment.kids.length}{' '}
                  {comment.kids.length === 1 ? 'reply' : 'replies'}
                </Text>
              </Pressable>
            ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.m,
  },
  nested: {
    borderLeftWidth: 2.5,
    paddingLeft: spacing.m,
  },
  loader: {
    marginVertical: spacing.l,
  },
  author: {
    fontFamily: fonts.semiBold,
    fontSize: 12.5,
    color: palette.inkSoft,
    marginBottom: 4,
  },
  more: {
    fontFamily: fonts.semiBold,
    fontSize: 12.5,
    marginTop: 2,
    marginBottom: spacing.s,
  },
});
