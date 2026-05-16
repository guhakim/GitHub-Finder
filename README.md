# GitHub Finder | 깃허브 파인더

> **"AI가 코드를 만들어도, 최종 판단은 개발자가 한다."**  
> AI와 협업하되, 코드의 흐름을 직접 이해하고 검증하는 것이 핵심입니다.

---

## 프로젝트 기획

### 기획 배경

JavaScript를 처음 배울 때 가장 어려운 점은 "실제 데이터가 어떻게 화면에 연결되는가"를 체감하는 것입니다.  
단순히 변수와 함수를 배우는 것을 넘어, **외부 API와 통신하고 응답 데이터를 DOM에 렌더링하는 전체 흐름**을 직접 구현해 보는 것이 이 프로젝트의 출발점입니다.

GitHub REST API는 인증 없이도 바로 사용할 수 있고, 응답 구조가 명확해서 **API 학습 첫 프로젝트로 최적의 소재**입니다.

---

### 핵심 목표

> 단순 화면 모방이 아닌, **API 데이터 기반의 UI 구성**

| 목표 | 설명 |
|------|------|
| **데이터 연동** | GitHub REST API에서 실제 사용자 데이터를 받아온다 |
| **비동기 처리** | `fetch` + `async/await`로 데이터 흐름을 제어한다 |
| **동적 렌더링** | 응답 JSON을 파싱해 DOM을 직접 조작한다 |
| **예외 처리** | 빈 입력, 404, 네트워크 오류를 안정적으로 처리한다 |
| **AI 협업** | AI 도구를 활용하되, 결과를 직접 검토하고 수정한다 |

---

### 구현 범위 (Must-have vs Nice-to-have)

**필수 구현**
- 사용자명 검색 및 GitHub API 데이터 요청
- 프로필 카드 및 저장소 목록 렌더링
- 빈 입력값 · 404 · 네트워크 오류 예외 처리

**선택 구현**
- 로딩 메시지 표시
- 반응형(Responsive) 레이아웃
- AI 활용 과정 README 문서화

---

### 데이터 흐름 설계

```
[1단계: 입력]
  사용자가 검색창에 GitHub 사용자명을 입력하고 검색 버튼 클릭 또는 Enter 키 입력
  → 빈 값이면 API 호출 없이 안내 메시지 출력 후 종료

[2단계: 요청]
  fetchUserData()  → GET https://api.github.com/users/{username}
  fetchReposData() → GET https://api.github.com/users/{username}/repos?sort=updated&per_page=5

[3단계: 응답]
  200 OK  → JSON 파싱 후 다음 단계로 전달
  404     → "사용자를 찾을 수 없습니다" 메시지 출력
  그 외   → "요청 오류" 메시지 출력

[4단계: 출력]
  renderProfile(user) → 프로필 이미지, 배지, 정보 행 DOM 렌더링
  renderRepos(repos)  → 저장소 목록 li 동적 생성 및 삽입
```

---

### 화면 구성 설계

```
┌─────────────────────────────────────────┐
│  GitHub Finder              [헤더]       │
├─────────────────────────────────────────┤
│  Search GitHub Users                    │
│  Enter a username to fetch a profile    │
│  ┌──────────────────────────┬──────┐    │
│  │  검색창 입력              │  🔍  │    │
│  └──────────────────────────┴──────┘    │
├─────────────────────────────────────────┤
│  ┌──────────┐  [Repos] [Gists] [팔로워] │
│  │  프로필   │                           │
│  │  이미지   │  Company:  ...            │
│  │          │  Blog:     ...            │
│  │[View]    │  Location: ...            │
│  └──────────┘  Member Since: ...        │
├─────────────────────────────────────────┤
│  Latest Repos                           │
│  repo-name-1    [Stars] [Watchers] [Forks] │
│  repo-name-2    [Stars] [Watchers] [Forks] │
│  ...                                    │
├─────────────────────────────────────────┤
│              GitHub Finder ©  [푸터]    │
└─────────────────────────────────────────┘
```

---

### API 응답 필드 설계

**사용자 정보** `GET /users/{username}`

