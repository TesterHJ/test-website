let token = null;
let isAdmin = false;

// 로그인 모달 처리
const loginModal = document.getElementById("login-modal");
const openLoginBtn = document.getElementById("open-login");
const closeLoginBtn = document.getElementById("close-login");
const logoutBtn = document.getElementById("logout-btn");

openLoginBtn.onclick = () => { loginModal.style.display = "flex"; };
closeLoginBtn.onclick = () => { loginModal.style.display = "none"; };
logoutBtn.onclick = () => {
  isAdmin = false;
  token = null;
  document.getElementById("admin-area").style.display = "none";
  logoutBtn.style.display = "none";
  openLoginBtn.style.display = "inline-block";
  alert("로그아웃되었습니다.");
};

// 사이트 모달 처리
const schoolCard = document.getElementById("school-sites");
const toolCard = document.getElementById("tool-sites");
const siteModal = document.getElementById("site-modal");
const siteIcons = document.getElementById("site-icons");
const modalTitle = document.getElementById("modal-title");
const closeSiteModal = document.getElementById("close-site-modal");

let sites = [];

// DB에서 사이트 목록 불러오기
async function loadSites() {
  const res = await fetch("/api/sites");
  sites = await res.json();
}

// 모달 열기 함수
function openModal(category) {
  modalTitle.textContent = category === "school" ? "학교 사이트" : "도구 사이트";
  siteIcons.innerHTML = "";

  sites.filter(s => s.category === category).forEach(site => {
    const div = document.createElement("div");
    div.className = "site-icon";

    div.innerHTML = `
      ${site.icon ? `<i class="${site.icon}"></i>` : ""}
      <span>${site.name}</span>
    `;

    div.onclick = () => window.open(site.url, "_blank");

    // 관리자 모드일 때 수정/삭제 버튼 추가
    if (isAdmin) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      editBtn.onclick = async (e) => {
        e.stopPropagation();
        const newName = prompt("새 이름:", site.name);
        const newUrl = prompt("새 URL:", site.url);
        const newCategory = prompt("새 카테고리:", site.category);
        const newIcon = prompt("새 아이콘 클래스명:", site.icon || "");
        if (newName && newUrl && newCategory && newIcon) {
          await fetch("/api/updateSite", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id: site._id, name: newName, url: newUrl, siteCategory: newCategory, icon: newIcon })
          });
          await loadSites();
          openModal(category);
        }
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        await fetch("/api/deleteSite", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ id: site._id })
        });
        await loadSites();
        openModal(category);
      };

      div.appendChild(editBtn);
      div.appendChild(delBtn);
    }

    siteIcons.appendChild(div);
  });

  siteModal.style.display = "flex";
}

// 카드 클릭 이벤트
schoolCard.onclick = () => openModal("school");
toolCard.onclick = () => openModal("tool");
closeSiteModal.onclick = () => { siteModal.style.display = "none"; };

// 관리자 사이트 추가
const addSiteForm = document.getElementById("add-site-form");
if (addSiteForm) {
  addSiteForm.addEventListener("submit", async e => {
    e.preventDefault();
    const siteName = document.getElementById("siteName").value;
    const siteUrl = document.getElementById("siteUrl").value;
    const siteCategory = document.getElementById("siteCategory").value;
    const siteIcon = document.getElementById("siteIcon").value;

    const res = await fetch("/api/addSite", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ siteName, siteUrl, siteCategory, icon: siteIcon })
    });

    if (res.status === 200) {
      alert("사이트가 추가되었습니다!");
      await loadSites();
    } else {
      alert("추가 실패");
    }
  });
}

// 로그인 처리
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.status === 200) {
    token = data.token;
    isAdmin = true;
    document.getElementById("admin-area").style.display = "block";
    logoutBtn.style.display = "inline-block";
    openLoginBtn.style.display = "none";
    loginModal.style.display = "none";
    alert("로그인 성공");
  } else {
    alert("로그인 실패");
  }
});

// -------------------- 요청 시스템 --------------------

// 요청 폼 열기 (카테고리 자동 선택)
function openRequestForm(category) {
  document.getElementById("request-area").style.display = "block";
  document.getElementById("siteRequestCategory").value = category;
}

// 요청 제출 처리
document.getElementById("request-site-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const siteName = document.getElementById("siteRequestName").value;
  const reason = document.getElementById("siteRequestReason").value;
  const category = document.getElementById("siteRequestCategory").value;
  const url = document.getElementById("siteRequestUrl").value;

  const response = await fetch("/api/requestSite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteName, reason, category, url })
  });

  if (response.ok) {
    alert("요청이 성공적으로 저장되었습니다!");
    e.target.reset();
    document.getElementById("request-area").style.display = "none";
    loadRequests();
  } else {
    alert("요청 저장 중 오류가 발생했습니다.");
  }
});

// 관리자 요청 목록 불러오기 (표 형식)
async function loadRequests() {
  const response = await fetch("/api/getRequests");
  const requests = await response.json();

  const list = document.getElementById("request-list");
  list.innerHTML = "";

  if (requests.length === 0) {
    list.textContent = "현재 요청이 없습니다.";
    return;
  }

  const table = document.createElement("table");
  table.className = "request-table";

  const header = table.insertRow();
  ["사이트 이름", "이유", "카테고리", "URL", "승인", "거절"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    header.appendChild(th);
  });

  requests.forEach(req => {
    const row = table.insertRow();
    row.insertCell().textContent = req.siteName;
    row.insertCell().textContent = req.reason;
    row.insertCell().textContent = req.category;
    row.insertCell().textContent = req.url;

    // 승인 버튼
    const approveCell = row.insertCell();
    const approveBtn = document.createElement("button");
    approveBtn.textContent = "승인";
    approveBtn.onclick = async () => {
      await fetch("/api/approveRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName: req.siteName })
      });
      alert("승인되었습니다.");
      loadRequests();
      await loadSites(); // 승인 후 사이트 목록 갱신
    };
    approveCell.appendChild(approveBtn);

    // 거절 버튼
    const rejectCell = row.insertCell();
    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "거절";
    rejectBtn.onclick = async () => {
      await fetch("/api/rejectRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName: req.siteName })
      });
      alert("거절되었습니다.");
      loadRequests();
    };
    rejectCell.appendChild(rejectBtn);
  });

  list.appendChild(table);
}

// -------------------- 초기 로드 --------------------
window.onload = async () => {
  await loadSites();
  await loadRequests();
};
