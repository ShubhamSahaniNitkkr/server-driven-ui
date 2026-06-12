import * as Sentry from '@sentry/react';

let initialized = false;

export function initSentry(): void {
  if (initialized || import.meta.env.DEV) return;

  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
  });

  initialized = true;
}

export function captureException(
  error: Error,
  context?: Record<string, unknown>,
): void {
  if (import.meta.env.DEV) {
    console.error('[Sentry stub]', error, context);
    return;
  }
  Sentry.captureException(error, { extra: context });
}
