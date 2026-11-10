import { Decision } from '../types';

export const DEFAULT_DECISIONS: Decision[] = [
  {
    id: 'who-pays',
    title: 'The bill',
    question: 'Who’ll cover the bill tonight?',
    badgeText: 'BILL',
    mode: 'loser_pays',
    loserLabel: 'is picking up the tab.',
    winnerLabel: 'gets dinner covered.',
  },
  {
    id: 'dishes-duty',
    title: 'Dishes',
    question: 'Who’ll take care of the dishes?',
    badgeText: 'CLEANUP',
    mode: 'loser_pays',
    loserLabel: 'is doing the dishes.',
    winnerLabel: 'gets the evening off.',
  },
  {
    id: 'drinks-round',
    title: 'Next round',
    question: 'Who’ll grab the next round?',
    badgeText: 'DRINKS',
    mode: 'loser_pays',
    loserLabel: 'is buying the next round.',
    winnerLabel: 'gets the next round covered.',
  },
];
