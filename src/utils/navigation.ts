import { ActiveScreen } from '../types';

export const getPreviousScreen = (screen: ActiveScreen): ActiveScreen => {
  switch (screen) {
    case 'decisions':
      return 'start';
    case 'players':
      return 'decisions';
    case 'game-select':
      return 'players';
    case 'bottle-spin':
    case 'hot-potato':
    case 'tap-race':
      return 'game-select';
    case 'history':
    case 'how-to-play':
      return 'start';
    case 'start':
      return 'start';
  }
};
