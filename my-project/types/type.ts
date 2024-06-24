export type QuestionType = {
  id: number;
  title: string;
  url: string;
  category: string | null;
  difficulty: string;
  dateCreated: Date;
  lastCompletion: Date;
  reviewDate: Date | null;
  tags: string[];
  lastUpdated: Date;
  ownerId: string;
};

//export an array of QuestionType
export const questionTags: string[] = [
  "ARRAY",
  'STRING',
  'LINKED LIST',
  'RECURSION',
  'MAP/SET',
  'BINARY SEARCH',
  'HEAP/PRIORITY QUEUE',
  'SLIDING WINDOW',
  'STACK/QUEUE',
  'TREE',
  'GRAPH',
  'DYNAMIC PROGRAMMING',
  'GREEDY',
  'SORTING',
  'BACKTRACKING',
  'INTERVALS',
  'MATH&GEOMETRY',
  'BIT MANIPULATION',
  'ALGORITHMN',
]

export const daysToReview: number[] = [1,2,3,5,7,10,14,21,30];
