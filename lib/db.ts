import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

export interface User {
  id: number | string;
  username: string;
  email: string;
  password?: string;
  created_at?: string | Date;
}

// Database Connection
const databaseUrl = process.env.DATABASE_URL;

let pool: Pool | null = null;
if (databaseUrl) {
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false },
  });
}

// Global variable to keep table initialized status
let isTableInitialized = false;

// Fallback Local Storage for zero-config local testing
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

// In-memory fallback cache for serverless environments when no DATABASE_URL is set
let inMemoryUsers: User[] = [];

function ensureLocalFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    // If fs is not writeable (e.g. read-only serverless), in-memory will be used
  }
}

function getLocalUsers(): User[] {
  try {
    ensureLocalFile();
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryUsers = parsed;
        return parsed;
      }
    }
  } catch (err) {
    // fallback to memory
  }
  return inMemoryUsers;
}

function saveLocalUsers(users: User[]) {
  inMemoryUsers = users;
  try {
    ensureLocalFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    // read-only fs fallback
  }
}

/**
 * Initialize Users Table if PostgreSQL is used
 */
export async function initDatabase() {
  if (isTableInitialized) return;

  if (pool) {
    try {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        isTableInitialized = true;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Failed to initialize PostgreSQL table:', err);
    }
  }
}

/**
 * Find user by username
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  await initDatabase();

  if (pool) {
    const res = await pool.query(
      'SELECT id, username, email, password, created_at FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [username.trim()]
    );
    return res.rows[0] || null;
  }

  // Local fallback
  const users = getLocalUsers();
  const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  return found || null;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  await initDatabase();

  if (pool) {
    const res = await pool.query(
      'SELECT id, username, email, password, created_at FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email.trim()]
    );
    return res.rows[0] || null;
  }

  // Local fallback
  const users = getLocalUsers();
  const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  return found || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: number | string): Promise<User | null> {
  await initDatabase();

  if (pool) {
    const res = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    return res.rows[0] || null;
  }

  // Local fallback
  const users = getLocalUsers();
  const found = users.find(u => String(u.id) === String(id));
  if (found) {
    const { password, ...safeUser } = found;
    return safeUser;
  }
  return null;
}

/**
 * Create a new user
 */
export async function createUser(data: { username: string; email: string; passwordHash: string }): Promise<User> {
  await initDatabase();

  if (pool) {
    const res = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [data.username.trim(), data.email.trim().toLowerCase(), data.passwordHash]
    );
    return res.rows[0];
  }

  // Local fallback
  const users = getLocalUsers();
  const newUser: User = {
    id: Date.now(),
    username: data.username.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.passwordHash,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  saveLocalUsers(users);

  const { password, ...safeUser } = newUser;
  return safeUser;
}

/**
 * Get DB Connection Status
 */
export function getDbInfo() {
  let dbType = 'Local Storage (Zero-Config)';
  if (databaseUrl) {
    if (databaseUrl.includes('supabase')) {
      dbType = 'Supabase (PostgreSQL)';
    } else if (databaseUrl.includes('neon')) {
      dbType = 'Neon (PostgreSQL)';
    } else {
      dbType = 'PostgreSQL (Cloud / DATABASE_URL)';
    }
  }

  return {
    type: dbType,
    isConfigured: !!pool,
  };
}
