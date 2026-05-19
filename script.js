const API_BASE = "https://project-awhww.vercel.app"; // Vercel 배포 주소

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_BASE}/api/login`, {
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

async function loadSites() {
  const res = await fetch(`${API_BASE}/api/sites`);
  const sites = await res.json();
  const listDiv = document.getElementById("site-list");
  listDiv.innerHTML = "";
  sites.forEach(site => {
    const btn = document.createElement("button");
    btn.textContent = site.name;
    btn.onclick = () => window.open(site.url, "_blank");
    listDiv.appendChild(btn);
  });
}
