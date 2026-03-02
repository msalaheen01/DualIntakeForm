export type CaseStatus = "Pending" | "Escalated" | "Resolved";

export type Language = "en" | "bn";

export type IssueCategory =
  | "Housing"
  | "NYCHA"
  | "Sanitation"
  | "Public Benefits"
  | "Immigration"
  | "Education"
  | "Other";

export type Urgency = "Low" | "Medium" | "High";

export interface CaseRecord {
  caseId: string;
  fullName: string;
  phone: string;
  email: string;
  preferredLanguage: Language;
  address: string;
  issueCategory: IssueCategory;
  description: string;
  urgency: Urgency;
  status: CaseStatus;
  dateSubmitted: string;
  agency: string;
  followUpNotes: Array<{ date: string; note: string }>;
  assignedTo: string;
  lastUpdated: string;
  dateResolved?: string;
}
