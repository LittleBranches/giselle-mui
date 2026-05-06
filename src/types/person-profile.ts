/**
 * PersonProfile — data model for a person in a cross-border family dispute.
 *
 * Designed for use in the Parents Across Borders (PAB) module and any
 * case-documentation page that needs to display the parties involved in a
 * family law / international custody situation.
 *
 * Contains no personal data — that lives in the consumer's data layer.
 * This file defines only the shape.
 */

// ─── Role ─────────────────────────────────────────────────────────────────────

/**
 * The role of this person in the case.
 *
 * - `'applicant'`     — the person seeking the court order / requesting the visit
 * - `'respondent'`    — the person responding to the application
 * - `'primary-carer'` — holds day-to-day physical custody
 * - `'non-resident'`  — lives in a different country from the child
 */
export type PersonRole = 'applicant' | 'respondent' | 'primary-carer' | 'non-resident';

// ─── Behavioral pattern ───────────────────────────────────────────────────────

/**
 * A documented behavioral pattern observed in a parent's conduct.
 * Used to build a profile for strategic communication planning.
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
 * A prior legal event relevant to the case (court hearing, ruling, settlement).
 */
export type LegalRecord = {
  /** Date of the ruling / hearing, e.g. `'Feb 2026'` */
  date: string;
  /** What the case was about */
  description: string;
  /** What the judge decided */
  outcome: string;
  /** Approximate legal cost to the applicant, e.g. `'~€2,000'` */
  costToApplicant?: string;
};

// ─── Communication note ───────────────────────────────────────────────────────

/**
 * A note about how to communicate with this parent — what works, what to avoid.
 */
export type CommunicationNote = {
  /** Short label, e.g. `'Always in writing'` */
  label: string;
  /** Explanation */
  detail: string;
};

// ─── PersonProfile ───────────────────────────────────────────────────────────

/**
 * Full profile of one person in a cross-border family dispute.
 *
 * Used by the Parents Across Borders (PAB) module to display the parties
 * involved, document behavioral patterns, and guide communication strategy.
 *
 * @example
 * ```ts
 * const respondentProfile: PersonProfile = {
 *   id: 'respondent',
 *   displayName: '[Mother]',
 *   role: 'respondent',
 *   location: 'Country A',
 *   language: 'Slovenian',
 *   custodyStatus: 'sole physical custody',
 *   behavioralPatterns: [
 *     {
 *       id: 'asymmetric-rule-enforcement',
 *       label: 'Asymmetric rule enforcement',
 *       description:
 *         'Enforces rules on the other parent that she does not follow herself.',
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

  /** The role this person plays in the dispute. */
  role: PersonRole;

  /** City and/or country of residence, e.g. `'Melbourne, Australia'`. */
  location: string;

  /** Primary language for written communication. */
  language: string;

  /** Custody status description, e.g. `'sole physical custody'`. */
  custodyStatus?: string;

  /**
   * Documented behavioral patterns. Used for strategic communication planning.
   * Each pattern should have at least one recorded evidence instance before
   * being added here.
   */
  behavioralPatterns?: BehavioralPattern[];

  /**
   * Prior legal events relevant to the case.
   * Document outcomes and costs — the record matters.
   */
  legalHistory?: LegalRecord[];

  /**
   * Practical communication guidance for this parent.
   * What works. What to avoid. What triggers escalation.
   */
  communicationNotes?: CommunicationNote[];

  /** Free-form strategic notes — internal use only, never displayed publicly. */
  notes?: string[];
};
