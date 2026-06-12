import type { Request, Response, NextFunction } from 'express';
import type { ProblemDetails } from '@sdui/shared';

export class AppError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail: string,
    public type = 'about:blank',
  ) {
    super(detail);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const problem: ProblemDetails = {
      type: err.type,
      title: err.title,
      status: err.status,
      detail: err.detail,
    };
    res.status(err.status).json(problem);
    return;
  }

  console.error('Unhandled error:', err);
  const problem: ProblemDetails = {
    type: 'about:blank',
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred',
  };
  res.status(500).json(problem);
}
