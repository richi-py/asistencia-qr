import { Redis } from '@upstash/redis';

export type Student = {
  id: string;
  name: string;
  timestamp: string;
};

export type Session = {
  id: string;
  createdAt: string;
  students: Student[];
};

// --- REDIS SETUP ---
const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const redis = hasRedis 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// --- LOCAL MEMORY FALLBACK ---
const globalForStore = global as unknown as {
  sessionsStore: Map<string, Session>;
};
export const localSessionsStore = globalForStore.sessionsStore || new Map<string, Session>();
if (process.env.NODE_ENV !== 'production') {
  globalForStore.sessionsStore = localSessionsStore;
}

// --- ASYNC FUNCTIONS ---

export const createSession = async (): Promise<Session> => {
  const sessionId = Math.random().toString(36).substring(2, 10);
  const newSession: Session = {
    id: sessionId,
    createdAt: new Date().toISOString(),
    students: [],
  };

  if (redis) {
    // Save to Redis (expires in 24 hours to keep it clean)
    await redis.set(`session:${sessionId}`, newSession, { ex: 86400 });
  } else {
    localSessionsStore.set(sessionId, newSession);
  }

  return newSession;
};

export const getSession = async (sessionId: string): Promise<Session | null> => {
  if (redis) {
    return await redis.get<Session>(`session:${sessionId}`);
  } else {
    return localSessionsStore.get(sessionId) || null;
  }
};

export const addStudentToSession = async (sessionId: string, name: string): Promise<Student> => {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const newStudent: Student = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    timestamp: new Date().toISOString(),
  };

  session.students.push(newStudent);

  if (redis) {
    // Update Redis (keeping the 24h expiration from creation would require checking TTL,
    // but a simple set is fine for this use case, we just re-set it)
    await redis.set(`session:${sessionId}`, session);
  } else {
    localSessionsStore.set(sessionId, session);
  }

  return newStudent;
};

export const getStudentsForSession = async (sessionId: string): Promise<Student[]> => {
  const session = await getSession(sessionId);
  if (!session) return [];
  
  return [...session.students].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
