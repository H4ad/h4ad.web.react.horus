// GitHub theme
export type Theme = {
  [key: string]: string;
  background: string;
  text: string;
  grade4: string;
  grade3: string;
  grade2: string;
  grade1: string;
  grade0: string;
};

export const DEFAULT_THEME = {
  background: 'transparent',
  text: '#000',
  grade4: '#00FFFF',
  grade3: '#30a14e',
  grade2: '#40c463',
  grade1: '#ff4141',
  grade0: '#ebedf0',
};

export const NAMESPACE = 'react-github-calendar';

export const LINE_HEIGHT = 1.5;
export const MIN_DISTANCE_MONTH_LABELS = 2;
