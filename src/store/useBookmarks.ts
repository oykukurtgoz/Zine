import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Item } from '../api/hn';

interface BookmarksState {
  bookmarks: Item[];
  isBookmarked: (id: number) => boolean;
  toggle: (item: Item) => void;
  clear: () => void;
}

export const useBookmarks = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      isBookmarked: id => get().bookmarks.some(b => b.id === id),
      toggle: item =>
        set(state => ({
          bookmarks: state.bookmarks.some(b => b.id === item.id)
            ? state.bookmarks.filter(b => b.id !== item.id)
            : [item, ...state.bookmarks],
        })),
      clear: () => set({ bookmarks: [] }),
    }),
    {
      name: 'zine-bookmarks',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
