import jwt from 'jsonwebtoken';

// Use env secret or fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'dynamics-global-secret-key-2026';

export interface TokenPayload {
  id: string;
  role: 'admin' | 'client';
  username?: string;
  email?: string;
  name?: string;
  company?: string;
}

/**
 * Generate a signed JWT token (expires in 24 hours)
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verify and decode a JWT token — returns payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
