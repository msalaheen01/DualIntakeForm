import type { IssueCategory, Language, Urgency } from "./types";

export const LABELS: Record<
  Language,
  {
    appTitle: string;
    intakeTitle: string;
    dashboardTitle: string;
    languageToggle: string;
    english: string;
    bangla: string;
    sectionConstituent: string;
    sectionCase: string;
    fullName: string;
    phone: string;
    email: string;
    preferredLanguage: string;
    addressBronx: string;
    issueCategory: string;
    description: string;
    urgency: string;
    submit: string;
    created: string;
    status: string;
    pending: string;
    escalated: string;
    resolved: string;
    agency: string;
    notes: string;
    addNote: string;
    filters: string;
    filterStatus: string;
    filterCategory: string;
    all: string;
    totalCases: string;
    pendingCases: string;
    avgDaysOpen: string;
    mostCommonCategory: string;
    daysSince: string;
    dateSubmitted: string;
    urgencyShort: string;
    validationBronx: string;
    home: string;
    goToIntake: string;
    goToDashboard: string;
    caseCreated: string;
    viewDashboard: string;
    trends: string;
    caseId: string;
  }
> = {
  en: {
    appTitle: "District Office – Constituent Intake & Case Tracking",
    intakeTitle: "Constituent Intake Form",
    dashboardTitle: "Case Tracking Dashboard",
    languageToggle: "Language",
    english: "English",
    bangla: "বাংলা",
    sectionConstituent: "Constituent Information",
    sectionCase: "Case Details",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email",
    preferredLanguage: "Preferred Language",
    addressBronx: "Address (Bronx only)",
    issueCategory: "Issue Category",
    description: "Description of Issue",
    urgency: "Urgency Level",
    submit: "Submit",
    created: "Case created",
    status: "Status",
    pending: "Pending",
    escalated: "Escalated",
    resolved: "Resolved",
    agency: "Agency",
    notes: "Follow-up Notes",
    addNote: "Add Note",
    filters: "Filters",
    filterStatus: "Status",
    filterCategory: "Category",
    all: "All",
    totalCases: "Total Cases",
    pendingCases: "Pending Cases",
    avgDaysOpen: "Average Days Open",
    mostCommonCategory: "Most Common Category",
    daysSince: "Days Since Submitted",
    dateSubmitted: "Date Submitted",
    urgencyShort: "Urgency",
    validationBronx: "Address must be in the Bronx (include 'Bronx' or use a ZIP code starting with 104).",
    home: "Home",
    goToIntake: "New Intake",
    goToDashboard: "Case Dashboard",
    caseCreated: "Case created",
    viewDashboard: "View Dashboard",
    trends: "Trends by Category",
    caseId: "Case ID",
  },
  bn: {
    appTitle: "জেলা অফিস – অভিযোগ দাখিল ও মামলা তদারকি",
    intakeTitle: "অভিযোগ দাখিল ফর্ম",
    dashboardTitle: "মামলা তদারকি ড্যাশবোর্ড",
    languageToggle: "ভাষা",
    english: "English",
    bangla: "বাংলা",
    sectionConstituent: "অভিযোগকারীর তথ্য",
    sectionCase: "মামলার বিবরণ",
    fullName: "পূর্ণ নাম",
    phone: "ফোন নম্বর",
    email: "ইমেইল",
    preferredLanguage: "পছন্দের ভাষা",
    addressBronx: "ঠিকানা (শুধুমাত্র ব্রংক্স)",
    issueCategory: "সমস্যার ধরণ",
    description: "সমস্যার বিবরণ",
    urgency: "জরুরিতার মাত্রা",
    submit: "জমা দিন",
    created: "মামলা তৈরি হয়েছে",
    status: "অবস্থা",
    pending: "অপেক্ষমাণ",
    escalated: "উর্ধ্বগামী",
    resolved: "নিষ্পত্তি",
    agency: "সংস্থা",
    notes: "অনুসরণ নোট",
    addNote: "নোট যোগ করুন",
    filters: "ফিল্টার",
    filterStatus: "অবস্থা",
    filterCategory: "ধরণ",
    all: "সব",
    totalCases: "মোট মামলা",
    pendingCases: "অপেক্ষমাণ মামলা",
    avgDaysOpen: "গড় খোলা দিন",
    mostCommonCategory: "সবচেয়ে সাধারণ ধরণ",
    daysSince: "দাখিলের পর দিন",
    dateSubmitted: "দাখিলের তারিখ",
    urgencyShort: "জরুরিতা",
    validationBronx:
      "ঠিকানায় ব্রংক্স থাকতে হবে অথবা জিপ কোড ১০৪ দিয়ে শুরু হতে হবে।",
    home: "হোম",
    goToIntake: "নতুন দাখিল",
    goToDashboard: "মামলা ড্যাশবোর্ড",
    caseCreated: "মামলা তৈরি হয়েছে",
    viewDashboard: "ড্যাশবোর্ড দেখুন",
    trends: "ধরণ অনুযায়ী প্রবণতা",
    caseId: "মামলা নম্বর",
  },
};

export const CATEGORY_LABELS: Record<Language, Record<IssueCategory, string>> = {
  en: {
    Housing: "Housing",
    NYCHA: "NYCHA",
    Sanitation: "Sanitation",
    "Public Benefits": "Public Benefits",
    Immigration: "Immigration",
    Education: "Education",
    Other: "Other",
  },
  bn: {
    Housing: "বাসস্থান",
    NYCHA: "এনওয়াইসিএইচএ",
    Sanitation: "পরিচ্ছন্নতা",
    "Public Benefits": "সরকারি সুবিধা",
    Immigration: "অভিবাসন",
    Education: "শিক্ষা",
    Other: "অন্যান্য",
  },
};

export const URGENCY_LABELS: Record<Language, Record<Urgency, string>> = {
  en: {
    Low: "Low",
    Medium: "Medium",
    High: "High",
  },
  bn: {
    Low: "নিম্ন",
    Medium: "মাঝারি",
    High: "উচ্চ",
  },
};
