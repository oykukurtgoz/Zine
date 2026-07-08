/**
 * @format
 */

import { domainOf, timeAgo, decodeEntities } from '../src/utils/format';

test('domainOf extracts the host', () => {
  expect(domainOf('https://www.example.com/a/b')).toBe('example.com');
  expect(domainOf(undefined)).toBeNull();
});

test('decodeEntities handles the HN entity set', () => {
  expect(decodeEntities('a &amp; b &#x27;c&#x27; &lt;d&gt;')).toBe(
    "a & b 'c' <d>",
  );
});

test('timeAgo formats durations', () => {
  const now = Math.floor(Date.now() / 1000);
  expect(timeAgo(now - 30)).toBe('just now');
  expect(timeAgo(now - 120)).toBe('2m ago');
  expect(timeAgo(now - 7200)).toBe('2h ago');
});
