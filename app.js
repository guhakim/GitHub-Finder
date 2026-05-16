// =============================================
// DOM 요소 선택
// HTML의 id 속성과 이름을 맞춰서 가져옵니다.
// =============================================
const searchInput = document.getElementById('search-input');   // 텍스트 입력창
const searchBtn   = document.getElementById('search-btn');     // 검색 버튼
const statusMsg   = document.getElementById('status-message'); // 상태 메시지 영역
const profileCard = document.getElementById('profile-card');   // 프로필 카드 영역
const reposSection = document.getElementById('repos-section'); // 저장소 목록 영역


// =============================================
// 이벤트 연결
// 버튼 클릭과 Enter 키 모두 검색을 실행합니다.
// =============================================
searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
});


// =============================================
// 검색 실행 함수
// 입력값을 읽고 유효성을 검사한 뒤 API 요청을 시작합니다.
// =============================================
function handleSearch() {
  // trim()으로 앞뒤 공백을 제거합니다.
  const username = searchInput.value.trim();

  // 빈 값이면 API 요청 없이 안내 메시지만 표시합니다.
  if (!username) {
    showStatus('사용자명을 입력해 주세요.', 'error');
    return; // 함수 종료
  }

  // 유효한 입력값이 있으면 API 요청을 시작합니다.
  searchUser(username);
}


// =============================================
// 사용자 정보 API 요청 함수 (조건 2: 요청 분리)
// https://api.github.com/users/{username}
// =============================================
async function fetchUserData(username) {
  // fetch()는 서버에 데이터를 요청하는 함수입니다.
  // await는 응답이 올 때까지 기다립니다.
  const response = await fetch(`https://api.github.com/users/${username}`);

  // 응답 상태 코드가 404이면 사용자가 존재하지 않는 것입니다.
  if (response.status === 404) {
    throw new Error('USER_NOT_FOUND');
  }

  // 그 외 오류(403 요청 초과 등)도 예외로 처리합니다.
  if (!response.ok) {
    throw new Error('API_ERROR');
  }

  // 응답 본문을 JSON 형식으로 변환합니다.
  return response.json();
}


// =============================================
// 저장소 목록 API 요청 함수 (조건 2: 요청 분리)
// https://api.github.com/users/{username}/repos
// =============================================
async function fetchReposData(username) {
  // sort=updated: 최근에 업데이트된 순서로 정렬
  // per_page=5: 최대 5개만 가져옵니다.
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
  );

  if (!response.ok) {
    throw new Error('API_ERROR');
  }

  // 저장소 목록은 배열(Array) 형태의 JSON으로 반환됩니다.
  return response.json();
}


// =============================================
// 전체 검색 흐름을 제어하는 함수
// 사용자 정보와 저장소를 순서대로 요청합니다.
// =============================================
async function searchUser(username) {
  // 이전 결과를 숨기고 로딩 메시지를 표시합니다.
  showStatus('불러오는 중...', 'loading');
  hideResults();

  try {
    // 1단계: 사용자 정보 요청
    const userData = await fetchUserData(username);

    // 2단계: 저장소 목록 요청
    const reposData = await fetchReposData(username);

    // 3단계: 두 요청이 모두 성공하면 화면에 출력합니다.
    hideStatus();
    renderProfile(userData);
    renderRepos(reposData);

  } catch (error) {
    // 요청 도중 오류가 발생하면 이곳에서 처리합니다.
    if (error.message === 'USER_NOT_FOUND') {
      showStatus(`"${username}" 사용자를 찾을 수 없습니다.`, 'error');
    } else if (error.message === 'API_ERROR') {
      showStatus('요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    } else {
      // fetch 자체가 실패한 경우 (네트워크 단절 등)
      showStatus('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.', 'error');
    }
  }
}


// =============================================
// 사용자 프로필 화면 출력 함수
// API 응답 데이터를 HTML 요소에 넣습니다.
// =============================================
function renderProfile(user) {
  // 각 id에 해당하는 요소를 찾아 값을 채웁니다.
  document.getElementById('avatar').src          = user.avatar_url;
  document.getElementById('name').textContent    = user.name || user.login; // 이름 없으면 사용자명 표시
  document.getElementById('username').textContent = `@${user.login}`;
  document.getElementById('bio').textContent     = user.bio || '';          // bio가 null이면 빈 문자열
  document.getElementById('followers').textContent  = user.followers.toLocaleString();
  document.getElementById('following').textContent  = user.following.toLocaleString();
  document.getElementById('public-repos').textContent = user.public_repos.toLocaleString();

  // 프로필 링크 설정
  const profileLink = document.getElementById('profile-link');
  profileLink.href = user.html_url;

  // hidden 클래스를 제거하면 화면에 나타납니다.
  profileCard.classList.remove('hidden');
}


// =============================================
// 저장소 목록 화면 출력 함수
// 저장소 배열을 반복하며 목록 아이템을 만듭니다.
// =============================================
function renderRepos(repos) {
  const list = document.getElementById('repos-list');
  list.innerHTML = ''; // 이전 결과를 지웁니다.

  // 공개 저장소가 없는 경우
  if (repos.length === 0) {
    list.innerHTML = '<li style="color:#57606a;font-size:0.9rem;">공개 저장소가 없습니다.</li>';
    reposSection.classList.remove('hidden');
    return;
  }

  // forEach로 각 저장소를 li 요소로 만들어 목록에 추가합니다.
  repos.forEach(function (repo) {
    const li = document.createElement('li');
    li.className = 'repo-item';

    // innerHTML로 카드 내부 HTML을 구성합니다.
    li.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <p>${repo.description || '설명 없음'}</p>
      <div class="repo-meta">
        <span>★ ${repo.stargazers_count}</span>
        <span>${repo.language || '언어 미지정'}</span>
      </div>
    `;

    list.appendChild(li); // ul 안에 li를 추가합니다.
  });

  reposSection.classList.remove('hidden');
}


// =============================================
// 상태 메시지 표시 / 숨김 유틸리티 함수
// =============================================
function showStatus(message, type) {
  // type은 'loading' 또는 'error' — CSS 클래스로 색상이 바뀝니다.
  statusMsg.textContent = message;
  statusMsg.className = `status-message ${type}`;
}

function hideStatus() {
  statusMsg.className = 'status-message hidden';
}

function hideResults() {
  profileCard.classList.add('hidden');
  reposSection.classList.add('hidden');
}
