document.getElementById("login-form").addEventListener("submit", async (e) => {
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

document.getElementById("add-site-form").addEventListener("submit", async (e) => {
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

async function loadSites() {
  const res = await fetch("/api/sites");
  const sites = await res.json();
  const listDiv = document.getElementById("site-list");
  listDiv.innerHTML = "";
  sites.forEach(site => {
    const btn = document.createElement("button");
    btn.textContent = site.name;
    btn.onclick = () => window.location.href = site.url;
    listDiv.appendChild(btn);
  });
}
