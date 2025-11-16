import { useQuery } from "@tanstack/react-query";
import {
  getTopicMasteryBySubject,
  getWeakTopics,
} from "../services/mastery.service";

/**
 * Hook to fetch all topic mastery data for a subject
 */
export function useTopicMastery(subjectId: string | undefined) {
  return useQuery({
    queryKey: ["topicMastery", subjectId],
    queryFn: async () => {
      if (!subjectId) throw new Error("Subject ID is required");
      const result = await getTopicMasteryBySubject(subjectId);
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    enabled: !!subjectId,
  });
}

/**
 * Hook to fetch weak topics for a subject
 */
export function useWeakTopics(
  subjectId: string | undefined,
  threshold: number = 60,
  limit: number = 5
) {
  return useQuery({
    queryKey: ["weakTopics", subjectId, threshold, limit],
    queryFn: async () => {
      if (!subjectId) throw new Error("Subject ID is required");
      const result = await getWeakTopics(subjectId, threshold, limit);
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    enabled: !!subjectId,
  });
}
