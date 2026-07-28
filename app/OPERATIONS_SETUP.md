# 29 WITH 운영 전환 설정

현재 앱은 `DATABASE_URL`이 없으면 기존 JSON 파일 기반 검증 모드로 동작하고, `DATABASE_URL`이 있으면 Prisma/PostgreSQL 운영 모드로 전환됩니다.

## 1. Supabase DB

1. Supabase 프로젝트를 만든다.
2. Project Settings → Database에서 connection string을 복사한다. IPv4/local/Vercel 환경에서는 Shared Pooler session mode를 우선 사용한다.
3. Vercel 환경변수에 `DATABASE_URL`을 등록한다.
4. 로컬 또는 CI에서 스키마를 반영한다.

```bash
npm install
npm run db:generate
npm run db:push
```

이 프로젝트의 로컬 연결은 `.env.local`에 설정되어 있다. Next 앱 폴더에서도 읽을 수 있도록 `apps/web/.env.local -> ../../.env.local` 심볼릭 링크를 사용한다.

## 2. Supabase Storage

Storage bucket을 만들고 Vercel에 아래 값을 등록한다.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

이 값들이 있으면 쿠폰 엑셀, 출품 엑셀, 확인서 템플릿은 Supabase Storage에 저장된다. 없으면 DB의 `FileAsset.dataUrl`에 보관된다.

## 3. 로그인/권한

추가된 API:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/signup`
- `GET /api/auth/callback`

Supabase Auth가 이메일/비밀번호 회원가입과 이메일 인증 callback을 처리한다. 앱은 Supabase 세션을 읽어 public `User` 테이블과 동기화하고, `User.userType`을 `ADMIN`/`TEACHER` 권한 기준으로 사용한다.

관리자 가입은 `ADMIN_SIGNUP_CODE`가 맞아야 허용된다. OAuth는 사용하지 않는다.

쓰기 API는 서버에서 권한을 검사한다.

- 행사/선정/쿠폰/출품/확인서/메일/초기화: `ADMIN`
- 행사 신청: 이메일 인증된 로그인 사용자

## 4. 운영 데이터 저장

DB 모드에서 저장되는 항목:

- 행사 등록: `Event`, `DreamEvent`
- 선생님 신청: `User`, `TeacherProfile`, `DreamApplication`
- 선정 처리: `DreamParticipation`, `SubmissionSlot`
- 출품 엑셀 분석/매칭: `ExternalEventConnection`, `ExternalSubmission`, `SubmissionMatch`
- 쿠폰: `Coupon`
- 파일: `FileAsset`
- 메일 예약/로그: `ScheduledMail`, `MailRecipient`, `MailSendLog`
- 히스토리: `AuditLog`

## 5. 메일/공지

운영공지는 Gmail SMTP로 발송한다.

필요한 환경변수:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `CRON_SECRET`

관리자 화면의 메일/공지는 DB에 초안/예약으로 저장할 수 있고, `즉시 발송`을 체크하면 SMTP로 바로 발송한다.

예약 시간이 지난 메일 자동 발송 API:

```bash
curl -X POST "https://YOUR_DOMAIN/api/mails/run-due" \
  -H "x-cron-secret: $CRON_SECRET"
```

Vercel Cron 또는 별도 worker가 위 API를 주기적으로 호출하면 `ScheduledMail.status = SCHEDULED`이고 `scheduledAt <= now()`인 메일을 발송한다.

## 6. 활동확인서 PDF

`POST /api/certificates/generate`는 PDF를 생성한다. Vercel에서 한글이 깨지지 않게 하려면 배포 패키지에 한글 TTF/TTC 폰트를 포함하고 `CERTIFICATE_FONT_PATH`를 지정한다.

## 7. Vercel

Vercel 프로젝트 Root Directory를 `app`으로 잡고 Build Command를 아래로 설정한다.

```bash
npm run vercel-build
```

필수 환경변수:

- `DATABASE_URL`

운영 권장 환경변수:

- Supabase Storage 변수 3개
- Supabase Auth public 변수 2개
- SMTP 변수
- `CERTIFICATE_FONT_PATH`
