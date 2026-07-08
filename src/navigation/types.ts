import type { StackNavigationProp } from '@react-navigation/stack';
import type { Item } from '../api/hn';

export type RootStackParamList = {
  Tabs: undefined;
  Thread: { story: Item };
  Reader: { url: string; title?: string };
};

export type RootNavigation = StackNavigationProp<RootStackParamList>;