| 필드 | 표시 위치 | null 처리 |
|------|-----------|-----------|
| `avatar_url` | 프로필 이미지 src | - |
| `html_url` | View Profile 링크 | - |
| `public_repos` | Repos 배지 | - |
| `public_gists` | Gists 배지 | - |
| `followers` | Followers 배지 | - |
| `following` | Following 배지 | - |
| `company` | Company 행 | `'N/A'` |
| `blog` | Website/Blog 행 | `'N/A'` |
| `location` | Location 행 | `'N/A'` |
| `created_at` | Member Since 행 | ISO → `YYYY-MM-DD` 포맷 |

**저장소 목록** `GET /users/{username}/repos?sort=updated&per_page=5`

| 필드 | 표시 위치 | null 처리 |
|------|-----------|-----------|
| `name` | 저장소 이름 (링크) | - |
| `html_url` | 클릭 시 이동 링크 | - |
| `stargazers_count` | Stars 배지 | - |
| `watchers_count` | Watchers 배지 | - |
| `forks_count` | Forks 배지 | - |

---

## 프로젝트 소개

**GitHub Finder**는 GitHub 사용자명을 검색하면 해당 사용자의 프로필 정보와 최신 저장소 목록을 실시간으로 보여주는 순수 바닐라 JavaScript 웹 앱입니다.

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 언어 | HTML5, CSS3, JavaScript (ES6+) |
| API | GitHub REST API v3 |
| 비동기 처리 | `fetch()`, `async/await` |
| 환경 | 브라우저 (별도 서버 · 프레임워크 불필요) |
| AI 도구 | Claude Code (Anthropic) |

---

## 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/guhakim/GitHub-Finder.git

# 2. 폴더로 이동
cd GitHub-Finder

# 3. index.html을 브라우저로 열기
#    파일 탐색기에서 더블클릭
#    또는 VS Code Live Server 확장 사용
```

> GitHub API는 미인증 상태에서 **시간당 60회** 요청 제한이 있습니다.

---

## 주요 기능

### 사용자 검색
- 검색창에 GitHub 사용자명 입력 후 **검색 버튼(🔍)** 또는 **Enter 키**로 검색
- 빈 입력값 제출 시 안내 메시지 표시

### 프로필 카드 출력
- 프로필 이미지 + View Profile 버튼
- Public Repos · Public Gists · Followers · Following 컬러 배지
- Company, Website/Blog, Location, Member Since 정보 행

### 최신 저장소 목록
- 최근 업데이트 기준 최신 5개 저장소
- 저장소명(클릭 시 GitHub 이동) + Stars · Watchers · Forks 배지

### 상태 메시지 처리

| 상황 | 메시지 |
|------|--------|
| 검색 중 | "불러오는 중..." |
| 빈 입력값 | "사용자명을 입력해 주세요." |
| 존재하지 않는 사용자 | `"username" 사용자를 찾을 수 없습니다.` |
| API 오류 (403 등) | "요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." |
| 네트워크 오류 | "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요." |

---

## AI 협업 기록

### 바이브 코딩 방식

> AI는 코드 초안을 생성하고, 개발자는 논리를 검증하고 구조화한다.

```
기능 세분화 → 프롬프트 작성 → AI 결과 검토 → 수정 요청 → 실행 확인 → README 기록
```

---

### 프롬프트 1 — HTML 구조 생성

**질문:**
> GitHub REST API에서 데이터를 요청하여 GitHub Finder 앱을 만들려고 합니다.  
> 순수 HTML/CSS/JavaScript로 기본 HTML 구조를 작성해 주세요.  
> 조건: 검색창, 검색 버튼, 프로필 영역, 저장소 목록 영역, 상태 메시지 영역, 파일 분리, id 명확히 부여

**AI 답변 요약:**
- `id="search-input"`, `id="search-btn"` 으로 검색 영역 구성
- `id="profile-card"` 안에 `avatar`, `followers` 등 세부 id 부여
- `class="hidden"` 으로 초기 숨김 처리 → 데이터 수신 후 표시

---

### 프롬프트 2 — JavaScript API 요청 코드 생성

**질문:**
> GitHub 사용자명을 입력하면 사용자 정보와 저장소 목록을 가져오는 JavaScript를 작성해 주세요.  
> 조건: fetch + async/await, 요청 분리, 404 안내, 오류 처리, 초보자용 주석

**AI 답변 요약:**
- `fetchUserData()`, `fetchReposData()` 로 요청 함수 완전 분리
- `response.status === 404` 로 사용자 없음 판별 → `throw new Error('USER_NOT_FOUND')`
- `catch` 블록에서 에러 종류별 다른 안내 문구 출력
- 섹션별 한글 주석 추가

---

### 프롬프트 3 — README 문서화

**질문:**
> 현재 프로젝트 내용을 바탕으로 README.md를 작성해 주세요.  
> 조건: 기획 서술, 데이터 흐름, 화면 설계, API 필드 정리, 프롬프트 기록, AI 검토 기준, 트러블슈팅, 배운 점, 3줄 보고서 포함

**AI 답변 요약:**
- 기획 배경 → 설계 → 구현 → 검토 순서로 문서 구성
- "AI가 코드를 만들어도, 최종 판단은 개발자가 한다" 핵심 메시지 포함

---

## AI 생성 결과 검토 기준

| 점검 항목 | 확인 내용 |
|-----------|-----------|
| **통신 점검** | API URL 파라미터가 올바른가, JSON 응답이 정상 수신되는가 |
| **렌더링 점검** | 데이터가 올바른 DOM id에 매핑되는가, 저장소 목록이 반복 출력되는가 |
| **안정성 점검** | 빈 입력 차단 로직이 있는가, 404가 UI를 깨지 않는가 |
| **기록 점검** | Console에 빨간 오류(Red log)가 없는가 |

---

## 트러블슈팅

### 문제 1 — `Company: null` 텍스트가 화면에 출력됨
- **원인:** `user.company`가 `null`일 때 `textContent`에 넣으면 문자열 `"null"`로 변환됨
- **해결:** `user.company || 'N/A'` 로 null 방어

### 문제 2 — `Forks: undefined` 배지 출력
- **원인:** API 응답 필드는 `forks_count` 인데 `forks` 로 잘못 접근
- **해결:** `repo.forks_count` 로 수정

### 문제 3 — 블로그 링크가 클릭 불가능한 텍스트로 출력됨
- **원인:** `textContent` 로 단순 문자열 삽입
- **해결:** `http` 여부 확인 후 `<a>` 태그로 렌더링, `https://` 자동 추가

