let isAdmin = false;

// 로그인 모달 열기/닫기
const loginModal = document.getElementById("login-modal");
const openLoginBtn = document.getElementById("open-login");
const closeLoginBtn = document.getElementById("close-login");
const logoutBtn = document.getElementById("logout-btn");

openLoginBtn.onclick = () => { loginModal.style.display = "flex"; };
closeLoginBtn.onclick = () => { loginModal.style.display = "none"; };
document.addEventListener("keydown", e => { if (e.key === "Escape") loginModal.style.display = "none"; });
loginModal.addEventListener("click", e => { if (e.target === loginModal) loginModal.style.display = "none"; });

// 로그인 처리
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      isAdmin = true;
      loginModal.style.display = "none";
      document.getElementById("admin-area").style.display = "block";
      openLoginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      alert("관리자 로그인 성공!");
    } else {
      alert("로그인 실패");
    }
  });
}

// 로그아웃 처리
logoutBtn.onclick = () => {
  isAdmin = false;
  document.getElementById("admin-area").style.display = "none";
  logoutBtn.style.display = "none";
  openLoginBtn.style.display = "inline-block";
  alert("로그아웃되었습니다.");
};

// 사이트 선택 모달
const schoolCard = document.getElementById("school-sites");
const toolCard = document.getElementById("tool-sites");
const siteModal = document.getElementById("site-modal");
const siteIcons = document.getElementById("site-icons");
const modalTitle = document.getElementById("modal-title");
const closeSiteModal = document.getElementById("close-site-modal");

// 예시 데이터
const schoolSites = [
  { name: "학교 홈페이지", url: "https://school.ac.kr", icon: "img/school.png" },
  { name: "학사 시스템", url: "https://haksa.ac.kr", icon: "img/system.png" }
];
const toolSites = [
  { name: "구글", url: "https://google.com", icon: "img/google.png" },
  { name: "깃허브", url: "https://github.com", icon: "img/github.png" }
];

function openModal(title, sites) {
  modalTitle.textContent = title;
  siteIcons.innerHTML = "";
  sites.forEach(site => {
    const div = document.createElement("div");
    div.className = "site-icon";
    div.innerHTML = `<img src="${site.icon}" alt="${site.name}"><span>${site.name}</span>`;
    div.onclick = () => window.open(site.url, "_blank");
    siteIcons.appendChild(div);
  });
  siteModal.style.display = "flex";
}

schoolCard.onclick = () => openModal("학교 사이트", schoolSites);
toolCard.onclick = () => openModal("도구 사이트", toolSites);

closeSiteModal.onclick = () => {
  siteModal.style.display = "none";
};
