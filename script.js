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
    div.innerHTML = `<span>${site.name}</span>`;
    div.onclick = () => window.open(site.url, "_blank");

    // 관리자 모드일 때 수정/삭제 버튼 추가
    if (isAdmin) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      editBtn.onclick = async () => {
        const newName = prompt("새 이름:", site.name);
        const newUrl = prompt("새 URL:", site.url);
        const newCategory = prompt("새 카테고리:", site.category);
        if (newName && newUrl && newCategory) {
          await fetch("/api/updateSite", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id: site._id, name: newName, url: newUrl, siteCategory: newCategory })
          });
          await loadSites();
          openModal(category);
        }
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = async () => {
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

    const res = await fetch("/api/addSite", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ siteName, siteUrl, siteCategory })
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

// 초기 로드
loadSites();
