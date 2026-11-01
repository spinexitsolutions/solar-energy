import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { seed } from "./seed";
import type { Content, DB } from "./types";

/**
 * Tiny JSON-file database. Perfect for a demo / small business site.
 * Swap these functions for Postgres, MongoDB, Supabase etc. when scaling —
 * every page and server action goes through getDB() / updateDB().
 */
const FILE = path.join(process.cwd(), "data", "db.json");

const g = globalThis as unknown as { __lumoraDB?: DB; __lumoraLock?: Promise<unknown> };

function withDefaults(data: Partial<DB>): DB {
  const merged = { ...structuredClone(seed), ...data } as DB;
  // shallow-merge object sections so new fields added to the seed show up
  for (const key of ["settings", "intro", "hero", "statement", "about", "calculator", "sections"] as const) {
    merged[key] = { ...seed[key], ...(data[key] ?? {}) } as never;
  }
  return merged;
}

export async function getDB(): Promise<DB> {
  if (g.__lumoraDB) return g.__lumoraDB;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    g.__lumoraDB = withDefaults(JSON.parse(raw));
  } catch {
    g.__lumoraDB = structuredClone(seed);
    await persist(g.__lumoraDB);
  }
  return g.__lumoraDB;
}

async function persist(db: DB) {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    // read-only filesystems (e.g. serverless) — keep working in memory
    console.warn("[db] could not persist, running in-memory:", (err as Error).message);
  }
}

/** Serialised read-modify-write so concurrent writes never clobber each other. */
export async function updateDB(mutator: (db: DB) => void | Promise<void>): Promise<DB> {
  const run = async () => {
    const db = await getDB();
    await mutator(db);
    await persist(db);
    return db;
  };
  const next = (g.__lumoraLock ?? Promise.resolve()).then(run, run);
  g.__lumoraLock = next.catch(() => undefined);
  return next;
}

export async function getContent(): Promise<Content> {
  const { posts: _p, leads: _l, ...content } = await getDB();
  return content;
}

export async function resetDB() {
  g.__lumoraDB = structuredClone(seed);
  await persist(g.__lumoraDB);
}

export const uid = (prefix = "") =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
