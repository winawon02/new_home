# 위대한유산 정적 홈페이지

현재 `main`의 메인 템플릿을 기준으로 처음부터 다시 구성한 정적 퍼블리싱본입니다. 원본 Java 폴더 `main`은 로컬에 보존하고, 이 저장소에는 정적 홈페이지 결과물만 관리합니다.

## VSCode에서 확인

VSCode에서 이 폴더를 연 뒤 `index.html`을 우클릭하고 **Open with Live Server**를 선택합니다.

Live Server가 없다면 다음 명령으로 확인할 수 있습니다.

```bash
python3 -m http.server 5500
```

## 문의 연결

`contact.html`의 컨설팅 신청 폼은 DB 없이 FormSubmit AJAX 엔드포인트로 `adverthere1@gmail.com`에 문의 내용을 전송합니다. 전송 응답이 성공이면 `success.html`로 이동하고, 실패하면 입력 화면에 오류를 표시합니다.

처음 실제 문의를 받기 전에는 FormSubmit에서 수신 메일 주소 확인 절차를 한 번 완료해야 합니다. 수신 주소나 배포 도메인을 바꿀 때는 `contact.html`의 form `action`과 숨김 필드 `_url`도 함께 확인합니다.

폼 전송은 `file://` 직접 열기보다 VSCode Live Server 또는 `python3 -m http.server 5500`처럼 HTTP 서버로 확인해야 합니다.

## 추출한 리소스

현재 `main`에서 메인 화면에 필요한 히어로 이미지, 고객 후기 이미지, 협력사 로고, 폰트, 회사소개서만 `assets/`로 추출했습니다.
