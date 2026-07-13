# 로컬 작업물을 GitHub에 올리는 방법

현재 29 WITH 테스트 앱 전체 파일은 로컬 폴더에 준비되어 있습니다.

로컬 폴더:

```text
C:\Users\pcuser\Documents\Codex\2026-07-08\prd-29-platform-dream-project-29\work\publish-29sfilm-cor
```

Codex 실행 환경에서는 GitHub 네트워크 연결이 막혀 `git push`가 실패할 수 있습니다. 사용자의 PC 터미널 또는 GitHub Desktop에서 아래 명령을 실행하면 전체 앱 파일이 올라갑니다.

```powershell
cd "C:\Users\pcuser\Documents\Codex\2026-07-08\prd-29-platform-dream-project-29\work\publish-29sfilm-cor"
git push --force-with-lease -u origin main
```

업로드 후 GitHub에서 아래 설정을 확인하세요.

1. `Settings > Pages`로 이동
2. `Source`를 `GitHub Actions`로 설정
3. `Actions` 탭에서 `Deploy static 29 WITH test app` 실행 완료 확인

예상 접속 주소:

```text
https://wonyteria.github.io/29sfilm_cor/
```
