// Sinh trang Kiến thức (guide) tĩnh từ Markdown: content/guide/<lang>/<slug>.md
// Chạy: node scripts/build-guide.mjs  (không cần cài gì). Kết quả ghi vào guide/ và sitemap.xml,
// commit cả kết quả vì GitHub Pages chỉ phục vụ file tĩnh.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderFigure } from "../content/guide/figures.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://hongson-kalect.github.io/fastfast-landing";
const LANGS = ["en", "vi"];

const UI = {
  en: {
    guide: "Fasting guide",
    hubTitle: "Fasting guide – science, safety and how-tos | FastFast",
    hubLead:
      "Clear, sourced articles on intermittent fasting: how it works, what the research really says, how to stay safe, and how to get the most out of FastFast.",
    home: "Home",
    min: (n) => `${n} min read`,
    updated: "Updated",
    sources: "Sources",
    related: "Related articles",
    disclaimer:
      "This article is general information, not medical advice. Talk to a doctor before fasting if you have a medical condition, are pregnant or take medication.",
    ctaTitle: "Track your fasts with FastFast",
    ctaBody: "A calm, private fasting timer with streaks, a yearly Journey and home-screen widgets. No ads, no account.",
    ctaButton: "Get it on Google Play",
    soon: "Coming soon",
    otherLang: "Tiếng Việt",
    privacy: "Privacy Policy",
    articles: (n) => `${n} articles`,
  },
  vi: {
    guide: "Kiến thức nhịn ăn",
    hubTitle: "Kiến thức nhịn ăn – khoa học, an toàn và hướng dẫn | FastFast",
    hubLead:
      "Các bài viết rõ ràng, có nguồn về nhịn ăn gián đoạn: cơ chế, nghiên cứu thật sự nói gì, cách nhịn an toàn và cách dùng FastFast hiệu quả.",
    home: "Trang chủ",
    min: (n) => `${n} phút đọc`,
    updated: "Cập nhật",
    sources: "Nguồn tham khảo",
    related: "Bài liên quan",
    disclaimer:
      "Bài viết chỉ mang tính thông tin chung, không thay thế tư vấn y tế. Hãy hỏi bác sĩ trước khi nhịn nếu bạn có bệnh nền, đang mang thai hoặc dùng thuốc.",
    ctaTitle: "Theo dõi phiên nhịn với FastFast",
    ctaBody: "Đồng hồ nhịn ăn gọn gàng, riêng tư, có streak, lịch Journey cả năm và widget màn hình chính. Không quảng cáo, không cần tài khoản.",
    ctaButton: "Tải trên Google Play",
    soon: "Sắp ra mắt",
    otherLang: "English",
    privacy: "Chính sách quyền riêng tư",
    articles: (n) => `${n} bài`,
  },
};

const CATEGORIES = [
  {
    id: "basics",
    en: ["Getting started", "What intermittent fasting is, the common schedules and how to begin."],
    vi: ["Bắt đầu", "Nhịn ăn gián đoạn là gì, các kiểu nhịn phổ biến và cách bắt đầu."],
  },
  {
    id: "science",
    en: ["The science", "What happens in your body, and how strong the evidence really is."],
    vi: ["Khoa học", "Điều gì xảy ra trong cơ thể, và bằng chứng mạnh đến đâu."],
  },
  {
    id: "safety",
    en: ["Safety & side effects", "Who should not fast, warning signs, hydration and breaking a fast."],
    vi: ["An toàn & tác dụng phụ", "Ai không nên nhịn, dấu hiệu cảnh báo, nước và cách ăn lại."],
  },
  {
    id: "lifestyle",
    en: ["Everyday life", "Fitting fasting around exercise, sleep, work and social meals."],
    vi: ["Sinh hoạt hằng ngày", "Kết hợp nhịn ăn với tập luyện, giấc ngủ, công việc và ăn uống cùng mọi người."],
  },
  {
    id: "app",
    en: ["Using FastFast", "Step-by-step guides to every feature of the app."],
    vi: ["Dùng FastFast", "Hướng dẫn từng bước cho các tính năng của app."],
  },
];

