// =============================================
// DOM 요소 선택
// =============================================
const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const statusMsg    = document.getElementById('status-message');
const profileCard  = document.getElementById('profile-card');
const reposSection = document.getElementById('repos-section');


// =============================================
// 이벤트: 버튼 클릭 + Enter 키로 검색
// =============================================
searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
});


// =============================================
// 검색 실행
// =============================================
function handleSearch() {
  const username = searchInput.value.trim();

  if (!username) {
    showStatus('사용자명을 입력해 주세요.', 'error');
    return;
  }

  searchUser(username);
}


// =============================================
// 사용자 정보 API 요청
// =============================================
async function fetchUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (response.status === 404) {
    throw new Error('USER_NOT_FOUND');
  }
  if (!response.ok) {
    throw new Error('API_ERROR');
  }

  return response.json();
}


// =============================================
// 저장소 목록 API 요청
// =============================================
async function fetchReposData(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
  );

  if (!response.ok) {
    throw new Error('API_ERROR');
  }

  return response.json();
}


// =============================================
// 전체 검색 흐름
// =============================================
async function searchUser(username) {
  showStatus('불러오는 중...', 'loading');
  hideResults();

  try {
    const userData  = await fetchUserData(username);
    const reposData = await fetchReposData(username);

    hideStatus();
    renderProfile(userData);
    renderRepos(reposData);

  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      showStatus(`"${username}" 사용자를 찾을 수 없습니다.`, 'error');
    } else if (error.message === 'API_ERROR') {
      showStatus('요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    } else {
      showStatus('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.', 'error');
    }
  }
}


// =============================================
// 프로필 렌더링
// =============================================
function renderProfile(user) {
  // 이미지 + 링크
  document.getElementById('avatar').src = user.avatar_url;
  document.getElementById('profile-link').href = user.html_url;

  // 배지
  document.getElementById('public-repos').textContent = user.public_repos;
  document.getElementById('public-gists').textContent = user.public_gists;
  document.getElementById('followers').textContent    = user.followers;
  document.getElementById('following').textContent    = user.following;

  // 정보 행 — null이면 'N/A' 표시
  document.getElementById('company').textContent    = user.company    || 'N/A';
  document.getElementById('location').textContent   = user.location   || 'N/A';
  document.getElementById('created-at').textContent = formatDate(user.created_at);

  // 블로그 링크는 클릭 가능하게 처리
  const blogEl = document.getElementById('blog');
  if (user.blog) {
    const href = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
    blogEl.innerHTML = `<a href="${href}" target="_blank">${user.blog}</a>`;
  } else {
    blogEl.textContent = 'N/A';
  }

  profileCard.classList.remove('hidden');
}


// =============================================
// 저장소 렌더링
// =============================================
function renderRepos(repos) {
  const list = document.getElementById('repos-list');
  list.innerHTML = '';

  if (repos.length === 0) {
    list.innerHTML = '<li style="padding:14px 16px;color:#888;">공개 저장소가 없습니다.</li>';
    reposSection.classList.remove('hidden');
    return;
  }

  repos.forEach(function (repo) {
    const li = document.createElement('li');
    li.className = 'repo-item';
    li.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <div class="repo-badges">
        <span class="badge blue">Stars: <strong>${repo.stargazers_count}</strong></span>
        <span class="badge gray">Watchers: <strong>${repo.watchers_count}</strong></span>
        <span class="badge green">Forks: <strong>${repo.forks_count}</strong></span>
      </div>
    `;
    list.appendChild(li);
  });

  reposSection.classList.remove('hidden');
}


// =============================================
// 날짜 포맷: ISO → YYYY-MM-DD
// =============================================
function formatDate(isoString) {
  if (!isoString) return 'N/A';
  return isoString.slice(0, 10); // "2018-04-26T11:07:53Z" → "2018-04-26"
}


// =============================================
// 상태 메시지 유틸리티
// =============================================
function showStatus(message, type) {
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
