# 29 WITH

29 WITH is the operating system for 29 Platform external collaboration programs.

The first product scope is the Dream Project, covering:

- teacher sign-up and Dream Project applications
- admin event creation, operation, edit, deactivation, and selection
- Excel upload for 29-second Film Festival and 29 Shortform King submission exports
- school-level submission matching by Dream Project school name and Excel source/affiliation
- scheduled mail review and sending
- coupons, snack support, certificates, score reports, and history

## Project Structure

```text
app/
  apps/
    web/      Admin and teacher web app
    api/      Backend API, jobs, mail, Excel import, PDFs
  packages/
    database/ Prisma schema and DB client boundary
    shared/   Shared domain constants and types
```

## Interactive Prototype

A self-contained prototype for admin/teacher QA is available outside the app workspace:

```text
../outputs/29with-test-app/index.html
```

It uses local browser state and mock actions so the Dream Project process can be tested before real DB, mail, storage, Excel parsing, and PDF generation are connected.

## Recommended Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- Backend: NestJS, TypeScript, Prisma
- Database: PostgreSQL
- Jobs: Redis + BullMQ or Nest Schedule
- Files: S3-compatible storage
- PDF: Playwright or PDFKit

## Development Priority

1. Admin/teacher auth, event creation/edit/deactivation, Dream Project application, selection
2. Mail templates and scheduled mail review
3. Excel import parser and school-level submission matching
4. Certificates, score reports, coupons, snack support, history

## Critical Product Rules

- Match uploaded submission rows only inside the selected Dream Project event and selected participation.
- Automatic matching only accepts exact Dream Project school name and Excel `소속` matches.
- Spacing, punctuation, abbreviation, or one-character differences must be shown as `확인 필요`, not automatically confirmed.
- Scheduled mails must be editable before sending.
- Certificate downloads are available only after admin final approval.
- Activity certificates require final submission-list approval first.
- 29 Shortform King does not show final-round status.
- Every admin action is recorded in an audit log.
