/**
 * AI-Powered Study Plan Generation Service
 *
 * Uses OpenAI GPT to generate personalized study plans based on:
 * - Weak areas identified from quiz performance
 * - Current mastery levels
 * - Time constraints
 * - Exam date
 */

import { openai } from "@/lib/ai/openai";
import type { WeakArea } from "../types/analytics.types";
import {
  calculateAvailableTime,
  checkIfRealistic,
  distributeStudyTime,
  type ScheduleFeasibility,
} from "../utils/time-calculations";

// =====================================================
// Types
// =====================================================

export interface GenerateStudyPlanInput {
  subjectId: string;
  subjectName: string;
  weakAreas: WeakArea[];
  examDate: Date;
  hoursPerDay: number;
  skipWeekends?: boolean;
  targetMastery?: number; // Default: 80
  focusAreas?: string[]; // Optional: specific topics to focus on
}

export interface AIGeneratedTopic {
  name: string;
  description: string;
  order: number;
  estimatedHours: number;
  currentMastery: number;
  targetMastery: number;
  priority: number; // 1-5
  tasks: AIGeneratedTask[];
}

export interface AIGeneratedTask {
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  taskType: "review" | "practice" | "quiz" | "research" | "other";
  resources?: string[]; // Suggested resources/materials
}

export interface AIGeneratedPlan {
  title: string;
  description: string;
  topics: AIGeneratedTopic[];
  totalHoursEstimated: number;
  projectedPassChance: number; // 0-100
  feasibility: ScheduleFeasibility;
  recommendations: string[];
}

export interface GenerateStudyPlanResponse {
  data: AIGeneratedPlan | null;
  error: string | null;
  usedFallback: boolean;
}

// =====================================================
// AI Generation
// =====================================================

/**
 * Generate a personalized study plan using OpenAI
 */
export async function generateStudyPlan(
  input: GenerateStudyPlanInput
): Promise<GenerateStudyPlanResponse> {
  try {
    // Validate inputs
    if (!input.weakAreas || input.weakAreas.length === 0) {
      return {
        data: null,
        error:
          "No weak areas provided. Complete some quizzes first to identify areas for improvement.",
        usedFallback: false,
      };
    }

    if (input.examDate <= new Date()) {
      return {
        data: null,
        error: "Exam date must be in the future.",
        usedFallback: false,
      };
    }

    if (input.hoursPerDay <= 0 || input.hoursPerDay > 24) {
      return {
        data: null,
        error: "Hours per day must be between 0.5 and 24.",
        usedFallback: false,
      };
    }

    // Calculate time constraints
    const totalHoursAvailable = calculateAvailableTime(
      input.examDate,
      input.hoursPerDay,
      input.skipWeekends
    );

    // Try AI generation first
    try {
      const aiPlan = await generateWithAI(input, totalHoursAvailable);

      if (aiPlan) {
        return {
          data: aiPlan,
          error: null,
          usedFallback: false,
        };
      }
    } catch (aiError) {
      console.error("AI generation failed, falling back to template:", aiError);
    }

    // Fallback to template-based generation
    const templatePlan = generateTemplateBasedPlan(input, totalHoursAvailable);

    return {
      data: templatePlan,
      error: null,
      usedFallback: true,
    };
  } catch (error) {
    console.error("Study plan generation error:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate study plan",
      usedFallback: false,
    };
  }
}

/**
 * Generate study plan using OpenAI GPT
 */
