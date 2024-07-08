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
  completionCount: number;
  ownerId: string;
};

export const TABLE_HEAD :( keyof ColumnSortingType)[] = ["Title", "Difficulty", "Tags", "Next_Review", "Last_Completion", "Actions"];

export const convertColumnTypeToQuestionType = (columnType: keyof ColumnSortingType): keyof QuestionType =>{
    if(columnType === "Title") return "title"
    else if(columnType === "Difficulty") return "difficulty"
    else if(columnType === "Tags") return "tags"
    else if(columnType === "Next_Review") return "reviewDate"
    else return "lastCompletion" 
}

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
  'DESIGN',
]

export const daysToReview: number[] = [1,2,3,5,7,10,14,21,30];


export type ColumnSortingType = {
  Title: number;
  Difficulty: number;
  Tags: number;
  Next_Review: number;
  Last_Completion: number;
  Actions: number
};

export const initialSortingState: ColumnSortingType = {
  Title: 0,
  Difficulty: 0,
  Tags: 0,
  Next_Review: 0,
  Last_Completion: 0,
  Actions: 0
};