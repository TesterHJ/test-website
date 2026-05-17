// GitHub OAuth 로그인 요청
function login() {
  const clientId = "발급받은_Client_ID"; // GitHub OAuth App에서 발급받은 Client ID
  const redirectUri = "https://사용자명.github.io/university-tools"; // 본인 GitHub Pages 주소
  const scope = "repo"; // 저장소 접근 권한

  window.location.href =
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
}

// Access Token을 받아온 뒤 사용자 정보 확인
// 실제로는 Authorization Code -> Access Token 교환을 외부 서버에서 처리해야 함
function checkUser(accessToken) {
  fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${accessToken}` }
  })
    .then(res => res.json())
    .then(user => {
      console.log("로그인 사용자:", user.login);
      if (user.login === "개발자GitHub아이디") {
        // 관리자 모드 활성화
        document.getElementById("adminPanel").style.display = "block";
      } else {
        alert("관리자 권한이 없습니다.");
      }
    })
    .catch(err => {
      console.error("사용자 정보 확인 실패:", err);
    });
}

// 관리자 모드에서 사이트 추가 (예시)
function addSite() {
  const name = document.getElementById("siteName").value;
  const url = document.getElementById("siteURL").value;
  alert(`새 사이트 추가: ${name} (${url})`);

  // 실제 구현에서는 GitHub API를 호출해 links.json 파일을 수정해야 함
}
