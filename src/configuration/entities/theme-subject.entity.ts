export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
}