// ─── Markdown tối giản: ##, ###, đoạn, danh sách -, 1., > ghi chú, bảng |, **đậm**, *nghiêng*, [link](url),
// hình minh hoạ ![chú thích](figure:tên) lấy từ content/guide/figures.mjs

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const inline = (s) =>
  escape(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, text, url) => {
      const external = /^https?:/.test(url);
      return `<a href="${url}"${external ? ' rel="noopener" target="_blank"' : ""}>${text}</a>`;
    });

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const markdown = (src, lang) => {
  const lines = src.split(/\r?\n/);
  const out = [];
  const toc = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    let m;
    if ((m = line.match(/^!\[(.*)\]\(figure:(\w+)\)$/))) {
      out.push(`<figure class="fig">${renderFigure(m[2], lang)}<figcaption>${inline(m[1])}</figcaption></figure>`);
      i++;
    } else if ((m = line.match(/^(#{2,3}) (.+)/))) {
      const level = m[1].length;
      const id = slugify(m[2]);
      if (level === 2) toc.push({ id, text: m[2] });
      out.push(`<h${level} id="${id}">${inline(m[2])}</h${level}>`);
      i++;
    } else if (/^[-*] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) items.push(lines[i++].slice(2));
      out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ul>`);
    } else if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ""));
      out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ol>`);
    } else if (line.startsWith("> ")) {
      const parts = [];
      while (i < lines.length && lines[i].startsWith(">")) parts.push(lines[i++].replace(/^> ?/, ""));
      out.push(`<aside class="callout">${parts.map((p) => `<p>${inline(p)}</p>`).join("")}</aside>`);
    } else if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const cells = (r) => r.split("|").slice(1, -1).map((c) => c.trim());
      const [head, , ...body] = rows;
      out.push(
        `<div class="table-wrap"><table><thead><tr>${cells(head).map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body
          .map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`,
      );
    } else {
      const parts = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,3} |[-*] |\d+\. |> |\||!\[)/.test(lines[i])) parts.push(lines[i++]);
      out.push(`<p>${inline(parts.join(" "))}</p>`);
    }
  }
  return { html: out.join("\n"), toc };
};

// ─── Đọc bài

const parse = (file) => {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`Thiếu frontmatter: ${file}`);
  const meta = Object.fromEntries(
    m[1].split(/\r?\n/).map((l) => {
      const at = l.indexOf(":");
      return [l.slice(0, at).trim(), l.slice(at + 1).trim()];
    }),
  );
  // Tách phần Nguồn ở cuối để hiển thị riêng
  const [body, sources] = m[2].split(/^## (?:Sources|Nguồn tham khảo)\s*$/m);
  return {
    ...meta,
    order: Number(meta.order ?? 99),
    body,
    sources: (sources ?? "")
      .split(/\r?\n/)
      .filter((l) => /^[-*] /.test(l))
      .map((l) => l.slice(2)),
  };
};

const articles = {};
for (const lang of LANGS) {
  const dir = join(ROOT, "content", "guide", lang);
  articles[lang] = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, ""), ...parse(join(dir, f)) }))
    .sort((a, b) => a.order - b.order);
}

// Mỗi bài phải có đủ hai ngôn ngữ để link chéo và hreflang đúng
for (const lang of LANGS) {
  for (const a of articles[lang]) {
    for (const other of LANGS) {
      if (!articles[other].some((b) => b.slug === a.slug)) {
        throw new Error(`Bài ${lang}/${a.slug} thiếu bản ${other}`);
      }
    }
  }
}

const words = (s) => s.split(/\s+/).filter(Boolean).length;

// ─── Khung trang

