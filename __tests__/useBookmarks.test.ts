/**
 * @format
 */

import { useBookmarks } from '../src/store/useBookmarks';
import type { Item } from '../src/api/hn';

const story = (id: number): Item => ({
  id,
  type: 'story',
  title: `Story ${id}`,
});

beforeEach(() => {
  useBookmarks.getState().clear();
});

test('toggle adds a new bookmark to the front of the list', () => {
  const { toggle } = useBookmarks.getState();
  toggle(story(1));
  toggle(story(2));
  expect(useBookmarks.getState().bookmarks.map(b => b.id)).toEqual([2, 1]);
});

test('toggle removes an existing bookmark', () => {
  const { toggle } = useBookmarks.getState();
  toggle(story(1));
  toggle(story(2));
  toggle(story(1));
  expect(useBookmarks.getState().bookmarks.map(b => b.id)).toEqual([2]);
});

test('isBookmarked reflects the current state', () => {
  const { toggle } = useBookmarks.getState();
  expect(useBookmarks.getState().isBookmarked(1)).toBe(false);
  toggle(story(1));
  expect(useBookmarks.getState().isBookmarked(1)).toBe(true);
  toggle(story(1));
  expect(useBookmarks.getState().isBookmarked(1)).toBe(false);
});

test('clear empties the list', () => {
  const { toggle } = useBookmarks.getState();
  toggle(story(1));
  toggle(story(2));
  useBookmarks.getState().clear();
  expect(useBookmarks.getState().bookmarks).toEqual([]);
});
