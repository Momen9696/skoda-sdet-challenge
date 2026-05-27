import type { APIRequestContext, APIResponse } from '@playwright/test';
import { getEnvironmentConfig } from '../config/environment';
import { ApiEndpoints, type ApiEndpointKey } from './endpoints';
import { logger } from '../utils/logger';

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  headers?: Record<string, string>;
}

/**
 * Thin API abstraction for hybrid UI + API testing.
 * Not used by current UI scenarios but ready for contract/regression expansion.
 */
export class ApiClient {
  private readonly config = getEnvironmentConfig();

  constructor(private readonly request: APIRequestContext) {}

  async get(
    endpoint: ApiEndpointKey | string,
    options?: ApiRequestOptions,
  ): Promise<APIResponse> {
    const path = this.resolvePath(endpoint);
    logger.debug(`API GET ${path}`, options?.params);
    return this.request.get(path, {
      params: options?.params,
      headers: options?.headers,
      timeout: this.config.apiTimeout,
    });
  }

  async post(
    endpoint: ApiEndpointKey | string,
    options?: ApiRequestOptions,
  ): Promise<APIResponse> {
    const path = this.resolvePath(endpoint);
    logger.debug(`API POST ${path}`);
    return this.request.post(path, {
      data: options?.data,
      params: options?.params,
      headers: options?.headers,
      timeout: this.config.apiTimeout,
    });
  }

  private resolvePath(endpoint: ApiEndpointKey | string): string {
    if (endpoint in ApiEndpoints) {
      return ApiEndpoints[endpoint as ApiEndpointKey];
    }
    return endpoint;
  }
}
