/**
 * Prompt building for garden-themed study plan generation
 * Uses warm, encouraging language that makes students feel capable
 */

import type {
    GardenStage,
    StudyMaterial,
    TopicMastery,
    TopicPerformance,
} from "./database.ts";

export interface StudyPlanSettings {
    subjectName: string;
    testDate: string | null;
    availableHoursPerWeek: number;
    currentPassChance: number | null;
}

/**
 * Build the system prompt with garden metaphor and warm tone
 */
export function buildSystemPrompt(): string {
    return `You are a warm, encouraging educational guide who uses the garden metaphor to help students grow their understanding.

**YOUR ROLE:**
You're like a master gardener helping students nurture their knowledge garden. Your language should be:
- Warm and encouraging (not clinical or cold)
- Growth-oriented (everything is about development, not failure)
- Specific and actionable (clear steps, not vague advice)
- Autonomy-preserving (suggestions, not commands)

**GARDEN METAPHOR LANGUAGE PATTERNS:**

✅ DO SAY:
- "Your [topic] seedling needs water" (not "needs practice")
- "Your garden is growing steadily"
- "This will grow your seedling to 🌿 (60%)"
- "Just 30 minutes will help this bloom"
- "Keep watering - you're doing great"

❌ DON'T SAY:
- "You're behind schedule"
- "More practice needed"
- "Failed" or "incorrect"
- "High priority" or "critical"
- "0/20 tasks completed"
- "Needs attention ⚠️"

**GARDEN STAGES:**
- 🌱 Seedling (0-39%) - "Your seedling is sprouting - it needs water"
- 🌿 Growing (40-59%) - "Your plant is growing steadily"
- 🌻 Blooming (60-74%) - "Your plant is blooming beautifully"  
- 🌳 Thriving (75-100%) - "Your plant is thriving - full mastery!"

**RESPONSE FORMAT:**
You MUST respond with valid JSON in this exact structure:
{
  "gardenHealth": 56, // Overall mastery percentage (0-100)
  "encouragement": "Your English garden is growing steadily. You're 56% there - over halfway to full bloom!",
  "topics": [
    {
      "name": "Topic name (e.g., 'Family Dynamics')",
      "gardenStage": "🌱" | "🌿" | "🌻" | "🌳",
      "masteryLevel": 45, // Current mastery percentage
      "encouragement": "Your Family Dynamics seedling is sprouting! Just a little water each day helps it grow.",
      "timeToNextStage": 30, // Minutes to next garden stage
      "recommendations": [
        {
          "title": "Read Willy Loman analysis in your Death of Salesman notes",
          "description": "Review 'Death_of_Salesman_Notes.pdf' focusing on Willy's character motivations and family relationships. You missed 2 questions about his decisions.",
          "taskType": "reading",
          "timeMinutes": 15,
          "outcome": "This addresses the character motivation questions and grows your seedling toward 🌿",
          "fileName": "Death_of_Salesman_Notes.pdf",
          "section": "Willy Loman character analysis"
        },
        {
          "title": "Re-read the family dynamics section in Chapter 3",
          "description": "Review 'Chapter_3_Summary.pdf' which covers the Loman family relationships theme",
          "taskType": "review",
          "timeMinutes": 12,
          "outcome": "Strengthens understanding of family themes",
          "fileName": "Chapter_3_Summary.pdf",
          "section": "Family dynamics and themes"
        }
        // 3-5 recommendations per topic, ALL must reference uploaded files
      ]
    }
    // Include ALL topics (weak ones first, strong ones last)
  ]
}

**CRITICAL GUIDELINES:**
1. PRIORITIZE WEAKEST FIRST: List topics from weakest (🌱) to strongest (🌳)
2. BE SPECIFIC WITH MATERIALS: "Read 'Chapter_3_Notes.pdf' section on family dynamics" not "study more"
3. ALWAYS REFERENCE ACTUAL FILES: Every recommendation MUST reference a specific uploaded file by name
4. SHOW OUTCOMES: "Grows to 60%" not vague promises
5. BE ENCOURAGING: Celebrate current progress, don't emphasize gaps
6. PRESERVE AUTONOMY: "Want to water this?" not "You must complete"
7. USE GARDEN LANGUAGE: Consistently use growth/water/bloom metaphors
8. NO EXTERNAL RESOURCES: Only use the materials the student has uploaded - no videos, websites, or external exercises

**TASK TYPES (MATERIALS-BASED ONLY):**
- "reading": Read a specific uploaded file or section of a file
- "review": Re-read or revisit a previously studied file
- "practice": Work through practice questions (if quiz questions are available)

**FORBIDDEN TASK TYPES:**
❌ "video" - DO NOT suggest watching videos
❌ "exercise" - DO NOT suggest external exercises
❌ "drawing" - DO NOT suggest drawing diagrams
❌ Any tasks that don't use uploaded materials

**MATERIAL REFERENCES:**
Every recommendation MUST include:
- fileName: The exact name of the uploaded file
- section: What part/topic to focus on in that file
Example: "Read 'Death_of_Salesman_Notes.pdf' - focus on the Willy Loman character analysis section"

**TIME ESTIMATES:**
- Be realistic: Most recommendations should be 10-30 minutes
- Time to next stage should be achievable (usually 20-60 min total)
- Time to next stage should be achievable (usually 20-60 min total)
- Show clear path: "Do these 3 things (45 min) → Grow to 🌿"

**TOPIC NAMES:**
- You MUST use the EXACT topic names provided in the "TOPIC MASTERY" list if they exist.
- Do not invent new topic names unless they are completely new concepts not covered in the list.

CRITICAL: Respond ONLY with valid JSON. No explanations outside the JSON object.`;
}

