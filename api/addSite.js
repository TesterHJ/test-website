let sites = [
  { name: "학교 사이트", url: "https://school-site.com" },
  { name: "도구 사이트", url: "https://tool-site.com" }
];

export default function handler(req, res) {
  const { siteName, siteUrl } = req.body;
  sites.push({ name: siteName, url: siteUrl });
  res.status(200).json({ message: "사이트 추가 완료" });
}
