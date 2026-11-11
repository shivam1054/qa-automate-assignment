export type LotteryType = 'all' | 'single' | 'series';

export const LOTTERY_TYPE_PARAM: Record<LotteryType, string> = {
  all: 'LOTTERY_TYPE_ALL',
  single: 'LOTTERY_TYPE_SINGLE',
  series: 'LOTTERY_TYPE_SERIES',
};

/** 6-char search pattern; '*' marks an empty digit box (e.g. '****56'). */
export type SearchPattern = string;
