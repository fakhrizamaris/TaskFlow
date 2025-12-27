// lib/deps.ts
import { db } from './db';
import { auth } from './auth';

export type Dependencies = {
  db: typeof db;
  auth: typeof auth;
};

export const defaultDeps: Dependencies = { db, auth };
