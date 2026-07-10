# GitHub 업로드 및 외부 확인 가이드

현재 Codex 실행 환경에서는 `github.com:443` 네트워크 연결이 차단되어 직접 `git push`가 실패했습니다.

인터넷이 되는 PC 또는 터미널에서 이 폴더를 열고 아래 명령을 실행합니다.

```bash
git push -u origin main
```

원격 저장소는 아래 주소로 설정되어 있습니다.

```text
https://github.com/wonyteria/29sfilm_cor.git
```

## GitHub Pages 설정

업로드 후 GitHub 저장소에서 아래처럼 설정합니다.

1. `Settings`
2. `Pages`
3. `Build and deployment`
4. `Source`를 `GitHub Actions`로 선택
5. `Actions` 탭에서 `Deploy static 29 WITH test app` 실행 상태 확인

정상 배포되면 GitHub Pages 주소로 접속했을 때 루트 `index.html`이 `outputs/29with-test-app/`로 자동 이동합니다.