---

## 배운 점

1. **비동기 처리의 구조** — `async/await`는 Promise를 동기 코드처럼 읽기 쉽게 감싸줍니다. `try/catch`와 함께 쓰면 오류 처리가 명확해집니다.
2. **API 응답은 항상 검증해야 한다** — `response.ok`와 `status` 코드를 명시적으로 확인하지 않으면 오류 응답도 정상처럼 처리될 수 있습니다.
3. **null/undefined 방어 코드** — API 필드는 언제든 `null`을 반환할 수 있습니다. `|| 'N/A'` 또는 `|| ''` 패턴으로 습관적으로 방어합니다.
4. **AI 코드는 검토가 필수다** — AI는 문법적으로 올바른 코드를 생성하지만, 실제 데이터에서 발생하는 edge case를 놓치는 경우가 있습니다. 직접 테스트하고 수정하는 과정이 진짜 학습입니다.

---

## 3줄 보고서

1. GitHub REST API에서 사용자 정보와 저장소 목록을 비동기로 요청하고, 응답 JSON을 DOM에 렌더링하는 전체 흐름을 처음부터 직접 설계하고 구현했습니다.
2. `null` 필드 텍스트 노출, 잘못된 API 필드명(`forks` vs `forks_count`) 등 AI가 놓친 버그를 직접 발견하고 수정하며 코드 검토 역량을 키웠습니다.
3. 기획 → 설계 → AI 협업 → 검토 → 수정 → 문서화로 이어지는 바이브 코딩 워크플로우를 한 사이클 완전히 경험했습니다.

---

## 향후 개선 사항

- [ ] GitHub Personal Access Token 연동 (요청 한도 60회 → 5,000회)
- [ ] 저장소 5개 이상 페이지네이션
- [ ] 저장소 언어별 색상 뱃지
- [ ] 검색 기록 저장 (`localStorage`)
- [ ] 다크 모드 지원

---

## 파일 구조

```
GitHub-Finder/
├── index.html   # 화면 구조 (헤더, 검색창, 프로필 카드, 저장소 목록, 푸터)
├── style.css    # 스타일 (헤더, 배지, 정보 행, 반응형)
├── app.js       # 로직 (입력 처리, API 요청, 렌더링, 오류 처리)
└── README.md    # 프로젝트 기획 및 개발 기록
```
