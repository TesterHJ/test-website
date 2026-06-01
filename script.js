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

// 모달 열기 함수
function openModal(category) {
  modalTitle.textContent = category === "school" ? "학교 사이트" : "도구 사이트";
  siteIcons.innerHTML = "";

  sites.filter(s => s.category === category).forEach(site => {
    const div = document.createElement("div");
    div.className = "site-icon";

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
      editBtn.onclick = async (e) => {
        e.stopPropagation();
        const newName = prompt("새 이름:", site.name);
        const newUrl = prompt("새 URL:", site.url);
        const newCategory = prompt("새 카테고리:", site.category);
        const newIcon = prompt("새 아이콘 클래스명:", site.icon || "");
        if (newName && newUrl && newCategory && newIcon) {
          await fetch("/api/updateSite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: site._id,
              name: newName,
              url: newUrl,
              siteCategory: newCategory,
              icon: newIcon
            })
          });
          await loadSites();
          openModal(category);
        }
      };
  
      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.classList.add("delete-btn");
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        await fetch("/api/deleteSite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: site._id })
        });
        await loadSites();
        openModal(category);
      };

      // 수정/삭제 버튼을 actionBox에 넣고 div에 추가
      actionBox.appendChild(editBtn);
      actionBox.appendChild(delBtn);
      div.appendChild(actionBox);
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
      headers: { "Content-Type": "application/json" },
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
    body: JSON.stringify({ name: reqName, url: reqUrl, category: reqCategory, reason: reqReason })
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

openRequestsBtn.onclick = async () => {
  const res = await fetch("/api/getRequests");
  const requests = await res.json();
  requestsTableBody.innerHTML = "";

  requests.forEach(req => {
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

    tr.querySelector(".approve").onclick = async () => {
      await fetch("/api/approveRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      });
      tr.remove();
      await loadSites(); // 승인 후 사이트 목록 갱신
    };

    tr.querySelector(".reject").onclick = async () => {
      await fetch("/api/rejectRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: req._id })
      });
      tr.remove();
    };

    requestsTableBody.appendChild(tr);
  });

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
