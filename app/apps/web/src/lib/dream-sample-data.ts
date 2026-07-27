import type { DreamEventSummary, TeacherParticipation } from "@29with/shared";

export const dreamEvents: DreamEventSummary[] = [
  {
    id: "dream-parkas-13",
    title: "Parkas 29s Film Festival",
    eventType: "TWENTY_NINE_SECONDS",
    status: "SUBMISSION_RUNNING",
    contestPeriod: "2026.07.01 - 2026.08.20",
    submissionDeadlineLabel: "D-5",
    topic: "Healthy youth challenge",
    prize: "KRW 20,000,000",
    selectedSchoolCount: 42,
    expectedSubmissionCount: 186,
    confirmedSubmissionCount: 151,
    reviewRequiredCount: 9,
    mailQueueCount: 3
  },
  {
    id: "dream-growth-1",
    title: "Shared Growth 29 Shortform King",
    eventType: "SHORTFORM_KING",
    status: "SUBMISSION_RUNNING",
    contestPeriod: "2026.07.10 - 2026.08.31",
    submissionDeadlineLabel: "D-12",
    topic: "Growing together",
    prize: "KRW 10,000,000",
    selectedSchoolCount: 14,
    expectedSubmissionCount: 64,
    confirmedSubmissionCount: 47,
    reviewRequiredCount: 3,
    mailQueueCount: 2
  },
  {
    id: "dream-chef-1",
    title: "Simple Chef 29 Shortform King",
    eventType: "SHORTFORM_KING",
    status: "SCORE_REPORT_RUNNING",
    contestPeriod: "2026.06.01 - 2026.07.20",
    submissionDeadlineLabel: "Closed",
    topic: "Simple and reliable meals",
    prize: "KRW 5,000,000",
    selectedSchoolCount: 9,
    expectedSubmissionCount: 36,
    confirmedSubmissionCount: 31,
    reviewRequiredCount: 0,
    mailQueueCount: 1
  }
];

export const teacherParticipations: TeacherParticipation[] = [
  {
    id: "teacher-parkas",
    dreamEventId: "dream-parkas-13",
    eventTitle: "Parkas 29s Film Festival",
    eventType: "TWENTY_NINE_SECONDS",
    schoolName: "Banghak Middle School",
    affiliationName: "Banghak Middle School",
    teacherName: "Haeun Kang",
    trustStatus: "BENEFIT",
    expectedSubmissionCount: 5,
    confirmedSubmissionCount: 4,
    certificateStatus: "NOT_READY",
    scoreReportStatus: "NOT_READY",
    snackSupportLabel: "Expected on 2026.08.30",
    nextAction: "Please review one unmatched submission.",
    works: [
      {
        id: "work-1",
        title: "Changed Speed",
        directorOrEntrant: "Heea Kim",
        affiliationName: "Banghak Middle School",
        submissionUrl: "https://29sfilm.example/works/1",
        preliminaryScore: 4.1,
        rank: 1,
        finalRoundStatus: "ADVANCED",
        matchStatus: "MATCHED",
        matchReason: "School name and affiliation match exactly."
      },
      {
        id: "work-2",
        title: "Complex Worries",
        directorOrEntrant: "Yurim Noh",
        affiliationName: "Banghak Middle School",
        submissionUrl: "https://29sfilm.example/works/2",
        preliminaryScore: 3.8,
        rank: 2,
        finalRoundStatus: "NOT_ADVANCED",
        matchStatus: "MATCHED",
        matchReason: "School name and affiliation match exactly."
      },
      {
        id: "work-3",
        title: "Walking Slowly",
        directorOrEntrant: "Daon Lee",
        affiliationName: "Banghak Middle",
        preliminaryScore: 3.5,
        rank: 3,
        finalRoundStatus: "NOT_ADVANCED",
        matchStatus: "NEEDS_REVIEW",
        matchReason: "Similar affiliation detected. Admin review is required."
      }
    ]
  },
  {
    id: "teacher-growth",
    dreamEventId: "dream-growth-1",
    eventTitle: "Shared Growth 29 Shortform King",
    eventType: "SHORTFORM_KING",
    schoolName: "Banghak Middle School",
    affiliationName: "Banghak Middle School B",
    teacherName: "Haeun Kang",
    trustStatus: "NORMAL",
    expectedSubmissionCount: 3,
    confirmedSubmissionCount: 2,
    certificateStatus: "NOT_READY",
    scoreReportStatus: "NOT_READY",
    snackSupportLabel: "Under admin review",
    nextAction: "Please confirm the team name suffix B.",
    works: [
      {
        id: "work-4",
        title: "A Shared View",
        directorOrEntrant: "Chaewon Ahn",
        affiliationName: "Banghak Middle School B",
        submissionUrl: "https://shortform.example/works/4",
        preliminaryScore: 7,
        rank: 1,
        finalRoundStatus: "NOT_USED",
        matchStatus: "MATCHED",
        matchReason: "School name and team name match exactly."
      }
    ]
  }
];
