import { supabase } from "@/lib/supabase/client";
import type { TablesInsert } from "@/lib/supabase/types";
import type { StudySession } from "../types/analytics.types";

type SessionInsert = TablesInsert<"study_sessions">;

// Response type
type SessionServiceResponse<T> = {
  data: T | null;
  error: string | null;
};

/**
 * Error handler for database operations
 */
function handleDatabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
}

/**
 * Create a new study session
 */
export async function createStudySession(sessionData: {
  subjectId: string;
  sessionDate: string; // YYYY-MM-DD format
  durationMinutes: number;
  topicsCovered?: string[];
  materialsUsed?: string[];
  mood?: "confident" | "okay" | "struggling" | "confused";
  notes?: string;
}): Promise<SessionServiceResponse<StudySession>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to create a study session",
      };
    }

    // Verify subject exists and belongs to user
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .select("id, user_id")
      .eq("id", sessionData.subjectId)
      .single();

    if (subjectError || !subject) {
      return {
        data: null,
        error: "Subject not found",
      };
    }

    if (subject.user_id !== user.id) {
      return {
        data: null,
        error: "You don't have permission to create a session for this subject",
      };
    }

    // Create the session
    const insertData: SessionInsert = {
      user_id: user.id,
      subject_id: sessionData.subjectId,
      session_date: sessionData.sessionDate,
      duration_minutes: sessionData.durationMinutes,
      topics_covered: sessionData.topicsCovered ?? null,
      materials_used: sessionData.materialsUsed ?? null,
      mood: sessionData.mood ?? null,
      notes: sessionData.notes ?? null,
    };

    const { data, error } = await supabase
      .from("study_sessions")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudySession,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get all study sessions for a subject
 */
export async function getStudySessionsBySubject(
  subjectId: string,
  limit?: number
): Promise<SessionServiceResponse<StudySession[]>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to view study sessions",
      };
    }

    // Fetch sessions
    let query = supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .order("session_date", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudySession[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get recent study sessions across all subjects for the current user
 * @param days - Number of days to look back (default: 30)
 */
export async function getRecentStudySessions(
  days: number = 30
): Promise<SessionServiceResponse<StudySession[]>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to view study sessions",
      };
    }

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // Fetch recent sessions
    const { data, error } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("session_date", cutoffDateStr)
      .order("session_date", { ascending: false });

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as StudySession[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Calculate study streak for a subject
 * A streak is broken if there's a day without a study session
 */
export async function calculateStudyStreak(
  subjectId: string
): Promise<
  SessionServiceResponse<{
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;
  }>
> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to calculate study streak",
      };
    }

    // Fetch all sessions for this subject, ordered by date
    const { data: sessions, error } = await supabase
      .from("study_sessions")
      .select("session_date")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .order("session_date", { ascending: false });

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    if (!sessions || sessions.length === 0) {
      return {
        data: {
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: null,
        },
        error: null,
      };
    }

    // Get unique dates (in case there are multiple sessions on the same day)
    const uniqueDates = Array.from(new Set(sessions.map((s) => s.session_date)))
      .sort()
      .reverse();

    const lastStudyDate = uniqueDates[0];

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(today);

    for (const dateStr of uniqueDates) {
      const sessionDate = new Date(dateStr);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (checkDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0 || daysDiff === currentStreak) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      current.setHours(0, 0, 0, 0);
      next.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      data: {
        currentStreak,
        longestStreak,
        lastStudyDate,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}
