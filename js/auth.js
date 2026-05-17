function login() {
  const clientId = "Ov23li9ERM0fBAwVc3Wo";
  const redirectUri = "https://testerhj.github.io/test-website/";
  const scope = "repo";

  window.location.href =
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
}
