import fs from "fs";
import path from "path";
import type { StorageAdapter, FeedbackPoint, FeedbackRound } from "../handlers";

/**
 * File-based storage adapter
 * Stores feedback in JSON files on the local filesystem
 *
 * WARNING: This storage adapter does NOT work on serverless platforms like Vercel,
 * Netlify, or AWS Lambda. The filesystem is read-only and ephemeral in these environments.
 * For production deployments on Vercel, use createVercelBlobStorage instead.
 *
 * Best for:
 * - Local development
 * - Self-hosted servers with persistent filesystem
 * - Docker containers with mounted volumes
 *
 * Usage:
 * ```ts
 * import { createFileStorage } from "pointfeedback/api";
 *
 * const storage = createFileStorage({
 *   feedbackDir: "./data/feedback",
 *   roundsDir: "./data/rounds"
 * });
 * ```
 */
export function createFileStorage(options: {
  feedbackDir?: string;
  roundsDir?: string;
} = {}): StorageAdapter {
  const feedbackDir = options.feedbackDir || path.join(process.cwd(), "feedback-data");
  const roundsDir = options.roundsDir || path.join(process.cwd(), "feedback-rounds");
  const feedbackFile = path.join(feedbackDir, "feedback.json");

  // Ensure directories exist
  const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

  const readFeedback = (): FeedbackPoint[] => {
    ensureDir(feedbackDir);
    if (!fs.existsSync(feedbackFile)) return [];
    try {
      const content = fs.readFileSync(feedbackFile, "utf-8");
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const writeFeedback = (feedback: FeedbackPoint[]) => {
    ensureDir(feedbackDir);
    fs.writeFileSync(feedbackFile, JSON.stringify(feedback, null, 2));
  };

  const readRounds = (): FeedbackRound[] => {
    ensureDir(roundsDir);
    if (!fs.existsSync(roundsDir)) return [];

    const files = fs.readdirSync(roundsDir).filter((f) => f.endsWith(".json"));
    const rounds: FeedbackRound[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(roundsDir, file), "utf-8");
        rounds.push(JSON.parse(content));
      } catch (e) {
        console.error(`[PointFeedback] Failed to parse ${file}:`, e);
      }
    }

    return rounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    async getFeedback(page?: string) {
      const all = readFeedback();
      if (page) {
        return all.filter((f) => f.page === page);
      }
      return all;
    },

    async saveFeedback(feedback: FeedbackPoint) {
      const all = readFeedback();
      all.push(feedback);
      writeFeedback(all);
      return feedback;
    },

    async deleteFeedback(id: string) {
      const all = readFeedback();
      const index = all.findIndex((f) => f.id === id);
      if (index === -1) return false;
      all.splice(index, 1);
      writeFeedback(all);
      return true;
    },

    async updateFeedback(id: string, updates: Partial<FeedbackPoint>) {
      const all = readFeedback();
      const index = all.findIndex((f) => f.id === id);
      if (index === -1) return null;
      all[index] = { ...all[index], ...updates };
      writeFeedback(all);
      return all[index];
    },

    async getRounds(page?: string) {
      const rounds = readRounds();
      if (page) {
        return rounds.map((round) => ({
          ...round,
          items: round.items.filter((item) => item.page === page),
        }));
      }
      return rounds;
    },
  };
}

export default createFileStorage;
