/**
 * BKT Algorithm Test Suite
 *
 * This file contains manual tests to verify the BKT implementation.
 * Run these scenarios to ensure the algorithm behaves correctly.
 */

import {
  BayesianKnowledgeTracing,
  isTopicMastered,
  calculateAverageMastery,
} from "./bkt";

/**
 * Test 1: Initial state
 */
function testInitialState() {
  console.log("=== Test 1: Initial State ===");

  const bkt = new BayesianKnowledgeTracing();
  const state = bkt.getState();

  console.log("Initial P(L0):", state.pInit);
  console.log("Initial P(Known):", state.pKnown);
  console.log("Initial Mastery Level:", bkt.getMasteryLevel(), "%");
  console.log("Expected: P(Known) should equal P(L0) = 0.3 (30%)");
  console.log("✓ Pass:", state.pKnown === 0.3 && bkt.getMasteryLevel() === 30);
  console.log("");
}

/**
 * Test 2: All correct answers
 */
function testAllCorrect() {
  console.log("=== Test 2: All Correct Answers ===");

  const bkt = new BayesianKnowledgeTracing();
  console.log("Initial Mastery:", bkt.getMasteryLevel(), "%");

  // Answer 5 questions correctly
  for (let i = 1; i <= 5; i++) {
    bkt.update(true);
    console.log(`After ${i} correct: ${bkt.getMasteryLevel()}%`);
  }

  const finalMastery = bkt.getMasteryLevel();
  console.log("Final Mastery:", finalMastery, "%");
  console.log("Expected: Mastery should increase significantly (>70%)");
  console.log("✓ Pass:", finalMastery > 70);
  console.log("");
}

/**
 * Test 3: All incorrect answers
 */
function testAllIncorrect() {
  console.log("=== Test 3: All Incorrect Answers ===");

  const bkt = new BayesianKnowledgeTracing();
  console.log("Initial Mastery:", bkt.getMasteryLevel(), "%");

  // Answer 5 questions incorrectly
  for (let i = 1; i <= 5; i++) {
    bkt.update(false);
    console.log(`After ${i} incorrect: ${bkt.getMasteryLevel()}%`);
  }

  const finalMastery = bkt.getMasteryLevel();
  console.log("Final Mastery:", finalMastery, "%");
  console.log("Expected: Mastery should decrease significantly (<20%)");
  console.log("✓ Pass:", finalMastery < 20);
  console.log("");
}

/**
 * Test 4: Mixed results (improving performance)
 */
function testMixedImproving() {
  console.log("=== Test 4: Mixed Results (Improving) ===");

  const bkt = new BayesianKnowledgeTracing();
  console.log("Initial Mastery:", bkt.getMasteryLevel(), "%");

  // Start weak, then improve
  const answers = [false, false, true, true, true, true, true];

  answers.forEach((correct, i) => {
    bkt.update(correct);
    console.log(
      `After Q${i + 1} (${correct ? "✓" : "✗"}): ${bkt.getMasteryLevel()}%`
    );
  });

  const finalMastery = bkt.getMasteryLevel();
  console.log("Final Mastery:", finalMastery, "%");
  console.log("Expected: Should show learning progression (50-80%)");
  console.log("✓ Pass:", finalMastery >= 50 && finalMastery <= 80);
  console.log("");
}

/**
 * Test 5: Batch update
 */
function testBatchUpdate() {
  console.log("=== Test 5: Batch Update ===");

  const bkt1 = new BayesianKnowledgeTracing();
  const bkt2 = new BayesianKnowledgeTracing();

  const answers = [true, true, false, true, true];

  // Sequential updates
  answers.forEach((a) => bkt1.update(a));

  // Batch update
  bkt2.batchUpdate(answers);

  const mastery1 = bkt1.getMasteryLevel();
  const mastery2 = bkt2.getMasteryLevel();

  console.log("Sequential result:", mastery1, "%");
  console.log("Batch result:", mastery2, "%");
  console.log("Expected: Both should match");
  console.log("✓ Pass:", mastery1 === mastery2);
  console.log("");
}

/**
 * Test 6: Topic mastered check
 */
function testTopicMastered() {
  console.log("=== Test 6: Topic Mastered Check ===");

  console.log("Initial (30%):", isTopicMastered(0.3), "- Expected: false");
  console.log("70%:", isTopicMastered(0.7), "- Expected: false");
  console.log("80%:", isTopicMastered(0.8), "- Expected: true");
  console.log("90%:", isTopicMastered(0.9), "- Expected: true");
  console.log(
    "Custom threshold 60%:",
    isTopicMastered(0.65, 0.6),
    "- Expected: true"
  );
  console.log("");
}

/**
 * Test 7: Average mastery calculation
 */
function testAverageMastery() {
  console.log("=== Test 7: Average Mastery Calculation ===");

  const topicProbs = [0.8, 0.6, 0.9, 0.7]; // 80%, 60%, 90%, 70%
  const average = calculateAverageMastery(topicProbs);

  console.log("Topic probabilities:", topicProbs);
  console.log("Average mastery:", average, "%");
  console.log("Expected: 75% (average of 80, 60, 90, 70)");
  console.log("✓ Pass:", average === 75);
  console.log("");
}

/**
 * Test 8: Predict next correct
 */
function testPredictNextCorrect() {
  console.log("=== Test 8: Predict Next Correct ===");

  const bkt = new BayesianKnowledgeTracing();

  console.log(
    "Initial prediction:",
    (bkt.predictNextCorrect() * 100).toFixed(1),
    "%"
  );

  // After some correct answers
  bkt.batchUpdate([true, true, true]);
  console.log(
    "After 3 correct:",
    (bkt.predictNextCorrect() * 100).toFixed(1),
    "%"
  );
  console.log("Expected: Prediction should increase");

  // After some incorrect answers
  bkt.batchUpdate([false, false]);
  console.log(
    "After 2 incorrect:",
    (bkt.predictNextCorrect() * 100).toFixed(1),
    "%"
  );
  console.log("Expected: Prediction should decrease");
  console.log("");
}

/**
 * Run all tests
 */
export function runBKTTests() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  BKT Algorithm Test Suite              ║");
  console.log("╚════════════════════════════════════════╝");
  console.log("");

  testInitialState();
  testAllCorrect();
  testAllIncorrect();
  testMixedImproving();
  testBatchUpdate();
  testTopicMastered();
  testAverageMastery();
  testPredictNextCorrect();

  console.log("╔════════════════════════════════════════╗");
  console.log("║  All Tests Complete!                   ║");
  console.log("╚════════════════════════════════════════╝");
}

// Uncomment to run tests manually:
// runBKTTests();
