export interface IIssue {
  id: number;
  title: string;
  description: string;
  status: string;
  type: string;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}
