export const QUICK_NAMES = [
  'Rahul', 'Priya', 'Alex', 'Sam', 'Leo', 'Maya', 'Jordan', 'Elena',
  'Chris', 'Tara', 'Rohan', 'Zack', 'Dev', 'Mira', 'Kai', 'Nia',
];

export const getPlayerMonogram = (name: string): string =>
  name.trim().charAt(0).toUpperCase() || '?';