async function generateWithAI(
  input: GenerateStudyPlanInput,
  totalHoursAvailable: number
): Promise<AIGeneratedPlan | null> {
  const targetMastery = input.targetMastery || 80;

  // Build the prompt
  const prompt = buildAIPrompt(input, totalHoursAvailable, targetMastery);

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or gpt-4 for better results
    messages: [
      {
        role: "system",
        content:
          "You are an expert study plan generator specializing in personalized learning strategies. Generate structured, actionable study plans in JSON format.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: "json_object" },
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response from OpenAI");
  }

  // Parse and validate response
  const parsedPlan = parseAIPlanResponse(responseContent, input);

  return parsedPlan;
}

/**
 * Build the AI prompt with all necessary context
 */
function buildAIPrompt(
  input: GenerateStudyPlanInput,
  totalHoursAvailable: number,
  targetMastery: number
): string {
  const examDateStr = input.examDate.toLocaleDateString();
  const daysUntilExam = Math.floor(
    (input.examDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
  );

  const weakAreasStr = input.weakAreas
    .map((area, idx) => {
      const accuracy =
        area.totalAttempts > 0
          ? Math.round((area.correctCount / area.totalAttempts) * 100)
          : 0;
      return `${idx + 1}. ${area.topicName} (Current: ${
        area.masteryLevel
      }%, Accuracy: ${accuracy}%)`;
    })
    .join("\n");

  const focusAreasStr = input.focusAreas?.length
    ? `\n\nUser specifically wants to focus on: ${input.focusAreas.join(", ")}`
    : "";

  return `Generate a personalized study plan for a student preparing for their ${
    input.subjectName
  } exam.

**Student Information:**
- Subject: ${input.subjectName}
- Exam Date: ${examDateStr} (${daysUntilExam} days from now)
- Available Study Time: ${input.hoursPerDay} hours per day
- Total Hours Available: ${totalHoursAvailable.toFixed(1)} hours
- Skip Weekends: ${input.skipWeekends ? "Yes" : "No"}
- Target Mastery Level: ${targetMastery}%

**Weak Areas Identified (from quiz performance):**
${weakAreasStr}${focusAreasStr}

**Instructions:**
1. Create a comprehensive study plan that addresses the weak areas above
2. Prioritize topics based on current mastery level and importance
3. Break each topic into specific, actionable tasks
4. Estimate time for each task realistically
5. Include variety: review, practice problems, quizzes, and research tasks
6. Project the expected pass probability if the student completes the plan
7. Provide strategic recommendations

**Required JSON Format:**
{
  "title": "Study Plan Title",
  "description": "Brief overview of the plan strategy",
  "topics": [
    {
      "name": "Topic Name",
      "description": "What this topic covers",
      "order": 1,
      "estimatedHours": 5.5,
      "currentMastery": 45,
      "targetMastery": 80,
      "priority": 5,
      "tasks": [
        {
          "title": "Task Title",
          "description": "Detailed task description",
          "order": 1,
          "estimatedMinutes": 45,
          "taskType": "review",
          "resources": ["Chapter 3 notes", "Practice problems 1-10"]
        }
      ]
    }
  ],
  "projectedPassChance": 85,
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

**Important:**
- taskType must be one of: "review", "practice", "quiz", "research", "other"
- priority is 1-5 (5 = highest priority)
- projectedPassChance should be realistic based on time available and current mastery
- Keep task descriptions specific and actionable
- Ensure total hours fit within ${totalHoursAvailable.toFixed(
    1
  )} hours available`;
}

/**
 * Parse and validate AI response
 */
function parseAIPlanResponse(
  responseContent: string,
  input: GenerateStudyPlanInput
): AIGeneratedPlan | null {
  try {
    const parsed = JSON.parse(responseContent);

    // Validate required fields
    if (!parsed.title || !parsed.topics || !Array.isArray(parsed.topics)) {
      throw new Error("Invalid AI response structure");
    }

    // Validate and transform topics
    const topics: AIGeneratedTopic[] = parsed.topics.map(
      (topic: unknown, idx: number) => {
        const topicData = topic as Record<string, unknown>;
        if (
          !topicData.name ||
          !topicData.tasks ||
          !Array.isArray(topicData.tasks)
        ) {
          throw new Error(`Invalid topic structure at index ${idx}`);
        }

        // Validate and transform tasks
        const tasks: AIGeneratedTask[] = topicData.tasks.map(
          (task: unknown, taskIdx: number) => {
            const taskData = task as Record<string, unknown>;
            if (!taskData.title || !taskData.estimatedMinutes) {
              throw new Error(
                `Invalid task structure at topic ${idx}, task ${taskIdx}`
              );
            }

            return {
              title: String(taskData.title),
              description: String(taskData.description || ""),
              order: Number(taskData.order) || taskIdx + 1,
              estimatedMinutes: Math.max(5, Number(taskData.estimatedMinutes)),
              taskType: validateTaskType(String(taskData.taskType)),
              resources: Array.isArray(taskData.resources)
                ? taskData.resources.map(String)
                : [],
            };
          }
        );

        return {
          name: String(topicData.name),
          description: String(topicData.description || ""),
          order: Number(topicData.order) || idx + 1,
          estimatedHours: Number(topicData.estimatedHours) || 0,
          currentMastery: Number(topicData.currentMastery) || 0,
          targetMastery: Number(topicData.targetMastery) || 80,
          priority: Math.min(5, Math.max(1, Number(topicData.priority) || 3)),
          tasks,
        };
      }
    );

    // Calculate total hours
    const totalHoursEstimated = topics.reduce(
      (sum, topic) => sum + topic.estimatedHours,
      0
    );

    // Check feasibility
    const feasibility = checkIfRealistic(
      totalHoursEstimated,
      input.examDate,
      input.hoursPerDay,
      input.skipWeekends
    );

    // Ensure we have recommendations
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations
      : [];

    // Add feasibility recommendations
    recommendations.push(...feasibility.recommendations);

    return {
      title: parsed.title,
      description: parsed.description || "",
      topics,
      totalHoursEstimated,
      projectedPassChance: Math.min(
        100,
        Math.max(0, Number(parsed.projectedPassChance) || 70)
      ),
      feasibility,
      recommendations,
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return null;
  }
}

/**
 * Validate task type
 */
function validateTaskType(taskType: string): AIGeneratedTask["taskType"] {
  const validTypes = [
    "review",
    "practice",
    "quiz",
    "research",
    "other",
  ] as const;
  type ValidTaskType = (typeof validTypes)[number];

  if (validTypes.includes(taskType as ValidTaskType)) {
    return taskType as AIGeneratedTask["taskType"];
  }

  return "other";
}

// =====================================================
// Template-Based Fallback
// =====================================================

/**
 * Generate a simple template-based study plan when AI fails
 */
export function generateTemplateBasedPlan(
  input: GenerateStudyPlanInput,
  totalHoursAvailable: number
): AIGeneratedPlan {
  const targetMastery = input.targetMastery || 80;

  // Sort weak areas by mastery level (lowest first)
  const sortedWeakAreas = [...input.weakAreas].sort(
    (a, b) => a.masteryLevel - b.masteryLevel
  );

  // Take top 5 weakest areas
  const topicsToAddress = sortedWeakAreas.slice(0, 5);

  // Distribute study time
  const timeAllocations = distributeStudyTime(
    topicsToAddress.map((area) => ({
      name: area.topicName,
      currentMastery: area.masteryLevel,
      priority: calculatePriority(area.masteryLevel, area.totalAttempts),
      difficulty: 3, // Default medium difficulty
    })),
    totalHoursAvailable
  );

  // Generate topics with tasks
  const topics: AIGeneratedTopic[] = topicsToAddress.map((area, idx) => {
    const allocation = timeAllocations[idx];
    const hoursAllocated = allocation.hoursAllocated;

    return {
      name: area.topicName,
      description: `Improve mastery from ${area.masteryLevel}% to ${targetMastery}%`,
      order: idx + 1,
      estimatedHours: hoursAllocated,
      currentMastery: area.masteryLevel,
      targetMastery,
      priority: allocation.priority,
      tasks: generateTemplateTasks(
        area.topicName,
        hoursAllocated,
        area.masteryLevel
      ),
    };
  });

  const totalHoursEstimated = topics.reduce(
    (sum, topic) => sum + topic.estimatedHours,
    0
  );

  const feasibility = checkIfRealistic(
    totalHoursEstimated,
    input.examDate,
    input.hoursPerDay,
    input.skipWeekends
  );

  // Calculate projected pass chance (simple formula)
  const avgCurrentMastery =
    topicsToAddress.reduce((sum, area) => sum + area.masteryLevel, 0) /
    topicsToAddress.length;
  const avgImprovement =
    timeAllocations.reduce((sum, a) => sum + a.estimatedImprovement, 0) /
    timeAllocations.length;
  const projectedPassChance = Math.min(
    100,
    Math.round(avgCurrentMastery + avgImprovement)
  );

  return {
    title: `${input.subjectName} Study Plan`,
    description: `Focus on ${topicsToAddress.length} key weak areas to maximize improvement before your exam.`,
    topics,
    totalHoursEstimated,
    projectedPassChance,
    feasibility,
    recommendations: [
      "This is a template-based plan. For a more personalized plan, ensure OpenAI API is configured.",
      `Focus on the lowest mastery topics first: ${topicsToAddress[0]?.topicName}`,
      "Take quizzes regularly to track your progress and update your mastery levels.",
      ...feasibility.recommendations,
    ],
  };
}

/**
 * Calculate priority based on mastery level and total attempts
 */
function calculatePriority(
  masteryLevel: number,
  totalAttempts: number
): number {
  // Lower mastery = higher priority
  let priority = 5;

  if (masteryLevel >= 50) priority = 4;
  if (masteryLevel >= 60) priority = 3;
  if (masteryLevel >= 70) priority = 2;
  if (masteryLevel >= 80) priority = 1;

  // Boost priority if there are many attempts on this topic (more data = more reliable)
  if (totalAttempts > 20 && priority < 5) {
    priority += 1;
  }

  return Math.min(5, priority);
}

/**
 * Generate template tasks for a topic
 */
function generateTemplateTasks(
  topicName: string,
  hoursAllocated: number,
  currentMastery: number
): AIGeneratedTask[] {
  const tasks: AIGeneratedTask[] = [];
  const totalMinutes = Math.round(hoursAllocated * 60);

  // Distribute time across task types based on mastery
  let reviewMinutes = 0;
  let practiceMinutes = 0;
  let quizMinutes = 0;

  if (currentMastery < 40) {
    // Low mastery: more review
    reviewMinutes = Math.round(totalMinutes * 0.5);
    practiceMinutes = Math.round(totalMinutes * 0.3);
    quizMinutes = Math.round(totalMinutes * 0.2);
  } else if (currentMastery < 70) {
    // Medium mastery: balanced
    reviewMinutes = Math.round(totalMinutes * 0.3);
    practiceMinutes = Math.round(totalMinutes * 0.4);
    quizMinutes = Math.round(totalMinutes * 0.3);
  } else {
    // High mastery: more practice and testing
    reviewMinutes = Math.round(totalMinutes * 0.2);
    practiceMinutes = Math.round(totalMinutes * 0.4);
    quizMinutes = Math.round(totalMinutes * 0.4);
  }

  let order = 1;

  // Review tasks
  if (reviewMinutes > 0) {
    tasks.push({
      title: `Review ${topicName} fundamentals`,
      description: `Review core concepts, definitions, and key principles for ${topicName}.`,
      order: order++,
      estimatedMinutes: Math.round(reviewMinutes * 0.6),
      taskType: "review",
      resources: ["Course notes", "Textbook chapter"],
    });

    tasks.push({
      title: `Summarize ${topicName} key points`,
      description: `Create summary notes of the most important concepts and formulas.`,
      order: order++,
      estimatedMinutes: Math.round(reviewMinutes * 0.4),
      taskType: "review",
      resources: ["Study materials"],
    });
  }

  // Practice tasks
  if (practiceMinutes > 0) {
    tasks.push({
      title: `Practice ${topicName} problems`,
      description: `Work through practice problems to reinforce understanding.`,
      order: order++,
      estimatedMinutes: Math.round(practiceMinutes * 0.7),
      taskType: "practice",
      resources: ["Practice problem sets", "Past papers"],
    });

    tasks.push({
      title: `Review ${topicName} solutions`,
      description: `Carefully review solutions to understand problem-solving strategies.`,
      order: order++,
      estimatedMinutes: Math.round(practiceMinutes * 0.3),
      taskType: "review",
      resources: ["Solution guides"],
    });
  }

  // Quiz tasks
  if (quizMinutes > 0) {
    tasks.push({
      title: `Take ${topicName} practice quiz`,
      description: `Test your knowledge with a timed quiz on this topic.`,
      order: order++,
      estimatedMinutes: quizMinutes,
      taskType: "quiz",
      resources: ["Quiz section in app"],
    });
  }

  return tasks;
}
