// Hình minh hoạ cho bài viết, sinh SVG theo ngôn ngữ. Dùng trong Markdown: ![chú thích](figure:tên)
// SVG được nhúng thẳng vào trang nên màu lấy từ biến CSS của theme (tự đổi sáng/tối).

const T = {
  en: {
    hours: "h",
    noFood: "Hours without food",
    glucose: "Energy from glucose",
    fat: "Energy from fat & ketones",
    switch: "Metabolic switch",
    fed: "Fed",
    glycogen: "Glycogen",
    switchShort: "Metabolic switch",
    ketosis: "Ketosis",
    long: "Long fast",
    insulin: "Insulin ↓",
    fatBurn: "Fat burning ↑",
    ketones: "Ketones ↑",
    gh: "Growth hormone ↑ · autophagy?",
    fasting: "Fasting",
    eating: "Eating window",
    eat: "Eat",
    day: "Day",
    damaged: "Worn-out parts",
    wrap: "Wrapped in a membrane",
    lysosome: "Fused with a lysosome",
    recycled: "Recycled building blocks",
    fast: "Fast",
    rest: "Rest + shield",
    restNo: "Rest, no shield",
    shields: "Shields",
    streakOk: "Streak continues",
    streakBreak: "Streak breaks",
  },
  vi: {
    hours: "h",
    noFood: "Số giờ không ăn",
    glucose: "Năng lượng từ glucose",
    fat: "Năng lượng từ mỡ & ketone",
    switch: "Chuyển đổi chuyển hoá",
    fed: "Vừa ăn",
    glycogen: "Glycogen",
    switchShort: "Chuyển đổi",
    ketosis: "Ketosis",
    long: "Nhịn dài",
    insulin: "Insulin ↓",
    fatBurn: "Đốt mỡ ↑",
    ketones: "Ketone ↑",
    gh: "Hormone tăng trưởng ↑ · tự thực?",
    fasting: "Nhịn",
    eating: "Khung ăn",
    eat: "Ăn",
    day: "Ngày",
    damaged: "Bộ phận cũ hỏng",
    wrap: "Được gói trong màng",
    lysosome: "Hợp với lysosome",
    recycled: "Tái chế thành nguyên liệu",
    fast: "Nhịn",
    rest: "Nghỉ + khiên",
    restNo: "Nghỉ, hết khiên",
    shields: "Khiên",
    streakOk: "Streak vẫn tiếp tục",
    streakBreak: "Streak bị đứt",
  },
};

const svg = (w, h, label, body) =>
  `<svg class="fig-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

const text = (x, y, s, cls = "f-text", anchor = "middle") =>
  `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;

// ─── Chuyển đổi chuyển hoá: glucose giảm, mỡ/ketone tăng

const metabolicSwitch = (t) => {
  const x = (h) => 60 + h * 17.5;
  const ticks = [0, 12, 18, 24, 36]
    .map((h) => `<line x1="${x(h)}" y1="170" x2="${x(h)}" y2="176" class="f-axis"/>${text(x(h), 192, `${h}${t.hours}`, "f-small")}`)
    .join("");
  return svg(
    720,
    240,
    t.switch,
    `<rect x="${x(12)}" y="24" width="${x(18) - x(12)}" height="146" rx="8" class="f-band"/>
     ${text((x(12) + x(18)) / 2, 18, t.switch, "f-strong")}
     <line x1="60" y1="170" x2="690" y2="170" class="f-axis"/>
     ${ticks}
     ${text(375, 214, t.noFood, "f-small")}
     <path d="M60,45 C130,45 200,58 270,95 S440,150 480,152 L690,155" class="f-line f-warm"/>
     <path d="M60,155 C200,152 255,132 330,100 S450,52 690,45" class="f-line f-cool"/>
     <circle cx="70" cy="229" r="6" class="f-warm-fill"/>${text(82, 233, t.glucose, "f-small", "start")}
     <circle cx="330" cy="229" r="6" class="f-cool-fill"/>${text(342, 233, t.fat, "f-small", "start")}`,
  );
};

// ─── Dòng thời gian cơ thể 0–72h (0–24h giãn rộng, 24–72h nén lại)

