/**
 * PersonProfile — generic data model for a person in a case or workflow.
 *
 * This type is intentionally domain-agnostic and contains only structural
 * fields. Concrete personal data and business rules belong in the consumer's
 * data layer.
 */

// ─── Role ─────────────────────────────────────────────────────────────────────

/**
 * The role of this person in the consumer-defined context.
 *
 * - `'applicant'`     — the person seeking the court order / requesting the visit
 * - `'respondent'`    — the person responding to the application
 * - `'primary-carer'` — holds day-to-day physical custody
 * - `'non-resident'`  — lives in a different country from the child
 */
export type PersonRole = 'applicant' | 'respondent' | 'primary-carer' | 'non-resident';

// ─── Behavioral pattern ───────────────────────────────────────────────────────

/**
 * A documented behavioral pattern observed for this profile.
 */
export type BehavioralPattern = {
  /** Short machine-readable identifier, e.g. `'incremental-obstruction'` */
  id: string;
  /** Display label, e.g. `'Incremental obstruction'` */
  label: string;
  /** One-sentence description of the pattern */
  description: string;
  /** Number of documented instances (for evidence weight) */
  evidenceCount?: number;
};

// ─── Legal record ────────────────────────────────────────────────────────────

/**
 * A prior event relevant to the profile context.
 */
export type LegalRecord = {
  /** Date of the ruling / hearing, e.g. `'Feb 2026'` */
  date: string;
  /** What the case was about */
  description: string;
  /** What the judge decided */
  outcome: string;
  /** Optional cost/value context, e.g. `'~$2,000'` */
  costToApplicant?: string;
};

// ─── Communication note ───────────────────────────────────────────────────────

/**
 * A note about communication with this person.
 */
export type CommunicationNote = {
  /** Short label, e.g. `'Always in writing'` */
  label: string;
  /** Explanation */
  detail: string;
};

// ─── PersonProfile ───────────────────────────────────────────────────────────

/**
 * Full profile of one person in a consumer-defined domain.
 *
 * @example
 * ```ts
 * const person: PersonProfile = {
 *   id: 'person-1',
 *   displayName: 'Jane Smith',
 *   role: 'respondent',
 *   location: 'Region A',
 *   language: 'English',
 *   custodyStatus: 'primary contact',
 *   behavioralPatterns: [
 *     {
 *       id: 'pattern-1',
 *       label: 'Escalation under deadline pressure',
 *       description: 'Escalates communication frequency near hard deadlines.',
 *       evidenceCount: 3,
 *     },
 *   ],
 * };
 * ```
 */
export type PersonProfile = {
  /**
   * Stable machine-readable identifier, e.g. `'applicant'` or `'respondent'`.
   * Used as a key — never displayed directly.
   */
  id: string;

  /**
   * Display name — may be anonymised for public use, e.g. `'[Father]'`,
   * or a real first name for internal case documentation.
   */
  displayName: string;

  /** The role this person plays in the relevant context. */
  role: PersonRole;

  /** City and/or country of residence, e.g. `'Melbourne, Australia'`. */
  location: string;

  /** Primary language for written communication. */
  language: string;

  /** Optional status description for the profile context. */
  custodyStatus?: string;

  /**
   * Documented behavioral patterns.
   */
  behavioralPatterns?: BehavioralPattern[];

  /**
   * Prior events relevant to this profile.
   */
  legalHistory?: LegalRecord[];

  /**
   * Practical communication guidance for this person.
   */
  communicationNotes?: CommunicationNote[];

  /** Free-form notes for consumer use. */
  notes?: string[];
};
