function login() {
  const clientId = "발급받은_Client_ID";
  const redirectUri = "https://사용자명.github.io/university-tools";
  const scope = "repo";

  window.location.href =
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
}

// Access Token을 받아온 뒤 사용자 정보 확인
function checkUser(accessToken) {
  fetch("https://api.github.com/user", {
    headers: { Authorization: `token ${accessToken}` }
  })
    .then(res => res.json())
    .then(user => {
      if (user.login === "개발자GitHub아이디") {
        document.getElementById("adminPanel").style.display = "block";
      } else {
        alert("관리자 권한이 없습니다.");
      }
    });
}
