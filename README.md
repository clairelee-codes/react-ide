# <img src="public/logo.png" alt="PIO IDE logo" width="32" height="32" valign="middle" /> PIO IDE

브라우저에서 바로 코드를 작성하고 실행해보는 웹 기반 코드 플레이그라운드(IDE)입니다.  
폴더 단위로 프로젝트를 정리하고, 파일마다 언어(C++ / Java / JavaScript / Python)를 선택해 [Judge0](https://judge0.com/) API로 즉시 컴파일·실행 결과를 확인할 수 있습니다.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white" />
  <img alt="Monaco Editor" src="https://img.shields.io/badge/Monaco_Editor-4-0078D4?logo=visualstudiocode&logoColor=white" />
  <img alt="Sass" src="https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Serverless-black?logo=vercel&logoColor=white" />
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white" />
</p>

## 📸 미리보기

|       홈 (플레이그라운드 목록)        |               코드 에디터 & 실행                |
| :-----------------------------------: | :---------------------------------------------: |
| ![홈 화면](docs/screenshots/home.png) | ![에디터 화면](docs/screenshots/playground.png) |

## ✨ 주요 기능

- **폴더/파일(플레이그라운드) 관리**: 폴더를 만들고 그 안에 파일을 추가·이름 변경·삭제하며 프로젝트처럼 코드를 정리
- **코드 에디터**: Monaco Editor 기반 문법 강조, `vs-dark` / `vs-light` 테마 전환, 전체화면 모드
- **실시간 코드 실행**: Judge0 CE API 연동으로 C++/Java/JavaScript/Python 코드를 서버에서 직접 컴파일·실행하고 stdin 입력에 대한 stdout/stderr 결과를 확인
- **가져오기 / 내보내기**: 로컬 파일에서 코드·입력값을 불러오거나, 작성한 코드/실행 결과를 텍스트 파일로 저장
- **자동 저장**: 폴더/파일 데이터를 `localStorage`에 동기화해 새로고침해도 작업 내용 유지
- **API 키 서버 보호**: Judge0 API 키를 브라우저에 노출하지 않고, Vercel 서버리스 함수가 대신 호출하는 프록시 구조

## 🛠️ 기술 스택

- **Frontend**: React 19, React Router 7
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Backend**: Vercel Serverless Functions (`api/`) — Judge0 API 키를 서버에서만 사용하는 프록시
- **Build**: Vite 8, Babel + React Compiler 플러그인 (`babel-plugin-react-compiler`)
- **Styling**: Sass(SCSS)
- **외부 API**: Judge0 CE (RapidAPI) — 코드 실행 엔진
- **상태 관리**: React Context API (`PlaygroundProvider`, `ModalProvider`) + `localStorage`

## 🏗️ 아키텍처

```
├── api/
│   └── submissions/
│       └── index.js           # Judge0 프록시 (POST 제출 / GET ?tokenId= 결과 조회), RAPIDAPI_API_KEY는 여기서만 사용
├── src/
│   ├── App.jsx                       # 라우팅(/ , /playground/:folderId/:fileId) 및 Provider 구성
│   ├── Providers/
│   │   ├── PlaygroundProvider.jsx    # 폴더/파일 상태 관리(Context), localStorage 동기화
│   │   ├── ModalProvider.jsx         # 전역 모달 열림/닫힘 상태 관리
│   │   └── Modals/                   # 폴더/파일 생성·수정 모달 컴포넌트
│   ├── pages/
│   │   ├── HomePage/                 # 플레이그라운드(폴더/파일) 목록 화면
│   │   └── PlaygroundPage/           # 코드 에디터 + 입출력 실행 화면
│   │       └── service.js            # /api/submissions 호출(제출 → 폴링 → 결과 반환)
│   ├── hooks/useFileUpload.js        # 파일 업로드 공통 훅
│   └── utils/downloadTextFile.js     # 텍스트 파일 다운로드 유틸
└── vercel.json                       # SPA 리다이렉트(rewrites) 설정
```

두 개의 Context(`PlaygroundContext`, `ModalContext`)로 전역 상태를 분리했습니다. 플레이그라운드 데이터(폴더/파일/코드)는 `PlaygroundProvider`가, 모달의 열림 여부와 페이로드는 `ModalProvider`가 각각 책임지도록 관심사를 나눴습니다.

브라우저는 Judge0를 직접 호출하지 않고 `/api/submissions`만 호출합니다. 실제 Judge0 API 키(`RAPIDAPI_API_KEY`)는 `api/submissions/index.js`(Vercel 서버리스 함수) 안에서만 존재하고, 클라이언트 번들에는 포함되지 않습니다.

## 🐛 트러블슈팅

### 1. 언어 변경 시 에디터 코드가 한 박자 밀려서 반영되는 버그

**증상**: 에디터 상단에서 언어를 변경하면, 코드가 즉시 바뀌지 않고 그 다음 언어를 변경할 때 직전에 선택했던 언어의 기본 코드로 뒤늦게 바뀌었습니다.

**원인 분석**: `handleChangeLanguage` 핸들러가 아래 순서로 동작했습니다.

```js
updateLanguage(folderId, fileId, e.target.value); // setFolders 예약 (비동기)
setCode(getDefaultCode(folderId, fileId)); // 같은 틱에서 folders를 다시 읽음 → stale
```

`setFolders`는 즉시 반영이 아니라 다음 렌더링을 예약할 뿐이라, 같은 함수 실행 중에는 `folders`가 갱신되지 않습니다. `getDefaultCode(folderId, fileId)`가 Context의 `folders` state를 참조하는 함수였기 때문에, 이번 렌더에서 캡처된 **옛날 값**을 그대로 읽어오면서 한 클릭씩 밀리는 현상이 발생했습니다.

**해결**: "state를 쓰고 나서 다시 읽지 말고, 이미 알고 있는 값을 그대로 재사용"하는 방향으로 리팩터링했습니다.

- `getDefaultCode(folderId, fileId)`(파일별 코드 조회)를 `getDefaultCode(language)`로 변경해 `folders` state를 거치지 않고 언어만으로 기본 코드를 즉석에서 계산하도록 수정
- 언어 변경 핸들러도 새로 계산한 값을 그대로 `setCode`에 넘기도록 수정

```js
const handleChangeLanguage = (e) => {
  const defaultCode = getDefaultCode(e.target.value); // folders를 거치지 않고 즉석 계산
  setCode(defaultCode);
  setLanguage(e.target.value);
};
```

**배운 점**: React state는 해당 렌더링의 스냅샷이라, `setX(...)` 호출 직후 같은 함수 안에서 `x`를 다시 읽어도 갱신된 값이 아닙니다. "쓰고 바로 읽기"가 필요해 보이는 상황은 대개 이미 계산에 쓴 값을 재사용하면 해결됩니다.

### 2. `vercel dev` 로컬 환경에서 동적 API 라우트가 SPA rewrite에 먹히는 버그

**증상**: API 키를 숨기기 위해 `api/submissions.js`(제출, POST)와 `api/submissions/[token].js`(결과 조회, GET) 두 개의 Vercel 서버리스 함수로 분리해 구현했는데, `vercel dev`로 로컬 테스트하면 `POST /api/submissions`는 정상 동작하지만 `GET /api/submissions/:token`은 JSON 대신 `index.html`이 그대로 반환됐습니다.

**확실하게 확인한 것**: `vercel.json`에 SPA 새로고침 대응용 캐치올 rewrite(`/(.*) → /index.html`)가 있으면 `GET /api/submissions/:token`이 실패하고, `vercel.json`을 비우면(`{}`) 정상 동작했습니다. 껐다 켜기를 반복하며 재현했고, `POST /api/submissions`(동적 세그먼트 없이 파일 하나에 대응)는 rewrite가 있어도 항상 정상 동작했습니다. 관련 증상을 보고하는 [Vercel 커뮤니티 스레드](https://community.vercel.com/t/vercel-dev-tells-vite-to-parse-html-as-javascript/12604)도 있어서, 저희만 겪는 특이 케이스는 아닌 것 같습니다.

**확실하지 않은 것**: 정확히 왜 동적 세그먼트(`[token].js`)만 영향을 받는지는 못 밝혔습니다. `/api/(.*) → /api/$1`처럼 `/api` 요청을 명시적으로 먼저 통과시키는 규칙을 앞에 추가해봐도 이 문제는 그대로 재현됐고, Vercel의 다른 공식 이슈([vercel/vercel#5448](https://github.com/vercel/vercel/discussions/5448))를 보면 "파일시스템 매칭이 항상 rewrite보다 우선한다"는 것도 보장된 동작이 아닌 것 같습니다. `vercel dev`의 내부 라우팅 구현을 직접 들여다보지 않는 이상 확답하기 어려워서, 여기서는 원인 규명 대신 우회하는 쪽을 택했습니다.

**해결**: 애초에 동적 라우트가 필요 없도록 API 설계를 바꿨습니다.

- `api/submissions/[token].js`를 없애고, `api/submissions/index.js` 하나에서 `req.method`로 POST/GET을 분기
- 조회할 토큰은 URL 경로가 아니라 **쿼리스트링**으로 전달: `GET /api/submissions?tokenId=xxx`

```js
export default async function handler(req, res) {
  if (req.method === "POST") {
    /* 제출 */
  }
  if (req.method === "GET") {
    const { tokenId } = req.query; // 동적 라우트 매칭이 아니라 평범한 쿼리스트링 파싱
    /* 조회 */
  }
  return res.status(405).json({ message: "Method not allowed" });
}
```

이러면 `/api/submissions`는 항상 파일 경로와 정확히 일치하는 경로가 되어 rewrite와 무관하게 정상 동작합니다.

**배운 점**: 동적 라우트가 실제 프로덕션 배포에서도 이 문제를 겪었을지는 확인하지 못했습니다 — 로컬에서 원인을 밝히는 대신 동적 라우트 자체를 없애는 쪽으로 우회했기 때문입니다. 원인을 끝까지 파는 것보다, 문제가 되는 패턴 자체를 안 쓰는 구조로 바꾸는 게 더 빠른 해결책이 되는 경우도 있습니다.

## 🚀 시작하기

### 요구 사항

- Node.js (LTS 권장)

### 설치

```bash
npm install
```

### 환경 변수

코드 실행 기능은 RapidAPI의 [Judge0 CE API](https://rapidapi.com/judge0-official/api/judge0-ce)를 사용합니다. API 키는 [`api/submissions/index.js`](api/submissions/index.js) 서버리스 함수에서만 사용되어 브라우저에 노출되지 않습니다. 프로젝트 루트에 `.env` 파일을 만들고 API 키를 채워주세요.

```
RAPIDAPI_API_KEY=your_rapidapi_key
```

> `VITE_` 접두사를 붙이면 클라이언트 번들에 그대로 노출되므로 사용하지 않습니다.

배포 시에는 로컬 `.env` 파일이 자동으로 반영되지 않으므로, Vercel 대시보드 → Project Settings → Environment Variables에 `RAPIDAPI_API_KEY`를 별도로 등록해야 합니다.

### 실행

`/api` 라우트는 Vite 개발 서버가 아니라 Vercel 서버리스 함수로 동작하므로, 로컬에서 실행 기능까지 테스트하려면 [Vercel CLI](https://vercel.com/docs/cli)로 실행해야 합니다.

```bash
npm install -g vercel   # 최초 1회
vercel dev               # 개발 서버 (API 라우트 포함)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과 미리보기 (API 라우트 미포함)
npm run lint       # ESLint 검사
```

## 지원 언어

| 언어       | Judge0 language_id |
| ---------- | ------------------ |
| C++        | 54                 |
| Python     | 92                 |
| JavaScript | 93                 |
| Java       | 91                 |