const bodyTimeline = (t) => {
  const x = (h) => (h <= 24 ? 30 + (h / 24) * 450 : 480 + ((h - 24) / 48) * 210);
  const segs = [
    [0, 4, t.fed, "f-seg1"],
    [4, 12, t.glycogen, "f-seg2"],
    [12, 18, t.switchShort, "f-seg3"],
    [18, 24, t.ketosis, "f-seg4"],
    [24, 72, t.long, "f-seg5"],
  ];
  const notes = [
    [4, 12, t.insulin],
    [12, 18, t.fatBurn],
    [18, 24, t.ketones],
    [24, 72, t.gh],
  ];
  return svg(
    720,
    200,
    "Timeline",
    `${segs
      .map(
        ([a, b, label, cls]) =>
          `<rect x="${x(a) + 1}" y="70" width="${x(b) - x(a) - 2}" height="30" rx="8" class="${cls}"/>${text((x(a) + x(b)) / 2, 58, label, "f-strong")}`,
      )
      .join("")}
     ${[0, 4, 12, 18, 24, 48, 72].map((h) => text(x(h), 122, `${h}${t.hours}`, "f-small")).join("")}
     ${notes.map(([a, b, s], i) => text((x(a) + x(b)) / 2, 155 + (i % 2) * 22, s, "f-muted")).join("")}`,
  );
};

// ─── Các kiểu nhịn: đồng hồ 24h, cung khung ăn

