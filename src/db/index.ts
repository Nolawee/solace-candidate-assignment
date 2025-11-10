import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    const mockDb: any = {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([]),
        }),
      }),
      insert: () => ({
        values: (_values: any) => ({
          returning: (_columns?: any) => Promise.resolve([]),
        }),
      }),
      execute: (_query: any) => Promise.resolve([]),
      transaction: async (callback: (tx: any) => Promise<any>) => {
        // Pass the same mock object as the transaction context
        return callback(mockDb);
      },
    };
    return mockDb;
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient);
  return db;
};

export default setup();
