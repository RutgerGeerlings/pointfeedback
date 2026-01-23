import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// Types
// ============================================================================

export interface FeedbackPoint {
  id: string;
  x: number;
  y: number;
  comment: string;
  page: string;
  timestamp: string;
  resolved?: boolean;
  resolution?: string;
}

export interface GeneralFeedback {
  id: string;
  comment: string;
  page: string;
  timestamp: string;
  resolved?: boolean;
  resolution?: string;
  author?: string;
}

export interface FeedbackRound {
  id: string;
  name: string;
  date: string;
  status: "active" | "completed" | "archived";
  items: FeedbackPoint[];
}

export interface StorageAdapter {
  getFeedback(page?: string): Promise<FeedbackPoint[]>;
  saveFeedback(feedback: FeedbackPoint): Promise<FeedbackPoint>;
  deleteFeedback(id: string): Promise<boolean>;
  updateFeedback(id: string, updates: Partial<FeedbackPoint>): Promise<FeedbackPoint | null>;
  getRounds(page?: string): Promise<FeedbackRound[]>;
  getGeneralFeedback?(page?: string): Promise<GeneralFeedback[]>;
  saveGeneralFeedback?(feedback: GeneralFeedback): Promise<GeneralFeedback>;
  deleteGeneralFeedback?(id: string): Promise<boolean>;
}

// ============================================================================
// In-Memory Storage (for development/testing)
// ============================================================================

let inMemoryFeedback: FeedbackPoint[] = [];
let inMemoryRounds: FeedbackRound[] = [];
let inMemoryGeneralFeedback: GeneralFeedback[] = [];

export const memoryStorage: StorageAdapter = {
  async getFeedback(page?: string) {
    if (page) {
      return inMemoryFeedback.filter((f) => f.page === page);
    }
    return inMemoryFeedback;
  },

  async saveFeedback(feedback: FeedbackPoint) {
    inMemoryFeedback.push(feedback);
    return feedback;
  },

  async deleteFeedback(id: string) {
    const index = inMemoryFeedback.findIndex((f) => f.id === id);
    if (index === -1) return false;
    inMemoryFeedback.splice(index, 1);
    return true;
  },

  async updateFeedback(id: string, updates: Partial<FeedbackPoint>) {
    const index = inMemoryFeedback.findIndex((f) => f.id === id);
    if (index === -1) return null;
    inMemoryFeedback[index] = { ...inMemoryFeedback[index], ...updates };
    return inMemoryFeedback[index];
  },

  async getRounds(page?: string) {
    if (page) {
      return inMemoryRounds.map((round) => ({
        ...round,
        items: round.items.filter((item) => item.page === page),
      }));
    }
    return inMemoryRounds;
  },

  async getGeneralFeedback(page?: string) {
    if (page) {
      return inMemoryGeneralFeedback.filter((f) => f.page === page);
    }
    return inMemoryGeneralFeedback;
  },

  async saveGeneralFeedback(feedback: GeneralFeedback) {
    inMemoryGeneralFeedback.unshift(feedback);
    return feedback;
  },

  async deleteGeneralFeedback(id: string) {
    const index = inMemoryGeneralFeedback.findIndex((f) => f.id === id);
    if (index === -1) return false;
    inMemoryGeneralFeedback.splice(index, 1);
    return true;
  },
};

// ============================================================================
// API Route Handlers
// ============================================================================

