/**
 * Zine design language — risograph print vibes.
 * Cream paper, indigo ink, one loud coral and a couple of spot colors.
 */
export const palette = {
  paper: '#F7F1E3',
  card: '#FFFBF0',
  ink: '#26233A',
  inkSoft: '#6E6A85',
  coral: '#E4572E',
  teal: '#087E8B',
  mustard: '#F2A541',
  pink: '#EF798A',
  line: '#26233A',
};

export const fonts = {
  regular: 'Rubik-Regular',
  medium: 'Rubik-Medium',
  semiBold: 'Rubik-SemiBold',
  bold: 'Rubik-Bold',
  extraBold: 'Rubik-ExtraBold',
  black: 'Rubik-Black',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
};

/** Solid offset shadow — the sticker/print look. */
export const stamp = {
  borderWidth: 2,
  borderColor: palette.line,
  shadowColor: palette.line,
  shadowOffset: { width: 3, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 3,
} as const;

/** Spot color per feed, so each section of the zine feels like its own page. */
export const feedColors: Record<string, string> = {
  top: palette.coral,
  new: palette.teal,
  best: palette.mustard,
  ask: palette.pink,
  show: '#5E60CE',
  job: '#3A7D44',
};
