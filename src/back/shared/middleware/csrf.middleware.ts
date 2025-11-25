import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { doubleCsrf } from 'csrf-csrf';

const isProd = process.env.NODE_ENV === 'production';

// Routes qui ne doivent PAS être protégées par CSRF
const CSRF_IGNORED_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/csrf-token', // Permet d'obtenir le token CSRF
  // si tu exposes aussi ces routes sous /api :
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/csrf-token',
]);

const normalizePath = (p: string) => {
  if (!p) return '/';
  const n = p.replace(/\/+$/, ''); // enlève trailing slashes
  return n.length ? n : '/';
};

// Configuration Double Submit Cookie CSRF
const {
  generateCsrfToken,
  validateRequest,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => {
    if (!process.env.CSRF_SECRET) {
      throw new Error('CSRF_SECRET must be set in environment variables');
    }
    return process.env.CSRF_SECRET;
  },

  getSessionIdentifier: (req: Request) =>
    req.cookies?.access_token ?? req.cookies?.refresh_token ?? req.ip ?? 'anon',

  cookieName: 'psifi.x-csrf-token',

  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax', // 'strict' empêcherait l'envoi du cookie lors de navigations externes
    secure: isProd,
    path: '/',
  },

  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],

  getCsrfTokenFromRequest: (req: Request) =>
    req.headers['x-csrf-token'] as string,
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = normalizePath(req.path);

    // ✅ skip CSRF pour login/register
    if (CSRF_IGNORED_PATHS.has(path)) {
      if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
        console.log('[CSRF] Skipped for auth route:', req.method, path);
      }
      return next();
    }

    // Debug
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      console.log('[CSRF] Request:', req.method, path);
      console.log('[CSRF] Token from header:', req.headers['x-csrf-token']);
      console.log('[CSRF] Cookies:', Object.keys(req.cookies || {}));
      console.log('[CSRF] CSRF cookie value:', req.cookies?.['psifi.x-csrf-token'] ? 'present' : 'missing');
    }

    return doubleCsrfProtection(req, res, next);
  }
}

export { generateCsrfToken, validateRequest };