export function createFeedbackHandler(storage: StorageAdapter = memoryStorage) {
  return {
    async GET(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || undefined;

        const feedback = await storage.getFeedback(page);

        return NextResponse.json({
          feedback,
          count: feedback.length,
        });
      } catch (error) {
        console.error("[PointFeedback] GET error:", error);
        return NextResponse.json(
          { error: "Failed to fetch feedback" },
          { status: 500 }
        );
      }
    },

    async POST(request: NextRequest) {
      try {
        const body = await request.json();

        if (!body.page || !body.comment) {
          return NextResponse.json(
            { error: "Missing required fields: page, comment" },
            { status: 400 }
          );
        }

        const feedback: FeedbackPoint = {
          id: body.id || `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          x: body.x || 0,
          y: body.y || 0,
          comment: body.comment,
          page: body.page,
          timestamp: body.timestamp || new Date().toISOString(),
          resolved: body.resolved || false,
          resolution: body.resolution || undefined,
        };

        const saved = await storage.saveFeedback(feedback);

        return NextResponse.json({
          success: true,
          feedback: saved,
        });
      } catch (error) {
        console.error("[PointFeedback] POST error:", error);
        return NextResponse.json(
          { error: "Failed to save feedback" },
          { status: 500 }
        );
      }
    },

    async PUT(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
          return NextResponse.json(
            { error: "Missing id parameter" },
            { status: 400 }
          );
        }

        const updates = await request.json();
        const updated = await storage.updateFeedback(id, updates);

        if (!updated) {
          return NextResponse.json(
            { error: "Feedback not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          feedback: updated,
        });
      } catch (error) {
        console.error("[PointFeedback] PUT error:", error);
        return NextResponse.json(
          { error: "Failed to update feedback" },
          { status: 500 }
        );
      }
    },

    async DELETE(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
          return NextResponse.json(
            { error: "Missing id parameter" },
            { status: 400 }
          );
        }

        const deleted = await storage.deleteFeedback(id);

        if (!deleted) {
          return NextResponse.json(
            { error: "Feedback not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("[PointFeedback] DELETE error:", error);
        return NextResponse.json(
          { error: "Failed to delete feedback" },
          { status: 500 }
        );
      }
    },
  };
}

export function createRoundsHandler(storage: StorageAdapter = memoryStorage) {
  return {
    async GET(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || undefined;

        const rounds = await storage.getRounds(page);

        return NextResponse.json({
          rounds,
          count: rounds.length,
        });
      } catch (error) {
        console.error("[PointFeedback] Rounds GET error:", error);
        return NextResponse.json(
          { error: "Failed to fetch rounds" },
          { status: 500 }
        );
      }
    },
  };
}

export function createGeneralFeedbackHandler(storage: StorageAdapter = memoryStorage) {
  return {
    async GET(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || undefined;

        if (!storage.getGeneralFeedback) {
          return NextResponse.json({ feedback: [], count: 0 });
        }

        const feedback = await storage.getGeneralFeedback(page);

        return NextResponse.json({
          feedback,
          count: feedback.length,
        });
      } catch (error) {
        console.error("[PointFeedback] General feedback GET error:", error);
        return NextResponse.json(
          { error: "Failed to fetch general feedback" },
          { status: 500 }
        );
      }
    },

    async POST(request: NextRequest) {
      try {
        const body = await request.json();

        if (!body.page || !body.comment) {
          return NextResponse.json(
            { error: "Missing required fields: page, comment" },
            { status: 400 }
          );
        }

        if (!storage.saveGeneralFeedback) {
          return NextResponse.json(
            { error: "General feedback storage not configured" },
            { status: 501 }
          );
        }

        const feedback: GeneralFeedback = {
          id: body.id || `gf_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          comment: body.comment,
          page: body.page,
          timestamp: body.timestamp || new Date().toISOString(),
          resolved: body.resolved || false,
          author: body.author || undefined,
        };

        const saved = await storage.saveGeneralFeedback(feedback);

        return NextResponse.json({
          success: true,
          feedback: saved,
        });
      } catch (error) {
        console.error("[PointFeedback] General feedback POST error:", error);
        return NextResponse.json(
          { error: "Failed to save general feedback" },
          { status: 500 }
        );
      }
    },

    async DELETE(request: NextRequest) {
      try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
          return NextResponse.json(
            { error: "Missing id parameter" },
            { status: 400 }
          );
        }

        if (!storage.deleteGeneralFeedback) {
          return NextResponse.json(
            { error: "General feedback storage not configured" },
            { status: 501 }
          );
        }

        const deleted = await storage.deleteGeneralFeedback(id);

        if (!deleted) {
          return NextResponse.json(
            { error: "Feedback not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("[PointFeedback] General feedback DELETE error:", error);
        return NextResponse.json(
          { error: "Failed to delete general feedback" },
          { status: 500 }
        );
      }
    },
  };
}

// ============================================================================
// Pre-configured handlers with memory storage
// ============================================================================

export const feedbackHandler = createFeedbackHandler();
export const roundsHandler = createRoundsHandler();
export const generalFeedbackHandler = createGeneralFeedbackHandler();
