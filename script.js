// 사이트 목록 불러오기 (모든 사용자 가능)
async function loadSites() {
  const res = await fetch("/api/sites");
  const sites = await res.json();
  const listDiv = document.getElementById("site-list");
  if (!listDiv) return;
  listDiv.innerHTML = "";
  sites.forEach(site => {
    const btn = document.createElement("button");
    btn.textContent = site.name;
    btn.onclick = () => window.location.href = site.url;
    listDiv.appendChild(btn);
  });
}

// 관리자 로그인 처리
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      document.getElementById("login-area").style.display = "none";
      document.getElementById("admin-area").style.display = "block";
      loadSites();
    } else {
      alert("로그인 실패");
    }
  });
}

// 사이트 추가 (관리자만 가능)
const addSiteForm = document.getElementById("add-site-form");
if (addSiteForm) {
  addSiteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const siteName = document.getElementById("siteName").value;
    const siteUrl = document.getElementById("siteUrl").value;

    await fetch("/api/addSite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteName, siteUrl })
    });

    loadSites();
  });
}

// 페이지 로드 시 목록 불러오기
window.onload = loadSites;
