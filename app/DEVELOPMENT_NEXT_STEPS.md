# Development Next Steps

## Current Status

The initial 29 WITH project scaffold is ready, and a richer self-contained browser test app exists at:

```text
../outputs/29with-test-app/index.html
```

Created:

- monorepo package structure
- Next.js web app scaffold
- NestJS API scaffold
- shared domain types
- Prisma schema draft
- admin/teacher dashboard preview components
- environment example
- self-contained admin/teacher Dream Project test app
- local validation script for test-app page/action coverage

Dependencies are not installed yet.

## Next Milestone

Promote the tested prototype flows into the Next.js app and API. The test app currently covers:

```text
admin role switch
→ select overlapping Dream Project event
→ event creation/edit/deactivation and operation
→ application and selection
→ selection recommendation guidance and target-work warning
→ newspaper coupon assignment
→ Excel upload submission matching/manual matching
→ matching failure reason and teacher check request
→ final submission-list approval
→ snack support
→ certificate approval
→ score sync/publication
→ document availability messaging
→ mail review/sending
→ Excel/admin settings save/format check
→ teacher project dashboard
→ teacher project switcher and application-status visibility
→ teacher work/benefit/document/request flows
→ teacher profile save and affiliation confirmation
→ member/school memo management
→ coupon inventory upload
→ certificate template upload
→ admin account management
→ mail template management
→ admin workbox and export/download test flows
→ search filters for application, member, and submission management
→ bulk application actions for selection, waitlist, rejection, mail resend, and export
→ close/history summary
```

Use `../outputs/29with-test-app/README.md` as the QA checklist before replacing mock state with API-backed state.
Keep the responsive behavior from the test app: desktop sidebar shell, tablet single-column shell, mobile stacked action controls, and horizontally scrollable dense tables.

## Implementation Order

1. Install dependencies and verify web/API boot.
2. Finalize Prisma schema syntax with `prisma validate`.
3. Port the test app state model into typed frontend view models.
4. Replace the preview dashboard components with the full tested admin/teacher shell.
5. Add authentication models and session strategy.
6. Build admin event creation/edit/deactivation APIs.
7. Build teacher application APIs.
8. Build selection recommendation service:
   - first-come order
   - faithful-participation priority
   - no-show/issue history penalty
   - target-work overrun warning
9. Build selection transaction:
   - application status change
   - participation creation
   - submission slot creation
   - scheduled selection mail creation
   - audit log
10. Build teacher profile update and affiliation-confirmation validation.
11. Build teacher project switcher and application-status endpoints.
12. Build school-level memo/history APIs.
13. Build coupon inventory and assignment APIs.
14. Build certificate template metadata/upload APIs.
15. Build admin account management APIs.
16. Build mail template management APIs.
17. Build admin workbox aggregation APIs.
18. Build CSV/PDF download endpoints.
19. Build search/filter parameters for application, member, and submission endpoints.
20. Build bulk application status, mail resend, and export endpoints.
21. Build Excel upload, column mapping, matching failure reason, and teacher check-request APIs.
22. Build final submission-list approval APIs and certificate unlock rules.
23. Build document availability state and teacher-facing messaging.
24. Build Excel/admin settings save and format-check APIs.
25. Build close/history summary persistence.
26. Replace local test state with API-backed views.

## First Submission Import Boundary

Submission checking should first be implemented as an Excel import pipeline:

```text
SubmissionExcelImportService
  - importTwentyNineSeconds(file)
      required: 소속, 작품제목, 감독, 예심평점, 수상결과
      optional: 등록일, 출품 URL, 진행상태
  - importShortformKing(file)
      required: 소속, 제목, 출품자, 원본URL, 평점
      optional: 플랫폼, 수상, 조회수
  - matchBySchoolName(participation.schoolName, row.affiliation)
```

Automatic matching must require exact school-name/source equality. Similar matches such as spacing differences, punctuation differences, abbreviation, or one-character differences should be saved as `확인 필요` for admin review. API/server automation can be added later only if the external systems expose a stable integration boundary.
