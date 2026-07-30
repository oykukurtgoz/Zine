/**
 * @format
 */

jest.mock('axios', () => {
  const get = jest.fn();
  return {
    __esModule: true,
    default: { create: jest.fn(() => ({ get })) },
  };
});

import axios from 'axios';
import {
  fetchFeedIds,
  fetchItems,
  hitToItem,
  searchStories,
  type Item,
  type SearchHit,
} from '../src/api/hn';

// Both axios instances in hn.ts share the same mocked `get` from the factory.
const mockGet = (axios.create() as unknown as { get: jest.Mock }).get;

beforeEach(() => {
  mockGet.mockReset();
});

describe('fetchFeedIds', () => {
  test('returns the id list from the feed endpoint', async () => {
    mockGet.mockResolvedValueOnce({ data: [1, 2, 3] });
    await expect(fetchFeedIds('top')).resolves.toEqual([1, 2, 3]);
    expect(mockGet).toHaveBeenCalledWith('/topstories.json');
  });

  test('falls back to an empty list when the API returns null', async () => {
    mockGet.mockResolvedValueOnce({ data: null });
    await expect(fetchFeedIds('best')).resolves.toEqual([]);
  });
});

describe('fetchItems', () => {
  const items: Record<number, Item | null> = {
    1: { id: 1, type: 'story', title: 'Alive' },
    2: { id: 2, type: 'story', title: 'Deleted', deleted: true },
    3: { id: 3, type: 'story', title: 'Dead', dead: true },
    4: null,
  };

  test('drops deleted, dead and missing items', async () => {
    mockGet.mockImplementation((url: string) => {
      const id = Number(url.match(/\/item\/(\d+)\.json/)?.[1]);
      return Promise.resolve({ data: items[id] ?? null });
    });
    const result = await fetchItems([1, 2, 3, 4]);
    expect(result).toEqual([{ id: 1, type: 'story', title: 'Alive' }]);
  });

  test('tolerates individual request failures', async () => {
    mockGet
      .mockResolvedValueOnce({ data: items[1] })
      .mockRejectedValueOnce(new Error('network down'));
    await expect(fetchItems([1, 2])).resolves.toEqual([items[1]]);
  });
});

describe('searchStories', () => {
  test('filters hits without a title', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        hits: [
          { objectID: '10', title: 'Has title', author: 'a' },
          { objectID: '11', title: '', author: 'b' },
        ],
      },
    });
    const hits = await searchStories('zine');
    expect(hits).toHaveLength(1);
    expect(hits[0].objectID).toBe('10');
    expect(mockGet).toHaveBeenCalledWith('/search', {
      params: { query: 'zine', tags: 'story', hitsPerPage: 30 },
    });
  });
});

describe('hitToItem', () => {
  test('maps an Algolia hit to the HN item shape', () => {
    const hit: SearchHit = {
      objectID: '42',
      title: 'Show HN: Zine',
      url: 'https://example.com',
      author: 'oyku',
      points: 128,
      num_comments: 37,
      created_at_i: 1700000000,
    };
    expect(hitToItem(hit)).toEqual({
      id: 42,
      type: 'story',
      title: 'Show HN: Zine',
      url: 'https://example.com',
      by: 'oyku',
      score: 128,
      descendants: 37,
      time: 1700000000,
    });
  });
});