const page = ({ lang, title, description, path, altPath, body, depth }) => {
  const up = "../".repeat(depth);
  const t = UI[lang];
  const other = LANGS.find((l) => l !== lang);
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#0E1117">
  <link rel="canonical" href="${SITE}/${path}">
  <link rel="alternate" hreflang="${lang}" href="${SITE}/${path}">
  <link rel="alternate" hreflang="${other}" href="${SITE}/${altPath}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:image" content="${SITE}/assets/icon-512.png">
  <meta property="og:type" content="article">
  <link rel="icon" type="image/png" href="${up}assets/favicon-48.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${up}styles.css">
</head>
<body>
  <header class="top">
    <div class="wrap">
      <a class="brand" href="${up}index.html?lang=${lang}"><img src="${up}assets/icon-256.png" alt="" width="32" height="32">FastFast</a>
      <nav class="nav">
        <a href="${up}guide/${lang}/">${t.guide}</a>
      </nav>
      <a class="lang lang-link" href="${up}${altPath}" hreflang="${other}" data-set-lang="${other}">${t.otherLang}</a>
    </div>
  </header>
  <main>
${body}
  </main>
  <footer class="foot">
    <div class="wrap">
      <span>© 2026 FastFast</span>
      <span><a href="${up}index.html?lang=${lang}">${t.home}</a> · <a href="${up}guide/${lang}/">${t.guide}</a> · <a href="${up}privacy.html?lang=${lang}">${t.privacy}</a></span>
    </div>
  </footer>
  <script>
    // Nhớ ngôn ngữ đã chọn để trang chủ và /guide/ mở đúng ngôn ngữ
    try { localStorage.setItem("fastfast-lang", "${lang}"); } catch (e) {}
    document.querySelectorAll("[data-set-lang]").forEach(function (a) {
      a.addEventListener("click", function () {
        try { localStorage.setItem("fastfast-lang", a.getAttribute("data-set-lang")); } catch (e) {}
      });
    });
  </script>
</body>
</html>
`;
};

const cta = (lang) => {
  const t = UI[lang];
  return `<section class="guide-cta">
      <img src="../../assets/icon-256.png" alt="" width="56" height="56">
      <div>
        <h2>${t.ctaTitle}</h2>
        <p>${t.ctaBody}</p>
        <!-- TODO: thay href bằng link Google Play khi app lên store -->
        <a class="btn btn-play" href="#">${t.ctaButton}</a> <span class="soon">${t.soon}</span>
      </div>
    </section>`;
};

const card = (a, lang) => `<a class="guide-card" href="${a.slug}.html">
          <span class="guide-icon">${a.icon ?? "📄"}</span>
          <span>
            <strong>${escape(a.title)}</strong>
            <span>${escape(a.description)}</span>
            <small>${UI[lang].min(Math.max(1, Math.round(words(a.body) / 200)))}</small>
          </span>
        </a>`;

// ─── Ghi file

rmSync(join(ROOT, "guide"), { recursive: true, force: true });
const urls = [];

for (const lang of LANGS) {
  const t = UI[lang];
  const other = LANGS.find((l) => l !== lang);
  const outDir = join(ROOT, "guide", lang);
  mkdirSync(outDir, { recursive: true });

  // Trang mục lục
  const sections = CATEGORIES.map((c) => {
    const list = articles[lang].filter((a) => a.category === c.id);
    if (!list.length) return "";
    const [name, desc] = c[lang];
    return `<section class="guide-section" id="${c.id}">
      <h2>${name} <small>${t.articles(list.length)}</small></h2>
      <p class="muted">${desc}</p>
      <div class="guide-grid">
        ${list.map((a) => card(a, lang)).join("\n        ")}
      </div>
    </section>`;
  }).join("\n");

  const chips = CATEGORIES.filter((c) => articles[lang].some((a) => a.category === c.id))
    .map((c) => `<a href="#${c.id}">${c[lang][0]}</a>`)
    .join("");

  writeFileSync(
    join(outDir, "index.html"),
    page({
      lang,
      title: t.hubTitle,
      description: t.hubLead,
      path: `guide/${lang}/`,
      altPath: `guide/${other}/`,
      depth: 2,
      body: `<div class="wrap guide-hub">
    <span class="eyebrow">FastFast</span>
    <h1>${t.guide}</h1>
    <p class="lead">${t.hubLead}</p>
    <nav class="guide-chips">${chips}</nav>
    ${sections}
    <p class="guide-disclaimer">${t.disclaimer}</p>
  </div>`,
    }),
  );
  urls.push(`guide/${lang}/`);

  // Từng bài
  for (const a of articles[lang]) {
    const category = CATEGORIES.find((c) => c.id === a.category);
    const { html, toc } = markdown(a.body, lang);
    const related = articles[lang].filter((b) => b.category === a.category && b.slug !== a.slug).slice(0, 3);
    const minutes = Math.max(1, Math.round(words(a.body) / 200));

    writeFileSync(
      join(outDir, `${a.slug}.html`),
      page({
        lang,
        title: `${a.title} | FastFast`,
        description: a.description,
        path: `guide/${lang}/${a.slug}.html`,
        altPath: `guide/${other}/${a.slug}.html`,
        depth: 2,
        body: `<article class="wrap doc guide-article">
    <nav class="crumbs"><a href="./">${t.guide}</a> › <a href="./#${category.id}">${category[lang][0]}</a></nav>
    <h1>${a.icon ?? ""} ${escape(a.title)}</h1>
    <p class="lead">${escape(a.description)}</p>
    <p class="meta">${t.min(minutes)} · ${t.updated} ${a.updated}</p>
    ${toc.length > 2 ? `<nav class="toc"><ol>${toc.map((h) => `<li><a href="#${h.id}">${inline(h.text)}</a></li>`).join("")}</ol></nav>` : ""}
    ${html}
    ${a.sources.length ? `<section class="sources"><h2>${t.sources}</h2><ol>${a.sources.map((s) => `<li>${inline(s)}</li>`).join("")}</ol></section>` : ""}
    <p class="guide-disclaimer">${t.disclaimer}</p>
    ${cta(lang)}
    ${related.length ? `<section class="related"><h2>${t.related}</h2><div class="guide-grid">${related.map((r) => card(r, lang)).join("")}</div></section>` : ""}
  </article>`,
      }),
    );
    urls.push(`guide/${lang}/${a.slug}.html`);
  }
}

// /guide/ chuyển sang đúng ngôn ngữ (đã chọn trước đó hoặc theo trình duyệt)
writeFileSync(
  join(ROOT, "guide", "index.html"),
  `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>FastFast guide</title><link rel="canonical" href="${SITE}/guide/en/">
<script>
  var lang = "en";
  try { lang = localStorage.getItem("fastfast-lang") || (navigator.language || "").slice(0, 2); } catch (e) {}
  location.replace(lang === "vi" ? "vi/" : "en/");
</script></head>
<body><a href="en/">English</a> · <a href="vi/">Tiếng Việt</a></body></html>
`,
);

writeFileSync(
  join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["", "privacy.html", ...urls].map((u) => `  <url><loc>${SITE}/${u}</loc></url>`).join("\n")}
</urlset>
`,
);

console.log(`Đã sinh ${urls.length} trang (${LANGS.map((l) => `${l}: ${articles[l].length} bài`).join(", ")})`);
