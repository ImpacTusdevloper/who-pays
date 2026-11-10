// ── PINK CUTE ARCADE THEME ─────────────────────────────────────
// Blush-pink canvases, marshmallow cards, and strawberry-pink accents.

export const THEME = {
  // Backdrops & Canvas
  bg: '#FFF1F4',
  bgAlt: '#FCE8ED',
  bgCard: '#FFFFFF', // Crisp clean marshmallow white!
  bgCardSoft: '#F8F6F7',
  bgCardHover: '#F2EEF1',
  surface: '#F1E9ED',
  surfaceLight: '#F7F2F4',
  border: '#FFCCD5', // Cute candy outline
  borderHighlight: '#FF85A1', // Accent pink border

  // Typography (Dark Chocolate & Plum for maximum readability on white/pink!)
  text: '#2D161F', // Deep rich cocoa text
  textSub: '#7A4D5C', // Soft berry subtext
  textMuted: '#A8808E', // Muted berry
  textDark: '#2D161F',
  textLight: '#FFFFFF',

  // Pinks & Candy Colors
  pink: '#FF4D6D', // Main hot strawberry pink
  pinkShadow: '#C9184A', // 3D bevel shadow
  pinkSoft: '#FF758F',
  pinkSoftShadow: '#D6336C',
  pinkLight: '#FFB3C1',
  pinkPale: '#FFF0F3',
  white: '#FFFFFF',

  // Candy Accent Pops
  yellow: '#FFE3A6',
  yellowShadow: '#E5BF7D',
  mint: '#DDF1E3',
  mintShadow: '#B6D8C1',
  cyan: '#E1EFFA',
  cyanShadow: '#BFD7E8',
  coral: '#FF8A97',
  coralShadow: '#D86B79',
  lime: '#70E000',
  limeShadow: '#4C9A00',

  // Aliases for compatibility
  red: '#FF4D6D',
  orange: '#FFCC8A',
  orangePale: '#FFF2E0',
  cyanPale: '#E8F8FD',
  limePale: '#F0FCE6',
  redPale: '#FFEBF0',
  limeText: '#2D161F',

  // Game States
  loserRed: '#FF4D6D',
  winnerGold: '#FFD166',
};

// Cute, vibrant player colors (all cheerful pastels & candies, no purple!)
export const PLAYER_COLORS = [
  '#F28BA8', // Strawberry milk
  '#D99AC4', // Soft orchid
  '#F6AE8D', // Peach
  '#F3D28A', // Buttercream
  '#90CDB4', // Mint
  '#94CBE1', // Sky
  '#E8A5C3', // Cotton candy
  '#A9C5E8', // Periwinkle
];

export const PLAYER_TITLES = [
  'The Big Spender',
  'Snack Bandit',
  'Lucky Duck',
  'Free Loader',
  'Chaos Gremlin',
  'Always Broke',
  'Speed Demon',
  'VIP',
];

export const getRandomPlayerColor = (index?: number): string => {
  if (typeof index === 'number') return PLAYER_COLORS[index % PLAYER_COLORS.length];
  return PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
};
