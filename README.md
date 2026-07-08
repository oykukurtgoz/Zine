# ZINE*

A tiny, tracker-free Hacker News reader with risograph-print vibes.

- **No accounts.** No login, no signup, nothing to remember.
- **No tracking.** Zero analytics, zero ad SDKs, zero events phoning home.
- **One public API.** The [official Hacker News API](https://github.com/HackerNews/API) for feeds and comments, and the public [Algolia HN Search API](https://hn.algolia.com/api) for digging through the archives. Both are free and keyless.
- **Local-only data.** Clippings (bookmarks) live in AsyncStorage on your device and nowhere else.

## Screens

| Tab | What it does |
| --- | --- |
| **FEED** | Top / New / Best / Ask / Show / Jobs, each with its own spot color |
| **DIG** | Full-text search over the HN archives |
| **CLIPPINGS** | Stories you clipped with the `+` button, saved offline |

Tapping a story opens it in the in-app reader; `✎ n comments` opens the thread with collapsible, color-railed comment threads.

## Running it

```sh
yarn install
cd ios && bundle install && bundle exec pod install && cd ..

yarn start        # metro
yarn ios          # or: yarn android
```

## Stack

React Native 0.85 · TypeScript · React Navigation · Zustand (persisted) · FlashList · axios. Rubik as the house typeface, cream paper + indigo ink + coral as the house palette.
