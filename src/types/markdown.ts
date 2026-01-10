export interface MarkdownContent {
  number: number;
  body: string;
  title: string;
  created_at: string;
  updated_at: string;
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string;
  }>;
}

export interface MarkdownCache {
  [key: number]: MarkdownContent;
}
