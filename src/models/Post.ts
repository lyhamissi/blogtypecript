export interface Post {
  id: number;
  title: string;
  body: string;
  author: number;
  created_at?: Date;
  updated_at?: Date;
}
