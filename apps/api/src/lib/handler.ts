import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function syncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => void,
): RequestHandler {
  return (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
