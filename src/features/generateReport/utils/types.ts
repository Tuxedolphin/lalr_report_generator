export type TableCell =
  | { text: string; options?: Record<string, unknown> }
  | {
      text: { text: string; options?: Record<string, unknown> }[];
      options?: Record<string, unknown>;
    }
  | { image: { path: string }; options?: Record<string, unknown> };

export type TableRow = TableCell[];
