import { supabase } from "@/lib/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types";
import type { TopicMastery, WeakArea } from "../types/analytics.types";
import {
  BayesianKnowledgeTracing,
  createBKTFromState,
  calculateAverageMastery,
} from "../utils/bkt";

type MasteryInsert = TablesInsert<"topic_mastery">;
type MasteryUpdate = TablesUpdate<"topic_mastery">;

// Response type
type MasteryServiceResponse<T> = {
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
 * Get all topic mastery records for a subject (for the current user)
 */
export async function getTopicMasteryBySubject(
  subjectId: string
): Promise<MasteryServiceResponse<TopicMastery[]>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to view mastery data",
      };
    }

    // Fetch mastery records for this user and subject
    const { data, error } = await supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .order("mastery_level", { ascending: true }); // Weakest topics first

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as TopicMastery[],
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
 * Update or create a topic mastery record
 * This is called after quiz attempts to update BKT parameters and mastery level
 */
export async function updateTopicMastery(
  subjectId: string,
  topicName: string,
  masteryData: {
    masteryLevel: number;
    correctCount: number;
    incorrectCount: number;
    totalAttempts: number;
    pLearned: number;
    pKnown: number;
    pInit?: number;
    pTransit?: number;
    pGuess?: number;
    pSlip?: number;
  }
): Promise<MasteryServiceResponse<TopicMastery>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update mastery data",
      };
    }

    // Check if a mastery record already exists
    const { data: existing, error: fetchError } = await supabase
      .from("topic_mastery")
      .select("id")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .eq("topic_name", topicName)
      .maybeSingle();

    if (fetchError) {
      return {
        data: null,
        error: handleDatabaseError(fetchError),
      };
    }

    if (existing) {
      // Update existing record
      const updateData: MasteryUpdate = {
        mastery_level: Math.round(masteryData.masteryLevel),
        correct_count: masteryData.correctCount,
        incorrect_count: masteryData.incorrectCount,
        total_attempts: masteryData.totalAttempts,
        p_learned: masteryData.pLearned,
        p_known: masteryData.pKnown,
        last_practiced_at: new Date().toISOString(),
      };

      // Optionally update BKT parameters if provided
      if (masteryData.pInit !== undefined)
        updateData.p_init = masteryData.pInit;
      if (masteryData.pTransit !== undefined)
        updateData.p_transit = masteryData.pTransit;
      if (masteryData.pGuess !== undefined)
        updateData.p_guess = masteryData.pGuess;
      if (masteryData.pSlip !== undefined)
        updateData.p_slip = masteryData.pSlip;

      const { data, error } = await supabase
        .from("topic_mastery")
        .update(updateData)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: handleDatabaseError(error),
        };
      }

      return {
        data: data as TopicMastery,
        error: null,
      };
    } else {
      // Create new record
      const insertData: MasteryInsert = {
        user_id: user.id,
        subject_id: subjectId,
        topic_name: topicName,
        mastery_level: Math.round(masteryData.masteryLevel),
        correct_count: masteryData.correctCount,
        incorrect_count: masteryData.incorrectCount,
        total_attempts: masteryData.totalAttempts,
        p_learned: masteryData.pLearned,
        p_known: masteryData.pKnown,
        p_init: masteryData.pInit ?? 0.3,
        p_transit: masteryData.pTransit ?? 0.1,
        p_guess: masteryData.pGuess ?? 0.25,
        p_slip: masteryData.pSlip ?? 0.1,
        last_practiced_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("topic_mastery")
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
        data: data as TopicMastery,
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Recalculate mastery from quiz attempts using BKT algorithm
 * This reprocesses all historical attempts to update BKT parameters
 *
 * @param subjectId - The subject ID
 * @param topicName - The topic name
 * @returns Updated mastery record with recalculated BKT values
 */
export async function calculateMasteryFromAttempts(
  subjectId: string,
  topicName: string
): Promise<MasteryServiceResponse<TopicMastery>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to calculate mastery",
      };
    }

    // Get the current mastery record
    const { data: mastery, error: masteryError } = await supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .eq("topic_name", topicName)
      .maybeSingle();

    if (masteryError) {
      return {
        data: null,
        error: handleDatabaseError(masteryError),
      };
    }

    if (!mastery) {
      return {
        data: null,
        error: "No mastery record found for this topic",
      };
    }

    // Create BKT instance and recalculate from scratch
    const bkt = new BayesianKnowledgeTracing({
      pInit: mastery.p_init,
      pTransit: mastery.p_transit,
      pGuess: mastery.p_guess,
      pSlip: mastery.p_slip,
    });

    // Simulate all past attempts (assuming pattern based on correct/incorrect counts)
    // Note: This is a simplified approach. Ideally, you'd store individual attempt history.
    const answers: boolean[] = [
      ...Array(mastery.correct_count).fill(true),
      ...Array(mastery.incorrect_count).fill(false),
    ];

    // Shuffle to simulate realistic answer pattern
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    // Process all answers through BKT
    bkt.batchUpdate(answers);

    // Get updated state
    const bktState = bkt.getState();
    const masteryLevel = bkt.getMasteryLevel();

    // Update the database with recalculated values
    const { data, error } = await supabase
      .from("topic_mastery")
      .update({
        mastery_level: masteryLevel,
        p_known: bktState.pKnown,
        p_learned: bktState.pLearned,
      })
      .eq("id", mastery.id)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    return {
      data: data as TopicMastery,
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
 * Get weak topics for a subject (topics with low mastery that need focus)
 * @param threshold - Mastery level below which topics are considered weak (default: 60)
 * @param limit - Maximum number of weak topics to return (default: 5)
 */
export async function getWeakTopics(
  subjectId: string,
  threshold: number = 60,
  limit: number = 5
): Promise<MasteryServiceResponse<WeakArea[]>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to view weak topics",
      };
    }

    // Fetch topics with mastery below threshold
    const { data, error } = await supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .lt("mastery_level", threshold)
      .order("mastery_level", { ascending: true })
      .limit(limit);

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    // Map to WeakArea type
    const weakAreas: WeakArea[] = (data as TopicMastery[]).map((mastery) => {
      // Calculate priority based on mastery level
      const priority =
        mastery.mastery_level < 30
          ? ("high" as const)
          : mastery.mastery_level < 50
          ? ("medium" as const)
          : ("low" as const);

      // Recommend more study time for weaker topics
      const recommendedStudyTime =
        mastery.mastery_level < 30
          ? 60 // 60 minutes for very weak topics
          : mastery.mastery_level < 50
          ? 45 // 45 minutes for weak topics
          : 30; // 30 minutes for slightly weak topics

      return {
        topicName: mastery.topic_name,
        masteryLevel: mastery.mastery_level,
        correctCount: mastery.correct_count,
        incorrectCount: mastery.incorrect_count,
        totalAttempts: mastery.total_attempts,
        lastPracticedAt: mastery.last_practiced_at,
        priority,
        recommendedStudyTime,
      };
    });

    return {
      data: weakAreas,
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
 * Process a single quiz attempt using BKT algorithm
 * This updates the BKT parameters and mastery level for a topic
 *
 * @param subjectId - The subject ID
 * @param topicName - The topic name
 * @param answerCorrect - Whether the answer was correct
 * @returns Updated mastery record with new BKT parameters
 */
export async function processQuizAttempt(
  subjectId: string,
  topicName: string,
  answerCorrect: boolean
): Promise<MasteryServiceResponse<TopicMastery>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to process quiz attempts",
      };
    }

    // Get existing mastery record or create default
    const { data: existing, error: fetchError } = await supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .eq("topic_name", topicName)
      .maybeSingle();

    if (fetchError) {
      return {
        data: null,
        error: handleDatabaseError(fetchError),
      };
    }

    let bkt: BayesianKnowledgeTracing;
    let correctCount = 0;
    let incorrectCount = 0;
    let totalAttempts = 0;

    if (existing) {
      // Load existing BKT state
      bkt = createBKTFromState({
        p_init: existing.p_init,
        p_transit: existing.p_transit,
        p_guess: existing.p_guess,
        p_slip: existing.p_slip,
        p_known: existing.p_known,
      });

      correctCount = existing.correct_count;
      incorrectCount = existing.incorrect_count;
      totalAttempts = existing.total_attempts;
    } else {
      // Create new BKT instance with defaults
      bkt = new BayesianKnowledgeTracing({
        pInit: 0.3,
        pTransit: 0.1,
        pGuess: 0.25,
        pSlip: 0.1,
      });
    }

    // Update BKT with new answer
    bkt.update(answerCorrect);

    // Update counts
    if (answerCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
    totalAttempts++;

    // Get updated state
    const bktState = bkt.getState();
    const masteryLevel = bkt.getMasteryLevel();

    // Save to database
    const masteryData = {
      masteryLevel,
      correctCount,
      incorrectCount,
      totalAttempts,
      pLearned: bktState.pLearned,
      pKnown: bktState.pKnown,
      pInit: bktState.pInit,
      pTransit: bktState.pTransit,
      pGuess: bktState.pGuess,
      pSlip: bktState.pSlip,
    };

    return await updateTopicMastery(subjectId, topicName, masteryData);
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Batch process multiple quiz results for a topic using BKT
 * Useful for processing all answers from a completed quiz
 *
 * @param subjectId - The subject ID
 * @param topicName - The topic name
 * @param answers - Array of correct/incorrect answers
 * @returns Updated mastery record
 */
export async function updateMasteryFromQuizResults(
  subjectId: string,
  topicName: string,
  answers: boolean[]
): Promise<MasteryServiceResponse<TopicMastery>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update mastery",
      };
    }

    if (answers.length === 0) {
      return {
        data: null,
        error: "No answers provided",
      };
    }

    // Get existing mastery record or create default
    const { data: existing, error: fetchError } = await supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId)
      .eq("topic_name", topicName)
      .maybeSingle();

    if (fetchError) {
      return {
        data: null,
        error: handleDatabaseError(fetchError),
      };
    }

    let bkt: BayesianKnowledgeTracing;
    let correctCount = 0;
    let incorrectCount = 0;
    let totalAttempts = 0;

    if (existing) {
      // Load existing BKT state
      bkt = createBKTFromState({
        p_init: existing.p_init,
        p_transit: existing.p_transit,
        p_guess: existing.p_guess,
        p_slip: existing.p_slip,
        p_known: existing.p_known,
      });

      correctCount = existing.correct_count;
      incorrectCount = existing.incorrect_count;
      totalAttempts = existing.total_attempts;
    } else {
      // Create new BKT instance with defaults
      bkt = new BayesianKnowledgeTracing({
        pInit: 0.3,
        pTransit: 0.1,
        pGuess: 0.25,
        pSlip: 0.1,
      });
    }

    // Batch process all answers
    bkt.batchUpdate(answers);

    // Update counts
    const newCorrect = answers.filter((a) => a).length;
    const newIncorrect = answers.filter((a) => !a).length;

    correctCount += newCorrect;
    incorrectCount += newIncorrect;
    totalAttempts += answers.length;

    // Get updated state
    const bktState = bkt.getState();
    const masteryLevel = bkt.getMasteryLevel();

    // Save to database
    const masteryData = {
      masteryLevel,
      correctCount,
      incorrectCount,
      totalAttempts,
      pLearned: bktState.pLearned,
      pKnown: bktState.pKnown,
      pInit: bktState.pInit,
      pTransit: bktState.pTransit,
      pGuess: bktState.pGuess,
      pSlip: bktState.pSlip,
    };

    return await updateTopicMastery(subjectId, topicName, masteryData);
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}

