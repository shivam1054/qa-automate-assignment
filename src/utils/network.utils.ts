import { Request } from '@playwright/test';
import { AUTH_URL_API_PATH, LOTTERY_SEARCH_API_PATH } from '../locators';

/** True for GET /api/lotteries?... (not /api/lotteries/home). */
export const isLotterySearchRequest = (request: Request): boolean =>
  request.method() === 'GET' && new URL(request.url()).pathname === LOTTERY_SEARCH_API_PATH;

export const requestParam = (request: Request, name: string): string | null =>
  new URL(request.url()).searchParams.get(name);

/** True for GET /api/auth/get-url (builds the LINE Login redirect). */
export const isAuthUrlRequest = (request: Request): boolean => new URL(request.url()).pathname === AUTH_URL_API_PATH;
