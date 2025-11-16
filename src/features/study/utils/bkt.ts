/**
 * Bayesian Knowledge Tracing (BKT) Implementation
 *
 * This class implements the BKT algorithm for tracking a learner's knowledge state over time.
 * It estimates the probability that a student has mastered a skill based on their performance.
 *
 * Key Parameters:
 * - P(L0): Initial probability that student knows the skill (0-1)
 * - P(T): Probability of learning transition (learning rate) (0-1)
 * - P(G): Probability of guessing correctly when not knowing (0-1)
 * - P(S): Probability of slip (making mistake when knowing) (0-1)
 *
 * Reference: Based on Bayesian Knowledge Tracing model from educational psychology research
 */

export interface BKTParameters {
  /** Initial probability the learner knows the skill (P(L0)) */
  pInit: number;
  /** Probability of learning if the student doesn't know the skill (P(T)) */
  pTransit: number;
  /** Probability of guessing correctly if the student doesn't know (P(G)) */
  pGuess: number;
  /** Probability of making a mistake when the skill is known (P(S) = 1 - pSlip) */
  pSlip: number;
}

export interface BKTState {
  /** Current probability that the learner knows the skill (P(L)) */
  pKnown: number;
  /** Probability that the learner has learned the skill (P(Learned)) */
  pLearned: number;
}

export class BayesianKnowledgeTracing {
  private pInit: number; // P(L0) - Initial knowledge
  private pTransit: number; // P(T) - Learning rate
  private pGuess: number; // P(G) - Guessing rate
  private pSlip: number; // P(S) - Slip rate
  private pKnown: number; // Current knowledge probability

  /**
   * Initialize the BKT model with parameters
   *
   * @param params - BKT parameters or use defaults
   */
  constructor(params?: Partial<BKTParameters>) {
    this.pInit = params?.pInit ?? 0.3; // Default: 30% initial knowledge
    this.pTransit = params?.pTransit ?? 0.1; // Default: 10% learning rate per attempt
    this.pGuess = params?.pGuess ?? 0.25; // Default: 25% guessing (1/4 for multiple choice)
    this.pSlip = params?.pSlip ?? 0.1; // Default: 10% slip rate
    this.pKnown = this.pInit; // Start with initial knowledge probability
  }

  /**
   * Update knowledge probability based on answer correctness
   * Uses Bayes' Theorem to update beliefs about learner's knowledge
   *
   * @param answerCorrect - True if student answered correctly, false otherwise
   * @returns Updated knowledge probability (P(L))
   */
  update(answerCorrect: boolean): number {
    if (answerCorrect) {
      // Correct answer update formula:
      // P(L_t | correct) = P(S) * P(L_{t-1}) / [P(S) * P(L_{t-1}) + P(G) * (1 - P(L_{t-1}))]
      // Where P(S) = 1 - pSlip (probability of getting it right when knowing)

      const pSkill = 1 - this.pSlip; // P(S) - probability of correct when knowing
      const numerator = pSkill * this.pKnown;
      const denominator =
        pSkill * this.pKnown + this.pGuess * (1 - this.pKnown);

      this.pKnown = numerator / denominator;
    } else {
      // Incorrect answer update formula:
      // P(L_t | incorrect) = P(S) * P(L_{t-1}) / [P(S) * P(L_{t-1}) + (1 - P(G)) * (1 - P(L_{t-1}))]
      // Where P(S) = pSlip (probability of making mistake when knowing)

      const numerator = this.pSlip * this.pKnown;
      const denominator =
        this.pSlip * this.pKnown + (1 - this.pGuess) * (1 - this.pKnown);

      this.pKnown = numerator / denominator;
    }

    // Ensure probability stays within valid range [0, 1]
    this.pKnown = Math.max(0, Math.min(1, this.pKnown));

    return this.pKnown;
  }

  /**
   * Batch update: Process multiple answers sequentially
   *
   * @param answers - Array of booleans indicating correct/incorrect answers
   * @returns Final knowledge probability after all updates
   */
  batchUpdate(answers: boolean[]): number {
    for (const answer of answers) {
      this.update(answer);
    }
    return this.pKnown;
  }

