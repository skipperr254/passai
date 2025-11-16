import { openai } from "@/lib/ai/openai";

type GeneratedQuestionsType = {
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  concept: string; // Specific concept being tested (for BKT tracking)
  points: number;
  source_snippet: string;
};

export const generateQuizQuestions = async (
  combinedText: string,
  settings: {
    questionCount: number;
    subjectName: string;
    difficulty: "easy" | "medium" | "hard" | "adaptive";
    questionTypes: {
      multipleChoice: boolean;
      trueFalse: boolean;
      shortAnswer: boolean;
      matching: boolean;
    };
    cognitiveMix: {
      recall: number;
      understanding: number;
      application: number;
    };
    focusAreas: string;
  }
): Promise<GeneratedQuestionsType[]> => {
  // Truncate material content if too long (keep under ~6000 tokens for safety)
  const maxContentLength = 8000;
  const truncatedContent =
    combinedText.length > maxContentLength
      ? combinedText.substring(0, maxContentLength) +
        "\n\n[Content truncated...]"
      : combinedText;

  // Build system prompt
  const systemPrompt = `
      You are an expert educational quiz generator. Your task is to create high-quality, engaging quiz questions based on study materials.

      CRITICAL REQUIREMENTS:
      1. You MUST respond with a valid JSON object containing a "questions" array
      2. The response format MUST be: {"questions": [... array of question objects ...]}
      3. NEVER return a single question object - ALWAYS return an array even if generating just one question
      4. No additional text, explanations, or markdown formatting outside the JSON
      5. ONLY generate "multiple-choice" and "true-false" questions
      6. NEVER add letter prefixes (A., B., C., D.) to options - provide plain text only

      Generate questions that:
      1. Test understanding, not just memorization
      2. Are clear, concise, and unambiguous
      3. Have accurate answers with helpful explanations
      4. Match the requested difficulty level
      5. Cover key concepts from the material
      6. Each question MUST identify a SPECIFIC CONCEPT being tested (for knowledge tracking)

      CONCEPT IDENTIFICATION:
      - For each question, identify the SPECIFIC concept/topic being tested
      - Concepts should be precise and granular (e.g., "Photosynthesis" not just "Biology")
      - Examples: "Mitochondrial Function", "Pythagorean Theorem", "French Revolution Causes"
      - This concept will be used to track student mastery over time

      Question types ALLOWED:
      - multiple-choice: Exactly 4 plain text options with one correct answer (NO "A. ", "B. " prefixes)
      - true-false: Statement with exactly 2 options: ["True", "False"]

      Question types NOT ALLOWED:
      - short-answer
      - essay
      - fill-in-the-blank
      - matching

      Difficulty levels:
      - easy: Basic recall and comprehension
      - medium: Application and analysis
      - hard: Synthesis and evaluation
    `;

  // Build user prompt
  const userPrompt = `
        Generate ${settings.questionCount} ${
    settings.difficulty
  } difficulty quiz questions from the following study material.

        ${settings.subjectName ? `Subject: ${settings.subjectName}` : ""}

        Study Material:
        ${truncatedContent}

        Response format - you MUST use this EXACT structure:
        {
          "questions": [
            {
              "question": "The question text",
              "type": "multiple-choice" | "true-false",
              "options": ["First option", "Second option", "Third option", "Fourth option"] for multiple-choice, 4 options, NO "A. ", "B. " prefixes or ["True", "False"] for true-false,
              "correct_answer": "0" | "1" | "2" | "3" for MCQ or "true" | "false" for true-false. Give the index of the correct answer in the options array for multiple-choice. For true-false, use "true" or "false",
              "explanation": "Why this answer is correct and what concept it tests",
              "difficulty": "easy" | "medium" | "hard",
              "topic": "General topic area", // Broad topic category
              "concept": "Specific concept name", // REQUIRED: Specific, granular concept being tested (e.g., "Cellular Respiration", "Quadratic Formula", "Treaty of Versailles")
              "points": 1-5 // Points based on difficulty: easy=1, medium=2-3, hard=4-5
              "source_snippet": "excerpt from the material that relates to this question" // The part of the material this question is based on. They can read that section to understand the context.
            }
            // ... ${settings.questionCount} total questions
          ]
        }

      CRITICAL: Every question MUST include a "concept" field with a specific, meaningful concept name. This is used for tracking student mastery over time.

      Question type distribution:
      - 70% multiple-choice (4 options each)
      - 30% true-false (2 options each)

      CRITICAL: Your response MUST be a JSON object with a "questions" array containing ${
        settings.questionCount
      } question objects. DO NOT return anything else.
      `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }, // For structured output
  });

  const responseText = completion.choices[0]?.message?.content;

  const jsonResponse = JSON.parse(responseText || "{}");

  console.log("OpenAI Response:", jsonResponse); // TODO: Come back and verify that we indeed do get the questions array

  return jsonResponse.questions || [];
};
