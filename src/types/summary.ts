export type SummaryMode = "Mini" | "Default" | "Detailed" | "Max";

export const SUMMARY_OPTIONS: Record<
  SummaryMode,
  { max_length: number; min_length: number; label: string }
> = {
  Mini: { max_length: 50, min_length: 15, label: "Mini (Core gist)" },
  Default: { max_length: 130, min_length: 30, label: "Default (Balanced)" },
  Detailed: { max_length: 250, min_length: 75, label: "Detailed (Nuanced)" },
  Max: { max_length: 400, min_length: 150, label: "Max (Comprehensive)" },
};
