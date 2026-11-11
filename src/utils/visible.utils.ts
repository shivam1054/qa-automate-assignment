import { Locator } from '@playwright/test';

/**
 * The site renders separate desktop and mobile copies of some widgets.
 * Returns the copy that is visible for the current viewport.
 */
export const firstVisible = (locator: Locator): Locator => locator.filter({ visible: true }).first();
