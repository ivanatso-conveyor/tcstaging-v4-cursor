/**
 * Trust Center ConveyorAI configuration. Lives on the draft/published snapshot.
 * Figma: Trust Center Vision HQ > Designer > Draft > ConveyorAI Configuration
 */
export type SavedAiAgentConfig = {
  askAiEnabled: boolean;
  surfaceDocuments: boolean;
  allowQuestionnaire: boolean;
  /** @deprecated kept for backward compat during migration */
  buttonLabel?: string;
  /** @deprecated kept for backward compat during migration */
  agentInstructions?: string;
};

export const DEFAULT_SAVED_AI_AGENT_CONFIG: SavedAiAgentConfig = {
  askAiEnabled: true,
  surfaceDocuments: true,
  allowQuestionnaire: false,
  buttonLabel: '',
  agentInstructions: '',
};
