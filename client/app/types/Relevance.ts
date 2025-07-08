export type ToolOutput =
  | { answer: string }
  | { output: { code: { selector: string; code: string }[]; summary: string } };

export interface Relevance {
  type: string;
  updates: {
    _id: number;
    output: {
      output: ToolOutput;
    };
  }[];
}
