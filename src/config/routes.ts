export const ROUTES = {
  home: '/',
  nokCash: '/nok-cash',
  lottoboard: '/lottoboard',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
