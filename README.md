# 위대한유산 정적 홈페이지

현재 `main`의 메인 템플릿을 기준으로 처음부터 다시 구성한 정적 퍼블리싱본입니다. 원본 Java 폴더 `main`과 보관본 `main_02`는 로컬에 보존하고, 이 저장소에는 정적 홈페이지 결과물만 관리합니다.

## VSCode에서 확인

VSCode에서 이 폴더를 연 뒤 `index.html`을 우클릭하고 **Open with Live Server**를 선택합니다.

Live Server가 없다면 다음 명령으로 확인할 수 있습니다.

```bash
python3 -m http.server 5500
```

## 문의 연결

현재 컨설팅 신청 버튼은 `adverthere1@gmail.com`으로 연결되는 `mailto:` 방식입니다. Google Sheets 수집 폼이나 외부 문의 서비스로 교체할 때는 `index.html`의 `#contact` 버튼 URL만 바꾸면 됩니다.

## 추출한 리소스

현재 `main`에서 메인 화면에 필요한 히어로 이미지, 고객 후기 이미지, 협력사 로고, 폰트, 회사소개서만 `assets/`로 추출했습니다.
