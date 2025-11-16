/**
 * Time Calculation Utilities for Study Plans
 *
 * Handles time estimates, feasibility checks, and schedule distribution
 */

export interface TimeAllocation {
  topicName: string;
  hoursAllocated: number;
  priority: number; // 1-5, higher = more important
  estimatedImprovement: number; // Expected mastery increase (0-100)
}

export interface ScheduleFeasibility {
  isRealistic: boolean;
  totalHoursNeeded: number;
  totalHoursAvailable: number;
  hoursPerDay: number;
  daysNeeded: number;
  daysAvailable: number;
  recommendations: string[];
}

/**
 * Calculate total hours available between now and exam date
 */
export function calculateAvailableTime(
  examDate: Date,
  hoursPerDay: number,
  skipWeekends: boolean = false
): number {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((examDate.getTime() - now.getTime()) / msPerDay);

  if (totalDays <= 0) {
    return 0;
  }

  if (!skipWeekends) {
    return totalDays * hoursPerDay;
  }

  // Calculate weekdays only
  let weekdays = 0;
  const currentDate = new Date(now);

  for (let i = 0; i < totalDays; i++) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday or Saturday
      weekdays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekdays * hoursPerDay;
}

/**
 * Calculate days available between now and exam date
 */
export function calculateDaysAvailable(
  examDate: Date,
  skipWeekends: boolean = false
): number {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((examDate.getTime() - now.getTime()) / msPerDay);

  if (totalDays <= 0) {
    return 0;
  }

  if (!skipWeekends) {
    return totalDays;
  }

  // Calculate weekdays only
  let weekdays = 0;
  const currentDate = new Date(now);

  for (let i = 0; i < totalDays; i++) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekdays;
}

/**
 * Estimate study time needed for a topic based on current mastery and difficulty
 *
 * Formula considers:
 * - Gap to target mastery (default target: 80)
 * - Topic difficulty (more difficult = more time)
 * - Current mastery (lower mastery = more time)
 */
export function estimateTopicStudyTime(
  currentMastery: number,
  targetMastery: number = 80,
  topicDifficulty: number = 3 // 1-5 scale
): number {
  // Mastery gap
  const masteryGap = Math.max(0, targetMastery - currentMastery);

  // Base hours per mastery point (0.1 hours = 6 minutes per point)
  const baseHoursPerPoint = 0.1;

  // Difficulty multiplier (1 = easy, 5 = very hard)
  const difficultyMultiplier = topicDifficulty / 3;

  // Diminishing returns for already high mastery
  const masteryMultiplier =
    currentMastery < 50 ? 1.2 : currentMastery < 70 ? 1.0 : 0.8;

  const estimatedHours =
    masteryGap * baseHoursPerPoint * difficultyMultiplier * masteryMultiplier;

  // Round to nearest 0.5 hours and ensure minimum
  return Math.max(0.5, Math.round(estimatedHours * 2) / 2);
}

/**
 * Check if a study plan is realistic given time constraints
 */
export function checkIfRealistic(
  totalHoursNeeded: number,
  examDate: Date,
  hoursPerDay: number,
  skipWeekends: boolean = false
): ScheduleFeasibility {
  const daysAvailable = calculateDaysAvailable(examDate, skipWeekends);
  const totalHoursAvailable = calculateAvailableTime(
    examDate,
    hoursPerDay,
    skipWeekends
  );
  const daysNeeded = Math.ceil(totalHoursNeeded / hoursPerDay);

  const isRealistic = totalHoursNeeded <= totalHoursAvailable;
  const recommendations: string[] = [];

  // Generate recommendations
  if (!isRealistic) {
    const deficit = totalHoursNeeded - totalHoursAvailable;
    const additionalHoursPerDay =
      Math.ceil((deficit / daysAvailable) * 10) / 10;

    recommendations.push(
      `You need ${totalHoursNeeded.toFixed(
        1
      )} hours but only have ${totalHoursAvailable.toFixed(1)} hours available.`
    );
    recommendations.push(
      `Consider increasing study time by ${additionalHoursPerDay.toFixed(
        1
      )} hours per day.`
    );
    recommendations.push(
      `Alternatively, focus on the highest-priority topics and adjust your goals.`
    );
  } else if (daysNeeded < daysAvailable * 0.7) {
    // Plan is very comfortable
    recommendations.push(
      `This plan is very achievable! You have ${
        daysAvailable - daysNeeded
      } extra days as buffer.`
    );
  } else if (daysNeeded < daysAvailable) {
    // Plan is tight but doable
    recommendations.push(
      `This plan is tight but achievable with consistent effort.`
    );
  }

  return {
    isRealistic,
    totalHoursNeeded,
    totalHoursAvailable,
    hoursPerDay,
    daysNeeded,
    daysAvailable,
    recommendations,
  };
}

