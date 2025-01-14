export interface SGFProblem {
  uri: any;
  name: string;
  id: number;
}

export interface SGFCategory {
  problems: SGFProblem[];
}

export interface SGFFiles {
  [category: string]: SGFCategory;
}
