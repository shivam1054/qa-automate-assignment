import { Page } from '@playwright/test';

export const getQueryParam = (page: Page, name: string): string | null => new URL(page.url()).searchParams.get(name);

export const getHostname = (page: Page): string => new URL(page.url()).hostname;
