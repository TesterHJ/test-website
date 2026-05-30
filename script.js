// 카테고리 박스 클릭 이벤트
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
