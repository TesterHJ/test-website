let isAdmin = false;

// 모달 열기/닫기
const loginModal = document.getElementById("login-modal");
const openLoginBtn = document.getElementById("open-login");
const closeLoginBtn = document.getElementById("close-login");
const logoutBtn = document.getElementById("logout-btn");

openLoginBtn.onclick = () => {
  loginModal.style.display = "flex";
};
closeLoginBtn.onclick = () => {
  loginModal.style.display = "none";
};

// ESC 키로 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    loginModal.style.display = "none";
  }
});

// 배경 클릭 시 닫기
loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});

// 로그인 처리
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
      isAdmin = true;
      loginModal.style.display = "none"; // 로그인 성공 시 모달 닫기
      document.getElementById("admin-area").style.display = "block";
      document.getElementById("admin-header").style.display = "table-cell";
      openLoginBtn.style.display = "none"; // 로그인 버튼 숨김
      logoutBtn.style.display = "inline-block"; // 로그아웃 버튼 표시
      alert("관리자 로그인 성공!");
      loadSites();
    } else {
      alert("로그인 실패");
    }
  });
}

// 로그아웃 처리
logoutBtn.onclick = () => {
  isAdmin = false;
  document.getElementById("admin-area").style.display = "none";
  document.getElementById("admin-header").style.display = "none";
  logoutBtn.style.display = "none";
  openLoginBtn.style.display = "inline-block";
  alert("로그아웃되었습니다.");
  loadSites();
};

// 사이트 목록 불러오기
async function loadSites() {
  const res = await fetch("/api/sites");
  const sites = await res.json();
  const listBody = document.getElementById("site-list");
  if (!listBody) return;
  listBody.innerHTML = "";

  sites.forEach(site => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = site.name;
    row.appendChild(nameCell);

    const urlCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = site.url;
    link.textContent = site.url;
    link.target = "_blank";
    urlCell.appendChild(link);
    row.appendChild(urlCell);

    if (isAdmin) {
      const actionCell = document.createElement("td");

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = async () => {
        await fetch("/api/deleteSite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: site._id })
        });
        loadSites();
      };
      actionCell.appendChild(delBtn);

      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      editBtn.style.marginLeft = "10px";
      editBtn.onclick = async () => {
        const newName = prompt("새 이름 입력:", site.name);
        const newUrl = prompt("새 URL 입력:", site.url);
        if (newName && newUrl) {
          await fetch("/api/updateSite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: site._id, name: newName, url: newUrl })
          });
          loadSites();
        }
      };
      actionCell.appendChild(editBtn);

      row.appendChild(actionCell);
    }

    listBody.appendChild(row);
  });
}

// 사이트 추가
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
