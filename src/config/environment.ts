import type { TraceMode, ScreenshotMode, VideoMode } from '@playwright/test';

export type TestEnvironment = 'local' | 'ci' | 'staging';

export interface EnvironmentConfig {
  name: TestEnvironment;
  baseUrl: string;
  apiBaseUrl: string;
  apiTimeout: number;
  workers: number;
  retries: number;
  actionTimeout: number;
  navigationTimeout: number;
  expectTimeout: number;
  trace: TraceMode;
  screenshot: ScreenshotMode;
  video: VideoMode;
  allureResultsDir: string;
  isCI: boolean;
}

function parseIntEnv(key: string, fallback: number): number {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function resolveTrace(): TraceMode {
  const trace = process.env.TRACE ?? (process.env.CI ? 'on-first-retry' : 'off');
  return trace as TraceMode;
}

function resolveScreenshot(): ScreenshotMode {
  const screenshot = process.env.SCREENSHOT ?? 'only-on-failure';
  return screenshot as ScreenshotMode;
}

function resolveVideo(): VideoMode {
  const video = process.env.VIDEO ?? 'retain-on-failure';
  return video as VideoMode;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const isCI = !!process.env.CI;
  const name = (process.env.TEST_ENV as TestEnvironment) ?? (isCI ? 'ci' : 'local');

  const defaultsByEnv: Record<TestEnvironment, Partial<EnvironmentConfig>> = {
    local: { workers: 4, retries: 0 },
    ci: { workers: 2, retries: 2 },
    staging: { workers: 2, retries: 1 },
  };

  const envDefaults = defaultsByEnv[name] ?? defaultsByEnv.local;

  return {
    name,
    baseUrl: process.env.BASE_URL ?? 'https://www.skoda-dily.cz',
    apiBaseUrl:
      process.env.API_BASE_URL ?? process.env.BASE_URL ?? 'https://www.skoda-dily.cz',
    apiTimeout: parseIntEnv('API_TIMEOUT', 30_000),
    workers: parseIntEnv('WORKERS', envDefaults.workers ?? 4),
    retries: parseIntEnv('RETRIES', envDefaults.retries ?? 0),
    actionTimeout: parseIntEnv('ACTION_TIMEOUT', 15_000),
    navigationTimeout: parseIntEnv('NAVIGATION_TIMEOUT', 45_000),
    expectTimeout: parseIntEnv('EXPECT_TIMEOUT', 10_000),
    trace: resolveTrace(),
    screenshot: resolveScreenshot(),
    video: resolveVideo(),
    allureResultsDir: process.env.ALLURE_RESULTS_DIR ?? 'allure-results',
    isCI,
  };
}

export function getBrowserProjectsFilter(): string[] | undefined {
  const browser = process.env.BROWSER;
  if (!browser || browser === 'all') return undefined;
  return [browser];
}
