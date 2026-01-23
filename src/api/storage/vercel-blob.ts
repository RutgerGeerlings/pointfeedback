import type { StorageAdapter, FeedbackPoint, FeedbackRound } from "../handlers";

// Type definitions for @vercel/blob (to avoid requiring the package at build time)
interface BlobObject {
  pathname: string;
  url: string;
  downloadUrl: string;
}

interface BlobListResult {
  blobs: BlobObject[];
}

interface BlobModule {
  list: () => Promise<BlobListResult>;
  put: (pathname: string, body: string, options: { access: string; contentType: string }) => Promise<BlobObject>;
  del: (url: string) => Promise<void>;
}

/**
 * Vercel Blob storage adapter
 * Stores feedback in Vercel Blob Storage
 *
 * Requires @vercel/blob package:
 * npm install @vercel/blob
 *
 * Usage:
 * ```ts
 * import { createVercelBlobStorage } from "point-feedback/api";
 *
 * const storage = createVercelBlobStorage({
 *   feedbackPrefix: "feedback",
 *   roundsPrefix: "rounds"
 * });
 * ```
 */
export function createVercelBlobStorage(options: {
  feedbackPrefix?: string;
  roundsPrefix?: string;
} = {}): StorageAdapter {
  const feedbackPrefix = options.feedbackPrefix || "point-feedback";
  const roundsPrefix = options.roundsPrefix || "point-feedback-rounds";

  // Dynamic import to avoid issues if @vercel/blob is not installed
  const getBlob = async (): Promise<BlobModule> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const blob = await import("@vercel/blob" as string);
      return blob as unknown as BlobModule;
    } catch {
      throw new Error(
        "[PointFeedback] @vercel/blob is required for Vercel Blob storage. Install it with: npm install @vercel/blob"
      );
    }
  };

  const readFeedback = async (): Promise<FeedbackPoint[]> => {
    const { list } = await getBlob();
    const { blobs } = await list();
    const feedbackBlob = blobs.find((b: BlobObject) => b.pathname.startsWith(feedbackPrefix));

    if (!feedbackBlob) return [];

    try {
      const response = await fetch(feedbackBlob.downloadUrl, { cache: "no-store" });
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  };

  const writeFeedback = async (feedback: FeedbackPoint[]) => {
    const { put, list, del } = await getBlob();

    // Delete existing feedback blobs
    const { blobs } = await list();
    const feedbackBlobs = blobs.filter((b: BlobObject) => b.pathname.startsWith(feedbackPrefix));
    for (const blob of feedbackBlobs) {
      await del(blob.url);
    }

    // Save new blob
    await put(`${feedbackPrefix}-${Date.now()}.json`, JSON.stringify(feedback), {
      access: "public",
      contentType: "application/json",
    });
  };

  const readRounds = async (): Promise<FeedbackRound[]> => {
    const { list } = await getBlob();
    const { blobs } = await list();
    const roundBlobs = blobs.filter((b: BlobObject) => b.pathname.startsWith(roundsPrefix));

    const rounds: FeedbackRound[] = [];

    for (const blob of roundBlobs) {
      try {
        const response = await fetch(blob.downloadUrl, { cache: "no-store" });
        if (response.ok) {
          const round = await response.json();
          rounds.push(round);
        }
      } catch (e) {
        console.error(`[PointFeedback] Failed to fetch round ${blob.pathname}:`, e);
      }
    }

    return rounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    async getFeedback(page?: string) {
      const all = await readFeedback();
      if (page) {
        return all.filter((f) => f.page === page);
      }
      return all;
    },

    async saveFeedback(feedback: FeedbackPoint) {
      const all = await readFeedback();
      all.push(feedback);
      await writeFeedback(all);
      return feedback;
    },

    async deleteFeedback(id: string) {
      const all = await readFeedback();
      const index = all.findIndex((f) => f.id === id);
      if (index === -1) return false;
      all.splice(index, 1);
      await writeFeedback(all);
      return true;
    },

    async updateFeedback(id: string, updates: Partial<FeedbackPoint>) {
      const all = await readFeedback();
      const index = all.findIndex((f) => f.id === id);
      if (index === -1) return null;
      all[index] = { ...all[index], ...updates };
      await writeFeedback(all);
      return all[index];
    },

    async getRounds(page?: string) {
      const rounds = await readRounds();
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

export default createVercelBlobStorage;