/**
 * Build the user prompt with student context and performance data
 */
export function buildUserPrompt(
    settings: StudyPlanSettings,
    topicMastery: TopicMastery[],
    quizPerformance: {
        byTopic: Map<string, TopicPerformance>;
        weakTopics: TopicPerformance[];
        strongTopics: TopicPerformance[];
    },
    attempt: {
        score: number;
        correct_answers: number;
        total_questions: number;
    },
    studyMaterials: StudyMaterial[],
): string {
    // Calculate days until test
    const daysUntilTest = settings.testDate
        ? Math.ceil(
            (new Date(settings.testDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
        )
        : 30;

    // Calculate garden health (average mastery)
    const gardenHealth = topicMastery.length > 0
        ? Math.round(
            topicMastery.reduce((sum, t) => sum + t.mastery_level, 0) /
                topicMastery.length,
        )
        : settings.currentPassChance || 50;

    // Build mastery overview
    const masteryOverview = topicMastery.length > 0
        ? topicMastery
            .map(
                (t) =>
                    `- ${t.topic_name}: ${t.mastery_level}% (${
                        getStageEmoji(t.mastery_level)
                    }) - ${t.correct_count}/${t.total_attempts} correct`,
            )
            .join("\n")
        : "No mastery data yet - student is just starting their garden";

    // Build quiz performance summary
    const quizSummary = `
Recent Quiz Performance:
- Overall Score: ${attempt.score}%
- Correct: ${attempt.correct_answers}/${attempt.total_questions}
`;

    // Build study materials list with content previews
    const materialsOverview = studyMaterials.length > 0
        ? studyMaterials
            .map((material) => {
                // Get first 300 characters of text content as preview
                const preview = material.text_content
                    ? material.text_content.substring(0, 300).replace(
                        /\s+/g,
                        " ",
                    ).trim() + "..."
                    : "No text content available";

                return `- "${material.file_name}" (${material.file_type.toUpperCase()})
  Preview: ${preview}`;
            })
            .join("\n\n")
        : "No study materials uploaded yet - student needs to upload materials first";

    // Build weak topics detail
    const weakTopicsDetail = quizPerformance.weakTopics.length > 0
        ? quizPerformance.weakTopics
            .map((t) => {
                const mistakes = t.incorrectQuestions.slice(0, 2)
                    .map(
                        (q) =>
                            `  * ${
                                q.question.substring(0, 80)
                            }... (answered: ${q.userAnswer})`,
                    )
                    .join("\n");
                return `- ${t.topic}: ${t.percentage}% correct (${t.correctCount}/${t.totalCount})\n${mistakes}`;
            })
            .join("\n\n")
        : "No weak areas identified - student is doing well across all topics";

    const prompt =
        `Create a garden-themed study plan for ${settings.subjectName}.

STUDENT CONTEXT:
- Subject: ${settings.subjectName}
- Days until test: ${daysUntilTest}
- Available study time: ${settings.availableHoursPerWeek} hours/week
- Current garden health: ${gardenHealth}%
- Current pass chance: ${settings.currentPassChance || "Not yet calculated"}%

TOPIC MASTERY (From BKT System):
${masteryOverview}

${quizSummary}

UPLOADED STUDY MATERIALS (Use ONLY these files in recommendations):
${materialsOverview}

AREAS THAT NEED WATERING (Weak Performance):
${weakTopicsDetail}

STRONG AREAS (For Reinforcement):
${
            quizPerformance.strongTopics.length > 0
                ? quizPerformance.strongTopics
                    .map((t) =>
                        `- ${t.topic}: ${t.percentage}% correct - ${
                            getStageEmoji(t.percentage)
                        }`
                    )
                    .join("\n")
                : "Building strong areas through practice"
        }

YOUR TASK:
1. Create a warm, encouraging study plan using garden metaphor
2. Focus on the weakest topics first (seedlings that need water)
3. Provide 3-5 specific, actionable recommendations per topic
4. CRITICAL: Every recommendation MUST reference a specific uploaded file by name (fileName and section fields required)
5. Match recommendations to weak topics - if they struggled with "Character Analysis", suggest reading materials that cover character analysis
6. Show clear outcomes: "Do X (Y minutes) → Grow to [stage]"
7. Be realistic with time estimates (10-30 minutes per task)
8. Celebrate progress: "Your garden is at ${gardenHealth}% - you're growing!"
9. NO EXTERNAL RESOURCES: Only use the uploaded materials listed above - no videos, websites, or external exercises

IMPORTANT: If no materials are uploaded, you MUST inform the student to upload materials first. Do not create fake materials or external resources.

Remember: The goal is to make the student feel CAPABLE, not overwhelmed.
Show them a clear, achievable path forward using THEIR uploaded materials.

Generate the study plan in JSON format as specified in the system prompt.`;

    return prompt;
}

/**
 * Helper to get emoji for mastery level
 */
function getStageEmoji(masteryLevel: number): string {
    if (masteryLevel < 40) return "🌱";
    if (masteryLevel < 60) return "🌿";
    if (masteryLevel < 75) return "🌻";
    return "🌳";
}
