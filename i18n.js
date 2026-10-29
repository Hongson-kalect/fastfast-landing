// Dịch đơn giản phía client: text mặc định trong HTML là tiếng Anh; `data-i18n` thay text,
// `data-i18n-html` thay HTML; `data-lang` ẩn/hiện khối theo ngôn ngữ (trang privacy).
// Thêm ngôn ngữ: thêm object vào STRINGS và <option> trong select.lang.
var STRINGS = {
  vi: {
    "nav.features": "Tính năng",
    "nav.screens": "Hình ảnh",
    "nav.pro": "Pro",
    "nav.contact": "Liên hệ",
    "hero.eyebrow": "Ứng dụng nhịn ăn gián đoạn",
    "hero.title": "Nhịn ăn thông minh.<br><span>Đều đặn mỗi ngày.</span>",
    "hero.lead": "FastFast giúp việc nhịn ăn thật đơn giản: bấm bắt đầu, chọn mục tiêu từ 16 đến 72 giờ, và nhìn chuỗi ngày cùng cả năm của bạn lớn dần. Mọi dữ liệu nằm trên điện thoại của bạn.",
    "hero.playSmall": "TẢI VỀ TRÊN",
    "hero.more": "Xem tính năng",
    "hero.soon": "Sắp có trên Google Play · iOS ra mắt sau",
    "hero.p1": "Không quảng cáo",
    "hero.p2": "Dùng offline",
    "hero.p3": "Không cần tài khoản",
    "hero.p4": "10 ngôn ngữ",
    "mock.fasting": "Đang nhịn · Đốt mỡ",
    "mock.goal": "Mục tiêu 18h · 72%",
    "mock.streak": "ngày liên tiếp",
    "feat.eyebrow": "Tính năng",
    "feat.title": "Đủ những gì bạn cần, không thừa",
    "feat.sub": "Dành cho người muốn một đồng hồ rõ ràng, động lực nhẹ nhàng và số liệu trung thực.",
    "feat.timer.t": "Đồng hồ nhịn ăn",
    "feat.timer.d": "Một chạm để bắt đầu. Thấy ngay tiến độ, giai đoạn cơ thể và thời gian còn lại.",
    "feat.goals.t": "Mục tiêu 16h đến 72h",
    "feat.goals.d": "Gián đoạn, Đốt mỡ, Chiến binh, OMAD, Tu sĩ… kèm lời khuyên cho từng cấp độ.",
    "feat.streak.t": "Thói quen & chuỗi ngày",
    "feat.streak.d": "Xây thói quen hằng ngày, theo dõi cột mốc và dùng khiên để bảo vệ chuỗi vào những ngày khó.",
    "feat.ach.t": "Thành tựu",
    "feat.ach.d": "Mở khoá huy hiệu mỗi khi bạn đạt kỷ lục mới.",
    "feat.journey.t": "Journey – cả năm trong từng ô màu",
    "feat.journey.d": "Lịch năm tô màu theo tâm trạng hoặc số giờ nhịn. Xuất thành ảnh để chia sẻ.",
    "feat.notes.t": "Ghi chú, tâm trạng & cân nặng",
    "feat.notes.d": "Ghi lại cảm xúc, cân nặng và một tấm ảnh cho mỗi ngày.",
    "feat.stats.t": "Thống kê",
    "feat.stats.d": "Biểu đồ theo tuần, theo tháng để thấy tiến bộ thật sự.",
    "feat.widget.t": "Widget màn hình chính",
    "feat.widget.d": "Xem và điều khiển phiên nhịn ngay trên màn hình chính Android.",
    "feat.private.t": "Riêng tư từ thiết kế",
    "feat.private.d": "Dữ liệu nằm trên máy bạn. Có thể sao lưu vào Google Drive của chính bạn.",
    "goals.eyebrow": "Mục tiêu nhịn ăn",
    "goals.title": "Bắt đầu nhẹ nhàng, đi xa hơn khi bạn sẵn sàng",
    "goals.g16": "Gián đoạn",
    "goals.g18": "Đốt mỡ",
    "goals.g20": "Chiến binh",
    "goals.g36": "Tu sĩ & hơn nữa",
    "shots.eyebrow": "Hình ảnh",
    "shots.title": "Giao diện thoáng, gọn gàng",
    "shots.sub": "Theme sáng và tối, cùng theme và hiệu ứng theo mùa.",
    "shots.c1": "Đồng hồ",
    "shots.c2": "Journey",
    "shots.c3": "Thống kê",
    "shots.c4": "Thành tựu",
    "shots.week": "Tuần này",
    "shots.badge": "Chuỗi 7 ngày",
    "pro.title": "Biến app thành của riêng bạn",
    "pro.lead": "Mọi tính năng theo dõi cốt lõi đều miễn phí. Pro dành cho việc tuỳ biến – và ủng hộ một app độc lập, không quảng cáo.",
    "pro.note": "Mở khoá trong app, thanh toán qua Google Play.",
    "pro.l1": "Theme màu cao cấp",
    "pro.l2": "Hiệu ứng trang trí",
    "pro.l3": "Bộ icon tâm trạng & mục tiêu",
    "pro.l4": "Chế độ heatmap cho Journey",
    "pro.l5": "Thêm kiểu widget",
    "pro.xmas": "<b>Theme Giáng sinh miễn phí</b> từ 01/12 đến 31/12 – kèm hiệu ứng và bộ icon lễ hội.",
    "contact.title": "Có câu hỏi hoặc góp ý?",
    "contact.sub": "Mọi tin nhắn đều được đọc. Báo lỗi và ý tưởng luôn được chào đón.",
    "foot.privacy": "Chính sách quyền riêng tư",
    "privacy.back": "← Về trang chủ"
  }
};

(function () {
  var supported = ["en", "vi"];
  var KEY = "fastfast-lang";

  function pick() {
    var q = new URLSearchParams(location.search).get("lang");
    if (supported.indexOf(q) >= 0) return q;
    try {
      var saved = localStorage.getItem(KEY);
      if (supported.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return supported.indexOf(nav) >= 0 ? nav : "en";
  }

  // Lưu text tiếng Anh gốc để chuyển ngược lại không cần reload
  var original = new Map();

  function apply(lang) {
    var dict = STRINGS[lang] || {};
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n],[data-i18n-html]").forEach(function (el) {
      var html = el.hasAttribute("data-i18n-html");
      var key = el.getAttribute(html ? "data-i18n-html" : "data-i18n");
      if (!original.has(el)) original.set(el, html ? el.innerHTML : el.textContent);
      var val = dict[key] != null ? dict[key] : original.get(el);
      if (html) el.innerHTML = val; else el.textContent = val;
    });
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang") !== lang;
    });
    document.querySelectorAll("select.lang").forEach(function (s) { s.value = lang; });
  }

  var lang = pick();
  apply(lang);
  document.querySelectorAll("select.lang").forEach(function (s) {
    s.addEventListener("change", function () {
      try { localStorage.setItem(KEY, s.value); } catch (e) {}
      apply(s.value);
    });
  });
})();
