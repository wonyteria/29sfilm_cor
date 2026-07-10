# 29 WITH test app

This is a self-contained browser prototype for checking the 29 WITH Dream Project flows before real DB, domain, mail, storage, and PDF generation are connected.

## How to open

Open `index.html` in a browser.

If the browser blocks local files, serve this folder with any local static server and open the shown localhost URL.

For a non-technical click-through guide, open `TEST_GUIDE.md`.

## What can be tested now

- Switch between admin and teacher views.
- Select overlapping Dream Project events.
- Admin dashboard, admin workbox, event creation/edit/deactivation, member/school management, applications, selection, Excel-based submission matching, benefits, coupons, certificates, score reports, mail templates, admin account settings, requests, Excel/admin settings, and history.
- Teacher dashboard, available events, work management, benefits, notices, certificates, score reports, history, and profile request.
- Local state changes through buttons and modals.
- Real upload testing for `.csv`, HTML-table `.xls`, and `.xlsx` files when the browser can load the included SheetJS CDN script.
- Sample upload files: `sample-submissions-29sfilm.csv` and `sample-submissions-shortform.csv`.
- Demo reset through the top-right reset button.

## Validation

Run this check from the repository root when Node can access the workspace:

```bash
node outputs/29with-test-app/validate.mjs
```

The validator checks that every admin/teacher page renders non-empty content, every `data-action` button has a handler, and the main mock workflows update state correctly.
It also checks that the core responsive CSS rules exist for desktop, tablet, and mobile layouts.

Covered workflow checks:

- Excel upload submission matching
- admin selection
- newspaper coupon auto-assignment on selection
- manual submission matching
- matching failure reason display and teacher check request
- final submission-list approval before certificate issuance
- certificate approval
- score reflection/publication
- document availability messaging for admin and teacher views
- teacher work input scoped to the selected overlapping project
- teacher project switcher and application-status visibility
- teacher profile save
- affiliation/team-name confirmation on application
- snack payment date update
- mail edit/send
- Excel settings save and format-check state
- teacher document request/reply
- Dream Project close/history transition
- coupon upload
- certificate template upload
- admin account add/toggle
- mail template add/edit
- school admin memo edit
- admin workbox
- in-app QA checklist
- mock member/document downloads
- search filters for applications, members, and submissions
- bulk application selection, status updates, resend, and export
- selection recommendation guidance with target-work overrun warning
- event creation, editable event settings, and deactivation

Covered UI checks:

- desktop two-column shell
- tablet single-column shell
- mobile stacked toolbar/modal actions
- horizontal table scrolling
- disabled button affordance

In the current Codex sandbox, direct `node` execution can be blocked by Windows profile permissions. The same validation module was run through the session JavaScript runtime and passed.

## Manual QA flow

1. Open the app as admin.
2. Select each Dream Project event and confirm the left selected-event card changes.
3. Go to `행사 운영`, create a test event, edit title/type/deadline/URLs/target work count, save it, and test deactivation.
4. Go to `관리자 작업함` and confirm pending work links route to the correct pages.
5. Go to `신청/선정`, confirm target-work overrun guidance and recommendation ranking, select visible/recommended applications, bulk update statuses, resend mail, export selected rows, and confirm a submission slot, newspaper coupon, and reserved mail are created.
6. Go to `회원/참여 학교`, edit a school memo, and confirm the memo is kept at school level.
7. Use the search boxes in `신청/선정`, `회원/참여 학교`, and `출품 확인`.
8. Go to `출품 확인`, run `출품 엑셀 분석`, confirm exact school-name/source matches are automatic and spacing/one-character differences are marked `확인 필요`, request teacher confirmation, open a school row, test manual matching, and approve the final submission list.
9. Go to `혜택/지원`, upload coupons and set the snack payment date.
10. Go to `활동확인서`, confirm approval prerequisites, upload a certificate template, preview and approve a certificate.
11. Go to `심사 결과`, confirm the publication summary, sync scores, and reserve the score-result mail.
12. Go to `메일/공지`, edit a reserved mail's subject, sender, send time, recipient count, recipient memo, and body, add/edit a template, and test immediate sending.
13. Go to `엑셀/관리 설정`, save event Excel fields, run the format check, add a test admin, and toggle the admin status.
14. Go to `테스트 체크리스트` and confirm each core workflow links to the right screen.
15. Test member/document download buttons.
16. Switch to teacher view and confirm each overlapping Dream Project has separate work, benefit, certificate, score status, and a visible project switcher.
17. Confirm the teacher dashboard and available-event cards show each application status clearly.
18. Save the teacher profile and confirm edited teacher information is reflected.
19. Submit a Dream Project application and confirm the affiliation/team-name confirmation blocks mismatched text.
20. Submit profile/document requests and confirm they appear in the admin `문의/요청` page.
21. Resize the browser to tablet/mobile widths and confirm navigation, toolbars, modals, and tables remain usable.

## Deferred integrations

- Real login and permissions.
- PostgreSQL/Prisma persistence.
- Production backend Excel parsing, validation logs, and upload storage for 29-second Film Festival and 29 Shortform King export files.
- Bundling the Excel parser locally instead of loading SheetJS from CDN.
- Optional future API/server automation if the external systems later expose a stable integration boundary.
- Real mail sending.
- Coupon inventory upload.
- Certificate PDF generation from uploaded template.
- Score report PDF generation.
- Storage for uploaded documents and generated files.

All deferred items are represented as clickable mock flows so UI/UX and process logic can be checked first.
