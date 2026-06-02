let isAdmin = false;

// 로그인 모달 처리
const loginModal = document.getElementById("login-modal");
const openLoginBtn = document.getElementById("open-login");
const closeLoginBtn = document.getElementById("close-login");
const logoutBtn = document.getElementById("logout-btn");
const openRequestsBtn = document.getElementById("open-requests");

openLoginBtn.onclick = () => { loginModal.style.display = "flex"; };
closeLoginBtn.onclick = () => { loginModal.style.display = "none"; };
logoutBtn.onclick = () => {
  isAdmin = false;
  document.getElementById("admin-area").style.display = "none";
  logoutBtn.style.display = "none";
  openLoginBtn.style.display = "inline-block";
  openRequestsBtn.style.display = "none";
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

// 수정 모달 관련 변수
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const closeEditBtn = document.getElementById("close-edit");

let editingSiteId = null;
let editingCategory = null;

// 모달 열기 함수
function openModal(category) {
  modalTitle.textContent = category === "school" ? "학교 사이트" : "도구 사이트";
  siteIcons.innerHTML = "";

  sites.filter(s => s.category === category).forEach(site => {
    const div = document.createElement("div");
    div.className = "site-icon";
    div.setAttribute("data-desc", site.description || "설명이 없습니다");

    const formattedName = site.name.replace(/\(/g, "<br>(");

    div.innerHTML = `
      ${site.icon ? `<i class="${site.icon}"></i>` : ""}
      <span>${formattedName}</span>
    `;

    div.onclick = () => window.open(site.url, "_blank");

    // 관리자 모드일 때 수정/삭제 버튼 추가
    if (isAdmin) {
      const actionBox = document.createElement("div");
      actionBox.classList.add("action-buttons");

      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      editBtn.classList.add("edit-btn");
      editBtn.onclick = (e) => {
        e.stopPropagation();
        editingSiteId = site._id;
        editingCategory = site.category;

        // 기존 값 채워넣기
        document.getElementById("editName").value = site.name;
        document.getElementById("editUrl").value = site.url;
        document.getElementById("editCategory").value = site.category;
        document.getElementById("editIcon").value = site.icon || "";
        document.getElementById("editDescription").value = site.description || "";

        editModal.style.display = "flex";
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.classList.add("delete-btn");
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        await fetch("/api/deleteSite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteId: site._id })
        });
        await loadSites();
        openModal(category);
      };

      actionBox.appendChild(editBtn);
      actionBox.appendChild(delBtn);
      div.appendChild(actionBox);
    }

    siteIcons.appendChild(div);
  });

  siteModal.style.display = "flex";
}

// 수정 모달 닫기
closeEditBtn.onclick = () => { editModal.style.display = "none"; };

// 수정 저장 처리
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newName = document.getElementById("editName").value;
  const newUrl = document.getElementById("editUrl").value;
  const newCategory = document.getElementById("editCategory").value;
  const newIcon = document.getElementById("editIcon").value;
  const newDescription = document.getElementById("editDescription").value;

  await fetch("/api/updateSite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      siteId: editingSiteId,
      siteName: newName,
      siteUrl: newUrl,
      siteCategory: newCategory,
      siteIcon: newIcon,
      siteDescription: newDescription
    })
  });

  await loadSites();
  openModal(editingCategory);
  editModal.style.display = "none";
});


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
    const siteDescription = document.getElementById("siteDescription").value;

    const res = await fetch("/api/addSite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteName, siteUrl, siteCategory, siteIcon, siteDescription })
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
    isAdmin = true;
    document.getElementById("admin-area").style.display = "block";
    logoutBtn.style.display = "inline-block";
    openLoginBtn.style.display = "none";
    loginModal.style.display = "none";
    openRequestsBtn.style.display = "inline-block";
    alert("로그인 성공");
  } else {
    alert("로그인 실패");
  }
});

// 요청 모달 처리
const requestModal = document.getElementById("request-modal");
const openRequestBtn = document.getElementById("open-request");
const closeRequestBtn = document.getElementById("close-request");

openRequestBtn.onclick = () => { requestModal.style.display = "flex"; };
closeRequestBtn.onclick = () => { requestModal.style.display = "none"; };

document.getElementById("request-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const reqName = document.getElementById("reqName").value;
  const reqUrl = document.getElementById("reqUrl").value;
  const reqCategory = document.getElementById("reqCategory").value;
  const reqReason = document.getElementById("reqReason").value;

  const res = await fetch("/api/addRequest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteName: reqName, siteUrl: reqUrl, siteCategory: reqCategory, siteReason: reqReason })
  });

  if (res.status === 200) {
    alert("요청이 제출되었습니다!");
    requestModal.style.display = "none";
  } else {
    alert("요청 제출 실패");
  }
});

// 요청 목록 모달 (관리자용)
const requestsModal = document.getElementById("requests-modal");
const requestsTableBody = document.querySelector("#requests-table tbody");
const closeRequestsBtn = document.getElementById("close-requests");

let currentPage = 1;
const pageSize = 10;

async function loadRequests(page = 1) {
  const res = await fetch(`/api/getRequests?page=${page}&limit=${pageSize}`);
  const data = await res.json();
  requestsTableBody.innerHTML = "";

  data.requests.forEach(req => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${req.name}</td>
      <td>${req.url}</td>
      <td>${req.category}</td>
      <td>${req.reason}</td>
      <td>
        <button class="approve">승인</button>
        <button class="reject">거절</button>
      </td>
    `;

    // 승인 버튼
    tr.querySelector(".approve").onclick = async () => {
      await fetch("/api/approveRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: req._id,
          siteName: req.name,
          siteUrl: req.url,
          siteCategory: req.category,
          siteIcon: "fa-solid fa-globe",
          siteDescription: ""
        })
      });
      tr.remove();
      await loadSites();
    };

    // 거절 버튼
    tr.querySelector(".reject").onclick = async () => {
      await fetch("/api/rejectRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: req._id })
      });
      tr.remove();
    };

    requestsTableBody.appendChild(tr);
  });

  // 페이지네이션 버튼
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = `
    <button ${data.currentPage === 1 ? "disabled" : ""}
     onclick="loadRequests(${data.currentPage - 1})">이전</button>
    <span>${data.currentPage} / ${data.totalPages}</span>
    <button ${data.currentPage === data.totalPages ? "disabled" : ""}
     onclick="loadRequests(${data.currentPage + 1})">다음</button>
  `;
}

openRequestsBtn.onclick = () => {
  loadRequests(1);
  requestsModal.style.display = "flex";
};

closeRequestsBtn.onclick = () => { requestsModal.style.display = "none"; };


// ESC 키로 모든 모달 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll("#login-modal, #site-modal, #request-modal, #requests-modal")
      .forEach(modal => modal.style.display = "none");
  }
});

// 배경 클릭 시 모달 닫기
document.querySelectorAll("#login-modal, #site-modal, #request-modal, #requests-modal")
  .forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) { // 배경 영역 클릭 시
        modal.style.display = "none";
      }
    });
  });

// 초기 로드
loadSites();
