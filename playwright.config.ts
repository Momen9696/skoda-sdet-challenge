import { defineConfig, devices, chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { getEnvironmentConfig } from './src/config/environment';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const env = getEnvironmentConfig();

function resolveChromiumExecutablePath(): string | undefined {
  const arm64Path = chromium.executablePath();
  if (fs.existsSync(arm64Path)) return arm64Path;

  // Some environments end up with x64 downloads even on arm64 runners.
  // If the ARM binary is missing, fall back to the x64 one.
  const x64Path = arm64Path.replace('chrome-mac-arm64', 'chrome-mac-x64');
  if (fs.existsSync(x64Path)) return x64Path;

  return undefined;
}

const chromiumExecutablePath = resolveChromiumExecutablePath();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: env.retries,
  workers: env.workers,
  timeout: 90_000,
  expect: { timeout: env.expectTimeout },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    [
      'allure-playwright',
      {
        resultsDir: env.allureResultsDir,
        detail: true,
        suiteTitle: true,
      },
    ],
  ],
  use: {
    baseURL: "https://www.skoda-dily.cz",
    headless: false,                          
    launchOptions: { slowMo: 300 },           
    actionTimeout: env.actionTimeout,
    navigationTimeout: env.navigationTimeout,
    trace: env.trace,
    screenshot: env.screenshot,
    video: env.video,
    locale: 'en-US',
    timezoneId: 'Europe/Prague',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.baseUrl,
        ...(chromiumExecutablePath ? { launchOptions: { executablePath: chromiumExecutablePath } } : {}),
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: env.baseUrl,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: env.baseUrl,
      },
    },
  ]})