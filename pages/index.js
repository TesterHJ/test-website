export default function Home() {
  return (
    <div>
      <h1>내 웹페이지</h1>
      <div id="login-area">
        <form id="login-form">
          <input type="text" id="username" placeholder="아이디" />
          <input type="password" id="password" placeholder="패스워드" />
          <button type="submit">로그인</button>
        </form>
      </div>
      <div id="admin-area" style={{ display: "none" }}>
        <h2>관리자 메뉴</h2>
        <form id="add-site-form">
          <input type="text" id="siteName" placeholder="사이트 이름" />
          <input type="url" id="siteUrl" placeholder="사이트 주소" />
          <button type="submit">사이트 추가</button>
        </form>
        <div id="site-list"></div>
      </div>
      <script src="/script.js" defer></script>
    </div>
  );
}
