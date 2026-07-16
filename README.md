# 언어 변경 시 Editor 코드 미반영 버그 — 요약

## 문제 상황

`EditorContainer`에서 언어(select) 변경 시:

- **첫 번째 변경**: Editor의 code가 갱신되지 않음
- **두 번째 변경**: 직전에 선택했던 언어의 기본 코드로 바뀜 (한 클릭씩 밀려서 반영)
- console.log상 선택한 언어 값 자체는 매번 정확하게 찍힘

## 원인

`EditorContainer.jsx`의 `handleChangeLanguage`가 다음 순서로 동작:

\`\`\`js
updateLanguage(folderId, fileId, e.target.value); // setFolders 예약 (비동기)
setCode(getDefaultCode(folderId, fileId)); // 같은 틱에서 folders를 다시 읽음 → stale
setLanguage(e.target.value);
\`\`\`

- `setFolders`는 즉시 반영이 아니라 **다음 렌더링을 예약**하는 것뿐이라, 같은 함수 실행 중엔 `folders`가 갱신되지 않음
- `getDefaultCode(folderId, fileId)`는 Context의 `folders` state를 참조하는 함수라, 이번 렌더에서 캡처된 **옛날 값**을 그대로 읽음
- → "쓰자마자 같은 틱에서 다시 읽기" 패턴이 원인 (React state = 렌더링 스냅샷)

### 중간에 확인했던 오해들

- **강의(2년 전) 코드가 됐던 이유**: 강의 버전은 `[...folders]`로 얕은 복사만 한 뒤 `newFolders[i].files[j].code = ...`처럼 **state를 직접 mutate**했음. 얕은 복사라 내부 객체 참조가 동일해서, mutate하는 순간 원본 `folders` 객체도 같이 바뀌어버려 우연히 타이밍 문제를 회피한 것 (권장되는 방식은 아님 — 참조 동일성에 의존하는 다른 최적화들과 충돌 위험).
- **`setFolders`를 함수형으로 바꾸면 해결되는지**: 아니오. 함수형 업데이트는 "동일 state를 연달아 여러 번 갱신할 때 서로의 결과를 반영"하는 문제를 해결하는 도구지, "쓰고 나서 별개의 함수(`getDefaultCode`)로 동기 재조회"하는 이번 문제와는 무관.
- **`useEffect`로 해결 가능한지**: 가능은 하나 정석은 아님. `useEffect`는 외부 시스템 동기화용이지, 내 state끼리 맞추는 용도가 아님 (React 공식 가이드 "You Might Not Need an Effect").

## 최종 해결책

"state를 쓰고 나서 다시 읽지 말고, 이미 알고 있는 값을 그대로 재사용"하는 방향으로 리팩터링:

1. **`PlaygroundProvider.jsx`**
   - `getDefaultCode(folderId, fileId)` (파일별 코드 조회) → `getCode(folderId, fileId)`로 개명, 새로 `getDefaultCode(language)` 추가 (언어만으로 기본 코드 계산, `folders` state와 무관)
   - `updateLanguage` → `resetLanguageAndCode`로 개명 (코드까지 초기화한다는 부작용을 이름에 명시)
   - 대부분의 setter를 `setFolders((folders) => ...)` 함수형으로 통일 (연속 호출 시 업데이트 유실 방지 목적, 이번 버그의 직접 원인은 아니었음)

2. **`EditorContainer.jsx`**

\`\`\`js
const handleChangeLanguage = (e) => {
resetLanguageAndCode(folderId, fileId, e.target.value);
setCode(getDefaultCode(e.target.value)); // folders를 안 거치고 즉석 계산
setLanguage(e.target.value);
};
\`\`\`

## 배운 일반 원칙

- React state는 **해당 렌더링의 스냅샷**이다 — `setX(...)` 호출 직후 같은 함수 안에서 `x`를 다시 읽어도 갱신된 값이 아니다.
- "쓰고 바로 읽기"가 필요해 보이는 상황은 대개 **"이미 계산에 쓴 값을 재사용"** 하면 해결된다 (별도 조회 함수로 되묻지 않기).
- 이전 state 값에 의존하는 업데이트는 함수형 업데이트(`setX(prev => ...)`)로.
- `useEffect`는 외부 동기화 전용, 내부 state 파생에는 사용 자제.
- 근본적으로 반복되는 문제라면 라이브러리(Redux 등) 문제가 아니라, **state 중복 저장을 줄이고 연관된 전환을 원자적으로 묶는 것(`useReducer` 등)** 이 구조적 해법.
