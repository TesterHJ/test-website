const API_BASE = "https://project-awhww.vercel.app/"; // Vercel 도메인

document.getElementById("add-site-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const siteName = document.getElementById("siteName").value;
  const siteUrl = document.getElementById("siteUrl").value;

  try {
    const res = await fetch(`${API_BASE}/api/addSite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteName, siteUrl })
    });

    if (!res.ok) {
      const error = await res.json();
      alert("추가 실패: " + error.error + " / " + (error.detail || ""));
      return;
    }

    loadSites();
  } catch (err) {
    alert("네트워크 오류: " + err.message);
  }
});

async function loadSites() {
  try {
    const res = await fetch(`${API_BASE}/api/sites`);
    if (!res.ok) throw new Error("사이트 목록 불러오기 실패");
    const sites = await res.json();

    const listDiv = document.getElementById("site-list");
    listDiv.innerHTML = "";
    sites.forEach(site => {
      const btn = document.createElement("button");
      btn.textContent = site.name;
      btn.onclick = () => window.open(site.url, "_blank");
      listDiv.appendChild(btn);
    });
  } catch (err) {
    alert(err.message);
  }
}