/**
 * Distribute available study time across topics based on priority
 *
 * Higher priority topics get more time, but all topics get minimum allocation
 */
export function distributeStudyTime(
  topics: Array<{
    name: string;
    currentMastery: number;
    priority: number;
    difficulty?: number;
  }>,
  totalHoursAvailable: number
): TimeAllocation[] {
  if (topics.length === 0) {
    return [];
  }

  // Calculate initial time estimates
  const topicsWithEstimates = topics.map((topic) => ({
    ...topic,
    estimatedHours: estimateTopicStudyTime(
      topic.currentMastery,
      80,
      topic.difficulty || 3
    ),
  }));

  // Calculate total estimated hours needed
  const totalEstimatedHours = topicsWithEstimates.reduce(
    (sum, t) => sum + t.estimatedHours,
    0
  );

  // If we have more time than needed, use estimates as-is
  if (totalHoursAvailable >= totalEstimatedHours) {
    return topicsWithEstimates.map((topic) => ({
      topicName: topic.name,
      hoursAllocated: topic.estimatedHours,
      priority: topic.priority,
      estimatedImprovement: Math.min(100 - topic.currentMastery, 20),
    }));
  }

  // Otherwise, distribute proportionally with priority weighting
  const totalPriorityWeight = topicsWithEstimates.reduce(
    (sum, t) => sum + t.priority * t.estimatedHours,
    0
  );

  return topicsWithEstimates.map((topic) => {
    const priorityWeight = topic.priority * topic.estimatedHours;
    const proportionalHours =
      (priorityWeight / totalPriorityWeight) * totalHoursAvailable;

    // Ensure minimum allocation of 0.5 hours
    const hoursAllocated = Math.max(0.5, Math.round(proportionalHours * 2) / 2);

    // Estimate improvement based on allocated time vs needed time
    const improvementRatio = hoursAllocated / topic.estimatedHours;
    const estimatedImprovement = Math.min(
      100 - topic.currentMastery,
      Math.round((80 - topic.currentMastery) * improvementRatio)
    );

    return {
      topicName: topic.name,
      hoursAllocated,
      priority: topic.priority,
      estimatedImprovement,
    };
  });
}

/**
 * Calculate recommended hours per day based on time constraints
 */
export function calculateRecommendedHoursPerDay(
  totalHoursNeeded: number,
  examDate: Date,
  skipWeekends: boolean = false
): number {
  const daysAvailable = calculateDaysAvailable(examDate, skipWeekends);

  if (daysAvailable <= 0) {
    return 0;
  }

  const hoursPerDay = totalHoursNeeded / daysAvailable;

  // Round to nearest 0.5 and cap at reasonable maximum
  return Math.min(12, Math.round(hoursPerDay * 2) / 2);
}

/**
 * Format hours into human-readable duration string
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }

  if (hours % 1 === 0) {
    return `${hours} hr${hours !== 1 ? "s" : ""}`;
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours} hr${wholeHours !== 1 ? "s" : ""}`;
  }

  return `${wholeHours}h ${minutes}m`;
}

/**
 * Calculate time until exam date
 */
export function getTimeUntilExam(examDate: Date): {
  days: number;
  weeks: number;
  months: number;
  formatted: string;
} {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.floor((examDate.getTime() - now.getTime()) / msPerDay);

  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  let formatted = "";
  if (months > 0) {
    formatted = `${months} month${months !== 1 ? "s" : ""}`;
  } else if (weeks > 0) {
    formatted = `${weeks} week${weeks !== 1 ? "s" : ""}`;
  } else {
    formatted = `${days} day${days !== 1 ? "s" : ""}`;
  }

  return { days, weeks, months, formatted };
}
