import { HttpException } from '@nestjs/common';

/**
 * Utility pour logger les erreurs de manière sécurisée
 * - En dev : stack trace complète pour faciliter le debug
 * - En prod : message uniquement pour éviter d'exposer des secrets
 * - Préserve les HttpException NestJS pour les status codes corrects
 */

/**
 * Normalise une erreur inconnue en instance d'Error
 * Compatible avec useUnknownInCatchVariables: true
 */
export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

/**
 * Logge une erreur avec le contexte approprié selon l'environnement
 * @param context - Contexte de l'erreur (ex: "Error creating recipe")
 * @param error - L'erreur à logger (peut être unknown)
 */
export function logError(context: string, error: unknown): void {
  const err = toError(error);

  if (process.env.NODE_ENV !== 'production') {
    console.error(`${context}:`, err);
  } else {
    console.error(`${context}: ${err.message}`);
  }
}

/**
 * Logge une erreur et la relance EN PRÉSERVANT son type original
 * IMPORTANT : Préserve les HttpException pour que NestJS renvoie les bons status codes
 * @param context - Contexte de l'erreur
 * @param error - L'erreur à logger et relancer
 * @throws L'erreur originale (HttpException, Error) ou normalisée
 */
export function logAndThrow(context: string, error: unknown): never {
  // 1) Logger l'erreur
  logError(context, error);

  // 2) Re-throw l'original si c'est une HttpException (préserve status code + payload)
  if (error instanceof HttpException) {
    throw error;
  }

  // 3) Re-throw l'original si c'est une Error (préserve stack trace)
  if (error instanceof Error) {
    throw error;
  }

  // 4) Sinon throw la version normalisée
  throw toError(error);
}