  /**
   * Get current knowledge probability
   *
   * @returns Current P(L) - probability that learner knows the skill
   */
  getKnowledgeProbability(): number {
    return this.pKnown;
  }

  /**
   * Get current mastery level as percentage (0-100)
   *
   * @returns Mastery level from 0 to 100
   */
  getMasteryLevel(): number {
    return Math.round(this.pKnown * 100);
  }

  /**
   * Calculate probability that the learner has learned the skill
   * This considers the learning transition rate
   *
   * @returns P(Learned) - probability of having learned
   */
  getLearnedProbability(): number {
    // P(Learned) = P(L) + (1 - P(L)) * P(T)
    const pLearned = this.pKnown + (1 - this.pKnown) * this.pTransit;
    return Math.max(0, Math.min(1, pLearned));
  }

  /**
   * Reset to initial state with new parameters (optional)
   *
   * @param params - New BKT parameters (optional)
   */
  reset(params?: Partial<BKTParameters>): void {
    if (params?.pInit !== undefined) this.pInit = params.pInit;
    if (params?.pTransit !== undefined) this.pTransit = params.pTransit;
    if (params?.pGuess !== undefined) this.pGuess = params.pGuess;
    if (params?.pSlip !== undefined) this.pSlip = params.pSlip;

    this.pKnown = this.pInit;
  }

  /**
   * Set current knowledge probability (useful for loading existing state)
   *
   * @param pKnown - Knowledge probability to set (0-1)
   */
  setKnowledgeProbability(pKnown: number): void {
    this.pKnown = Math.max(0, Math.min(1, pKnown));
  }

  /**
   * Get all current BKT parameters and state
   *
   * @returns Object with all parameters and current state
   */
  getState(): BKTParameters & BKTState {
    return {
      pInit: this.pInit,
      pTransit: this.pTransit,
      pGuess: this.pGuess,
      pSlip: this.pSlip,
      pKnown: this.pKnown,
      pLearned: this.getLearnedProbability(),
    };
  }

  /**
   * Predict probability of correct answer on next question
   * P(Correct) = P(L) * (1 - P(S)) + (1 - P(L)) * P(G)
   *
   * @returns Probability of answering next question correctly (0-1)
   */
  predictNextCorrect(): number {
    const pCorrect =
      this.pKnown * (1 - this.pSlip) + (1 - this.pKnown) * this.pGuess;
    return Math.max(0, Math.min(1, pCorrect));
  }
}

/**
 * Create a BKT instance from existing database state
 *
 * @param dbState - State from topic_mastery table
 * @returns Initialized BKT instance
 */
export function createBKTFromState(dbState: {
  p_init: number;
  p_transit: number;
  p_guess: number;
  p_slip: number;
  p_known: number;
}): BayesianKnowledgeTracing {
  const bkt = new BayesianKnowledgeTracing({
    pInit: dbState.p_init,
    pTransit: dbState.p_transit,
    pGuess: dbState.p_guess,
    pSlip: dbState.p_slip,
  });

  bkt.setKnowledgeProbability(dbState.p_known);

  return bkt;
}

/**
 * Helper to calculate mastery level from multiple topics
 * Useful for overall subject mastery calculation
 *
 * @param topicProbabilities - Array of P(L) values for each topic
 * @returns Average mastery level (0-100)
 */
export function calculateAverageMastery(topicProbabilities: number[]): number {
  if (topicProbabilities.length === 0) return 0;

  const sum = topicProbabilities.reduce((acc, p) => acc + p, 0);
  const average = sum / topicProbabilities.length;

  return Math.round(average * 100);
}

/**
 * Helper to determine if a topic is mastered based on threshold
 *
 * @param pKnown - Current knowledge probability
 * @param threshold - Minimum probability to consider mastered (default: 0.8 = 80%)
 * @returns True if topic is mastered
 */
export function isTopicMastered(
  pKnown: number,
  threshold: number = 0.8
): boolean {
  return pKnown >= threshold;
}
