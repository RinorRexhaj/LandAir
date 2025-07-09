export type ToolOutput =
  | { answer: string }
  | { output: { code: ChangeOutput[]; summary: string } };

export type ChangeOutput = {
  selector: string;
  code: string;
  action: "add" | "edit" | "delete";
};

export interface Relevance {
  type: string;
  updates: {
    _id: number;
    output: {
      output: ToolOutput;
    };
  }[];
}
