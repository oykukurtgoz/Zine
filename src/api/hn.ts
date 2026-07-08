import axios from 'axios';

/**
 * Official Hacker News API (public, no key, no auth):
 * https://github.com/HackerNews/API
 * Search is powered by the public Algolia HN API:
 * https://hn.algolia.com/api
 */
const hn = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
  timeout: 15000,
});

const algolia = axios.create({
  baseURL: 'https://hn.algolia.com/api/v1',
  timeout: 15000,
});

export type FeedKind = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export interface Item {
  id: number;
  type?: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
  by?: string;
  time?: number;
  text?: string;
  url?: string;
  title?: string;
  score?: number;
  descendants?: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}

const FEED_ENDPOINT: Record<FeedKind, string> = {
  top: '/topstories.json',
  new: '/newstories.json',
  best: '/beststories.json',
  ask: '/askstories.json',
  show: '/showstories.json',
  job: '/jobstories.json',
};

export async function fetchFeedIds(kind: FeedKind): Promise<number[]> {
  const { data } = await hn.get<number[]>(FEED_ENDPOINT[kind]);
  return data ?? [];
}

export async function fetchItem(id: number): Promise<Item | null> {
  const { data } = await hn.get<Item | null>(`/item/${id}.json`);
  return data;
}

export async function fetchItems(ids: number[]): Promise<Item[]> {
  const items = await Promise.all(
    ids.map(id => fetchItem(id).catch(() => null)),
  );
  return items.filter(
    (item): item is Item => !!item && !item.deleted && !item.dead,
  );
}

export interface SearchHit {
  objectID: string;
  title: string;
  url?: string;
  author: string;
  points: number;
  num_comments: number;
  created_at_i: number;
}

export async function searchStories(query: string): Promise<SearchHit[]> {
  const { data } = await algolia.get('/search', {
    params: { query, tags: 'story', hitsPerPage: 30 },
  });
  return (data?.hits ?? []).filter((h: SearchHit) => !!h.title);
}

/** Convert an Algolia search hit into a regular HN item shape. */
export function hitToItem(hit: SearchHit): Item {
  return {
    id: Number(hit.objectID),
    type: 'story',
    title: hit.title,
    url: hit.url,
    by: hit.author,
    score: hit.points,
    descendants: hit.num_comments,
    time: hit.created_at_i,
  };
}
