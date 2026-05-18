let sites = [
  { name: "학교 사이트", url: "https://school-site.com" },
  { name: "도구 사이트", url: "https://tool-site.com" }
];

export default function handler(req, res) {
  res.status(200).json(sites);
}
