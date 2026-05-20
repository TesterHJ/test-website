let isAdmin = false;

// 사이트 목록 불러오기
async function loadSites() {
  const res = await fetch("/api/sites");
  const sites = await res.json();
  const listBody = document.getElementById("site-list");
  if (!listBody) return;
  listBody.innerHTML = "";

  sites.forEach(site => {
    const row = document.createElement("tr");

    // 이름
    const nameCell = document.createElement("td");
    nameCell.textContent = site.name;
    row.appendChild(nameCell);

    // 주소
    const urlCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = site.url;
    link.textContent = site.url;
    link.target = "_blank";
    urlCell.appendChild(link);
    row.appendChild(urlCell);

    // 관리자 기능
    if (isAdmin) {
      const actionCell = document.createElement("td");

      // 삭제 버튼
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

      // 수정 버튼
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

  // 관리자일 경우 테이블 헤더 표시
  document.getElementById("admin-header").style.display = isAdmin ? "table-cell" : "none";
}

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
      document.getElementById("admin-area").style.display = "block";
      alert("관리자 로그인 성공!");
      loadSites();
    } else {
      alert("로그인 실패");
    }
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