/**
 * Get predicted pass probability for a subject based on topic mastery levels
 * This calculates the likelihood of passing based on BKT knowledge probabilities
 *
 * @param subjectId - The subject ID
 * @param passingThreshold - Minimum mastery level considered passing (default: 70)
 * @returns Predicted pass probability (0-100)
 */
export async function getPredictedPassProbability(
  subjectId: string,
  passingThreshold: number = 70
): Promise<
  MasteryServiceResponse<{
    probability: number;
    averageMastery: number;
    topicCount: number;
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
        error: "You must be logged in to calculate pass probability",
      };
    }

    // Get all topic mastery records for this subject
    const { data: masteryRecords, error } = await supabase
      .from("topic_mastery")
      .select("p_known, mastery_level")
      .eq("user_id", user.id)
      .eq("subject_id", subjectId);

    if (error) {
      return {
        data: null,
        error: handleDatabaseError(error),
      };
    }

    if (!masteryRecords || masteryRecords.length === 0) {
      return {
        data: {
          probability: 0,
          averageMastery: 0,
          topicCount: 0,
        },
        error: null,
      };
    }

    // Calculate average mastery using BKT probabilities
    const pKnownValues = masteryRecords.map((r) => r.p_known);
    const averageMastery = calculateAverageMastery(pKnownValues);

    // Calculate pass probability
    // Simple approach: probability = (average mastery / passing threshold)
    // Capped at 100% if average exceeds threshold
    const probability = Math.min(
      100,
      Math.round((averageMastery / passingThreshold) * 100)
    );

    return {
      data: {
        probability,
        averageMastery,
        topicCount: masteryRecords.length,
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

/**
 * Update the pass_chance field in subjects table based on current mastery
 * This should be called after quiz completion to keep pass probability up to date
 *
 * @param subjectId - The subject ID
 * @returns Updated pass chance (0-100)
 */
export async function updateSubjectPassChance(
  subjectId: string
): Promise<MasteryServiceResponse<number>> {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        data: null,
        error: "You must be logged in to update pass chance",
      };
    }

    // Calculate current pass probability
    const result = await getPredictedPassProbability(subjectId);

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error || "Failed to calculate pass probability",
      };
    }

    const passChance = result.data.probability;

    // Update subjects table
    const { error: updateError } = await supabase
      .from("subjects")
      .update({ pass_chance: passChance })
      .eq("id", subjectId)
      .eq("user_id", user.id);

    if (updateError) {
      return {
        data: null,
        error: handleDatabaseError(updateError),
      };
    }

    console.log(
      `✅ Updated pass_chance for subject ${subjectId}: ${passChance}%`
    );

    return {
      data: passChance,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleDatabaseError(error),
    };
  }
}
