export default function handler(req, res) {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ error: "아이디와 패스워드를 입력해주세요." });
    }
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        res.status(200).json({ message: "로그인 성공" });
    }
    return res.status(401).json({ error: "아이디나 패스워드가 일치하지 않습니다." });
}