const schedules = (t) => {
  const plans = [
    ["16:8", 12, 20],
    ["18:6", 13, 19],
    ["20:4", 14, 18],
    ["23:1", 18, 19],
  ];
  const point = (cx, cy, r, h) => {
    const a = ((h / 24) * 360 - 90) * (Math.PI / 180);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const pad = (h) => `${String(h).padStart(2, "0")}:00`;
  const clocks = plans
    .map(([name, from, to], i) => {
      const cx = 95 + i * 177;
      const cy = 100;
      const r = 62;
      const [x1, y1] = point(cx, cy, r, from);
      const [x2, y2] = point(cx, cy, r, to);
      const large = to - from > 12 ? 1 : 0;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-ring"/>
        <path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)}" class="f-arc"/>
        ${text(cx, cy - r - 12, "0h", "f-tiny")}${text(cx, cy + r + 20, "12h", "f-tiny")}
        ${text(cx, cy + 8, name, "f-big")}
        ${text(cx, 205, `${t.eat} ${pad(from)}–${pad(to)}`, "f-small")}`;
    })
    .join("");
  return svg(
    720,
    250,
    "Schedules",
    `${clocks}
     <rect x="230" y="226" width="16" height="10" rx="5" class="f-cool-fill"/>${text(252, 235, t.fasting, "f-small", "start")}
     <rect x="380" y="226" width="16" height="10" rx="5" class="f-warm-fill"/>${text(402, 235, t.eating, "f-small", "start")}`,
  );
};

// ─── Tuần đầu: số giờ nhịn tăng dần 12 → 16

const firstWeek = (t) => {
  const hours = [12, 12, 13, 14, 14, 15, 16];
  const bars = hours
    .map((h, i) => {
      const x = 60 + i * 92;
      const height = (h / 16) * 140;
      const y = 175 - height;
      return `<rect x="${x}" y="${y}" width="56" height="${height}" rx="10" class="${i === 6 ? "f-seg4" : "f-seg2"}"/>
        ${text(x + 28, y - 8, `${h}${t.hours}`, "f-strong")}
        ${text(x + 28, 198, `${t.day} ${i + 1}`, "f-small")}`;
    })
    .join("");
  return svg(720, 210, "First week", `<line x1="40" y1="175" x2="690" y2="175" class="f-axis"/>${bars}`);
};

// ─── Tự thực: 4 bước

const autophagy = (t) => {
  const cx = [95, 275, 455, 635];
  const arrow = (x) => `<path d="M${x - 40},95 L${x + 22},95" class="f-arrow"/><path d="M${x + 14},88 L${x + 24},95 L${x + 14},102" class="f-arrow"/>`;
  const junk = (x, y) =>
    `<path d="M${x - 14},${y - 6} l10,-8 l9,6 l-3,10 l-12,2 z" class="f-junk"/><circle cx="${x + 12}" cy="${y + 10}" r="7" class="f-junk"/><rect x="${x - 18}" y="${y + 8}" width="11" height="9" rx="2" class="f-junk"/>`;
  const blocks = [0, 1, 2, 3, 4, 5]
    .map((i) => `<rect x="${cx[3] - 30 + (i % 3) * 22}" y="${78 + Math.floor(i / 3) * 22}" width="14" height="14" rx="3" class="f-block"/>`)
    .join("");
  return svg(
    720,
    200,
    t.wrap,
    `<circle cx="${cx[0]}" cy="95" r="48" class="f-cell"/>${junk(cx[0], 92)}
     ${arrow(185)}
     <circle cx="${cx[1]}" cy="95" r="44" class="f-membrane"/><circle cx="${cx[1]}" cy="95" r="36" class="f-membrane"/>${junk(cx[1], 92)}
     ${arrow(365)}
     <circle cx="${cx[2]}" cy="95" r="46" class="f-lyso"/>${junk(cx[2] - 4, 92)}
     ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${cx[2] - 26 + i * 13}" cy="${130 - (i % 2) * 8}" r="3.5" class="f-enzyme"/>`).join("")}
     ${arrow(545)}
     ${blocks}
     ${[t.damaged, t.wrap, t.lysosome, t.recycled].map((s, i) => text(cx[i], 175, s, "f-small")).join("")}`,
  );
};

// ─── Khiên: ngày nghỉ được khiên che, hết khiên thì streak đứt

const shields = (t) => {
  // f = nhịn, s = nghỉ có khiên, x = nghỉ hết khiên
  const days = ["f", "f", "s", "f", "f", "s", "s", "f", "x"];
  let count = 3;
  const cells = days
    .map((d, i) => {
      const x = 30 + i * 74;
      const y = 50;
      let body;
      if (d === "f") {
        body = `<rect x="${x}" y="${y}" width="58" height="58" rx="14" class="f-seg4"/><path d="M${x + 18},${y + 30} l8,8 l15,-17" class="f-check"/>`;
      } else if (d === "s") {
        count -= 1;
        body = `<rect x="${x}" y="${y}" width="58" height="58" rx="14" class="f-rest"/>
          <path d="M${x + 29},${y + 16} l12,5 v9 c0,8 -6,12 -12,15 c-6,-3 -12,-7 -12,-15 v-9 z" class="f-shield"/>
          ${text(x + 29, y + 82, `${t.shields} ${count + 1}→${count}`, "f-tiny")}`;
      } else {
        body = `<rect x="${x}" y="${y}" width="58" height="58" rx="14" class="f-broken"/><path d="M${x + 19},${y + 19} l20,20 M${x + 39},${y + 19} l-20,20" class="f-cross"/>`;
      }
      return `${body}${text(x + 29, 36, `${t.day} ${i + 1}`, "f-tiny")}`;
    })
    .join("");
  const last = 30 + 8 * 74;
  return svg(
    720,
    230,
    t.shields,
    `${cells}
     <line x1="30" y1="160" x2="${last - 10}" y2="160" class="f-streak"/>
     ${text((30 + last) / 2 - 30, 182, t.streakOk, "f-strong")}
     ${text(last + 29, 182, t.streakBreak, "f-danger")}
     <rect x="70" y="204" width="14" height="14" rx="4" class="f-seg4"/>${text(90, 215, t.fast, "f-small", "start")}
     <rect x="230" y="204" width="14" height="14" rx="4" class="f-rest"/>${text(250, 215, t.rest, "f-small", "start")}
     <rect x="440" y="204" width="14" height="14" rx="4" class="f-broken"/>${text(460, 215, t.restNo, "f-small", "start")}`,
  );
};

const FIGURES = { metabolicSwitch, bodyTimeline, schedules, firstWeek, autophagy, shields };

export const renderFigure = (name, lang) => {
  const figure = FIGURES[name];
  if (!figure) throw new Error(`Không có hình: ${name}`);
  return figure(T[lang] ?? T.en);
};
