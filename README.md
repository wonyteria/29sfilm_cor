# 29 WITH Dream Project Test App

29 Platform의 영상 꿈나무 양성 프로젝트 운영을 관리자와 선생님 관점에서 테스트하기 위한 정적 프로토타입입니다.

## 바로 열기

- 로컬: `outputs/29with-test-app/index.html`
- GitHub Pages: 저장소 Pages를 `GitHub Actions`로 설정하면 루트 주소에서 자동으로 테스트 앱으로 이동합니다.

## 포함된 주요 흐름

- 관리자 꿈프 대시보드, 행사 등록/수정/종료
- 신청/선정, 쿠폰, 간식비, 메일/공지
- 출품작 엑셀 업로드 기반 학교명/소속 매칭
- 활동확인서/심사표 발급 및 수정 요청
- 선생님 신청, 작품 관리, 알림, 프로필 변경 요청

## 테스트 가이드

자세한 클릭 순서는 `outputs/29with-test-app/TEST_GUIDE.md`를 확인하세요.

## 검증

```bash
node outputs/29with-test-app/validate.mjs
```

현재 Codex Windows 샌드박스에서는 사용자 폴더 권한 때문에 검증 파일을 공용 임시 폴더로 복사해 실행했습니다.
