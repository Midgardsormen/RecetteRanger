import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour ajouter le header X-Robots-Tag: noindex, nofollow
 * Complète la meta robots et robots.txt pour une protection anti-indexation maximale
 *
 * Ce header HTTP empêche l'indexation même si les moteurs de recherche
 * ne peuvent pas parser le HTML (ex: si le JS échoue)
 */
@Injectable()
export class RobotsHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Ajouter le header X-Robots-Tag sur toutes les réponses
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    next();
  }
}
