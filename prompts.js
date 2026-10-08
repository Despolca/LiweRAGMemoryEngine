// ============================================================
// Nhật ký nhân vật Plugin v2.0.0 — Prompt & Phân tích JSON
// Đường dẫn: SillyTavern/extensions/character-diary/prompts.js
// ============================================================
'use strict';

/* ============================== Prompt: Nhật ký ============================== */
function cdBuildDiaryPrompt(windowFloors, data, s) {
  const known = Object.keys(data.diaries).map(name => {
    const al = (data.aliases[name] || []);
    return al.length ? `${name}(Bí danh: ${al.join(', ')})` : name;
  });
  const memory = Object.entries(data.diaries).map(([name, list]) => {
    const last = list[list.length - 1];
    if (!last) return '';
    return `[${name}] Lần trước (${last.date || 'Tầng ' + last.turn}): ${last.entry}\n  Tâm trạng: ${last.mood} Thái độ với người dùng: ${last.attitude_to_user}`;
  }).filter(Boolean).join('\n');
  const scene = windowFloors.map(m => `[#${m.message_id} ${m.name}] ${m.message}`).join('\n\n');
  const sys = [
    'Bạn là một người ghi chép "Nhật ký nhân vật". Hãy đọc đoạn cốt truyện được cung cấp, viết một bài nhật ký dưới góc nhìn chủ quan ngôi thứ nhất cho mỗi nhân vật có tên và có đất diễn xuất hiện trong đó.',
    'Yêu cầu:',
    '- Chỉ viết cho các nhân vật có tên, có đất diễn thực tế. Bỏ qua người qua đường thuần túy, quần chúng vô danh.',
    '- Không viết nhật ký cho nhân vật của người dùng/người chơi.',
    s.mainCardIsGM ? '- Nếu một nhân vật là người dẫn truyện/hệ thống/góc nhìn thượng đế/người kể chuyện kiểu GM, không viết cho họ.' : '',
    '- Ngôi thứ nhất, mang theo cảm xúc, sự ích kỷ, hiểu biết chủ quan của nhân vật đó (có thể sai lệch so với sự thật). Cùng một sự kiện các nhân vật khác nhau có thể nhớ khác nhau.',
    '- entry là tóm tắt nhật ký, không phải kể lại cốt truyện: tập trung vào hoạt động tâm lý, cảm xúc, thay đổi quan hệ, quyết định quan trọng của nhân vật.',
    '- Khi liên quan đến các tình tiết nhạy cảm như tình dục/bạo lực, chỉ cần đề cập tóm tắt ngắn gọn (ví dụ: "đã phát sinh quan hệ với anh ấy", "bị anh ta áp chế"), nghiêm cấm miêu tả chi tiết từng chữ về hành động, cơ quan, chất dịch, v.v. Nhật ký tập trung vào việc ghi lại "điều gì đã xảy ra và cảm nhận của tôi", chứ không phải khôi phục quá trình.',
    '- Mỗi bài entry kiểm soát trong vòng 150 chữ, ngắn gọn súc tích.',
    '- Tái sử dụng tên chính trong "Danh sách nhân vật đã biết"; nếu nhận diện được bí danh/đại từ, hãy gộp vào tên chính đã có và bổ sung bí danh vào aliases.',
    '- Ngôn ngữ: Đi theo ngôn ngữ chính của đoạn cốt truyện.',
    '- Dùng is_minor để đánh dấu tầm quan trọng của nhân vật: Nhân vật chính, vai phụ quan trọng, NPC có tên có đất diễn đánh dấu false; Người qua đường thuần túy chỉ xuất hiện một hai câu, không quan trọng đánh dấu true.',
    'Nghiêm ngặt chỉ xuất ra JSON, định dạng:',
    '{"npcs":[{"name":"Tên chính","aliases":["Bí danh"],"is_minor":false,"date":"Thời gian cốt truyện hoặc Tầng N","turn":Số tầng,"entry":"Nội dung ngôi thứ nhất (dưới 150 chữ)","mood":"Tâm trạng","attitude_to_user":"Thái độ với người dùng","secret":"Tiếng lòng chưa nói ra","key_events":["Sự kiện chính"],"relationship_with_others":{"Nhân vật nào đó":"Mô tả quan hệ"}}]}',
  ].filter(Boolean).join('\n');
  const usr = [
    known.length ? `Danh sách nhân vật đã biết: ${known.join('; ')}` : 'Danh sách nhân vật đã biết: (Chưa có)',
    memory ? `Ký ức đã có của các nhân vật (Nhật ký mới nhất):\n${memory}` : 'Ký ức đã có của các nhân vật: (Chưa có)',
    `Đoạn cốt truyện lần này:\n${scene}`,
    'Vui lòng xuất ra JSON.',
  ].join('\n\n');
  return [
    { role: 'system', content: JAILBREAK + '\n\n' + sys },
    { role: 'user', content: usr },
    { role: 'assistant', content: '{"npcs":[' },
  ];
}

/* ============================== Prompt: Hồ sơ cốt truyện ============================== */
const ARCHIVE_SYSTEM = [
  'Bạn hiện là người chỉnh lý hồ sơ cốt truyện.',
  'Nhiệm vụ là chỉnh lý lịch sử trò chuyện được cung cấp thành hồ sơ cốt truyện có thể viết tiếp lâu dài, để các cuộc đối thoại sau này trích dẫn trực tiếp.',
  '',
  'Lưu ý: Đoạn trò chuyện này là [Tầng mới thêm lần này], không phải câu chuyện hoàn chỉnh. Bạn phải mở rộng theo kiểu nối thêm dựa trên "Tiến triển cốt truyện đã có", chứ không phải viết lại từ đầu.',
  '',
  'Nguyên tắc viết:',
  '1. Chỉ viết những sự thật đã xảy ra, không viết suy đoán, đánh giá, tạo không khí hay phân tích tâm lý.',
  '2. Khi trần thuật ưu tiên nêu rõ nhân vật, thời gian, địa điểm, hành động, nội dung đối thoại quan trọng, kết quả.',
  '3. Các đoạn tán gẫu và nội dung lặp lại không có tác dụng thúc đẩy cốt truyện có thể được nén lại, nhưng không được bỏ sót các giao ước, điều kiện, giao dịch, xung đột, quyết định và thay đổi trạng thái rõ ràng đã được thiết lập.',
  '4. Trong sự kiện nếu xuất hiện vật phẩm, bằng chứng, số tiền, thuốc men, hiệp ước, mật danh, thân phận, chức vụ, thương tích, thay đổi sinh lý, thay đổi quan hệ, thay đổi vị trí, phải viết rõ nội dung cụ thể, không được nói chung chung thành "vật nào đó", "tình báo nào đó", "xảy ra thay đổi".',
  '5. Khi có thể xác định rõ người có mặt, nhân chứng, người tham gia thì phải viết rõ, tránh làm hỗn loạn quan hệ nhân vật hoặc phạm vi biết chuyện sau này.',
  '6. Nếu một sự kiện liên tục kéo dài qua nhiều đoạn trò chuyện, nên gộp thành sự kiện hoàn chỉnh, không cắt vụn một cách máy móc theo số tầng.',
  '7. Nếu nguyên văn chứa bạo lực, tương tác người lớn, sỉ nhục, thương tích, máu me hoặc nội dung nhạy cảm khác, không được bỏ qua, cũng không được tô hồng, chỉ dùng từ ngữ khách quan trung lập để ghi lại.',
  '8. Đầu ra chỉ có thể là văn bản thuần túy, không thêm dấu đầu dòng, không đánh số, không giải thích cách làm của bạn.',
  '',
  'Các điều cấm:',
  '1. Không sử dụng các nhãn dán trừu tượng như "bầu không khí mờ ám", "đấu trí tâm lý", "tuyên bố chủ quyền", "tính chiếm hữu", "khiêu khích bằng lời nói", "tiến hành an ủi".',
  '2. Không dùng những câu sáo rỗng như "có người đe dọa đối phương", "hai bên đạt được điều kiện" để thay thế nội dung cụ thể; nếu có thể viết rõ nội dung cốt lõi thì phải viết rõ.',
  '3. Không tự ý bổ sung ngày tháng, thời gian, động cơ, lập trường hoặc nhân quả. Nguyên văn không có thì giữ nguyên là không có.',
  '',
  'Mục tiêu và định dạng đầu ra:',
  'Vui lòng xuất văn bản thuần túy nghiêm ngặt theo bốn trường dưới đây, mỗi trường một đoạn văn, không đánh số không tạo danh sách:',
  '',
  'Tuyến chính:',
  '(Tiến triển cốt truyện mới thêm lần này, có thể kết nối với tiến triển đã có)',
  '',
  'Tuyến phụ:',
  '(Tiến triển tuyến phụ lần này)',
  '',
  'Thay đổi trạng thái quan trọng:',
  '(Chỉ liệt kê các trạng thái mới thêm/thay đổi lần này - thay đổi vị trí, thay đổi danh tính, thương tích, thay đổi quan hệ, thông tin nhận được, v.v.)',
  '',
  'Các vấn đề chưa giải quyết:',
  '(Xóa những việc đã hoàn thành trong các vấn đề chưa giải quyết đã có, thêm vào những việc mới phát sinh lần này)',
].join('\n');

function cdBuildArchivePrompt(windowFloors, data, _s) {
  const existing = data.archive || emptyData().archive;
  const scene = windowFloors.map(m => `[#${m.message_id} ${m.name}] ${m.message}`).join('\n\n');
  const sys = [
    ARCHIVE_SYSTEM,
    '',
    '**Tiến triển cốt truyện đã có (Vui lòng mở rộng kiểu nối thêm, không lặp lại)**:',
    existing.mainline ? `Tuyến chính đã biết: ${existing.mainline}` : 'Tuyến chính đã biết: (Chưa có, đây là lần đầu)',
    existing.sideline ? `Tuyến phụ đã biết: ${existing.sideline}` : '',
    existing.states ? `Thay đổi trạng thái quan trọng đã biết: ${existing.states}` : '',
    existing.unresolved ? `Các vấn đề chưa giải quyết đã biết: ${existing.unresolved}` : '',
  ].filter(Boolean).join('\n');
  const usr = [
    `Tầng mới thêm lần này:\n${scene}`,
    '',
    'Vui lòng xuất ra: Tuyến chính, Tuyến phụ, Thay đổi trạng thái quan trọng, Các vấn đề chưa giải quyết',
  ].join('\n');
  return [
    { role: 'system', content: sys },
    { role: 'user', content: usr },
    { role: 'assistant', content: 'Tuyến chính:' },
  ];
}

/** Phân tích bốn trường của hồ sơ cốt truyện */
function parseArchiveJson(text) {
  const raw = String(text || '').trim();
  // Cắt theo bốn nhãn dán
  const re = /(?:^|\n)(Tuyến chính|Tuyến phụ|Thay đổi trạng thái quan trọng|Các vấn đề chưa giải quyết)[：:]([\s\S]*?)(?=(?:\nTuyến chính|\nTuyến phụ|\nThay đổi trạng thái quan trọng|\nCác vấn đề chưa giải quyết)[：:]|$)/g;
  let mainline = '', sideline = '', states = '', unresolved = '';
  let match;
  while ((match = re.exec(raw)) !== null) {
    const label = match[1].trim();
    const body  = match[2].trim();
    switch (label) {
      case 'Tuyến chính': mainline = body; break;
      case 'Tuyến phụ': sideline = body; break;
      case 'Thay đổi trạng thái quan trọng': states = body; break;
      case 'Các vấn đề chưa giải quyết': unresolved = body; break;
    }
  }
  return { mainline, sideline, states, unresolved };
}
function cdBuildRelationPrompt(windowFloors, data, _s) {
  const known = Object.keys(data.diaries);
  const scene = windowFloors.map(m => `[#${m.message_id} ${m.name}] ${m.message}`).join('\n\n');
  const sys = [
    'Bạn là một nhà phân tích quan hệ nhân vật. Đọc đoạn cốt truyện được cung cấp, trích xuất "quan hệ chủ quan đơn hướng" giữa các nhân vật.',
    'Yêu cầu:',
    '- Chủ quan đơn hướng: quan hệ từ from nhìn to (from nhìn nhận to như thế nào). A nhìn B và B nhìn A có thể khác nhau, vui lòng ghi riêng từng cái.',
    '- Chỉ phân tích quan hệ giữa các nhân vật có tên và có đất diễn, bỏ qua người qua đường thuần túy.',
    '- Không bao gồm nhân vật của người dùng/người chơi.',
    '- type: Dùng từ ngắn gọn khái quát tính chất quan hệ (như "bạn thân", "yêu thầm", "thù địch", "chủ tớ", "cảnh giác", "dựa dẫm").',
    '- attitude: Khuynh hướng tình cảm, chỉ có thể là một trong "positive" (thân thiện/gần gũi), "negative" (thù địch/bài xích), "neutral" (trung lập).',
    '- note: Giải thích bằng một câu (dưới 20 chữ).',
    known.length ? `Nhân vật đã biết: ${known.join(', ')}` : '',
    'Nghiêm ngặt chỉ xuất ra JSON, định dạng:',
    '{"relations":[{"from":"A","to":"B","type":"Tính chất quan hệ","attitude":"positive","note":"Mô tả ngắn gọn"}]}',
  ].filter(Boolean).join('\n');
  const usr = `Đoạn cốt truyện lần này:\n${scene}\n\nVui lòng xuất ra JSON quan hệ.`;
  return [
    { role: 'system', content: JAILBREAK + '\n\n' + sys },
    { role: 'user', content: usr },
    { role: 'assistant', content: '{"relations":[' },
  ];
}

/* ============================== Phân tích JSON mạnh mẽ ============================== */

/** Escape các ký tự không hợp lệ như ngắt dòng/tab bên trong chuỗi JSON */
function sanitizeJsonString(s) {
  let out = '';
  let inStr3 = false;
  let escaped3 = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr3) {
      if (escaped3) { out += ch; escaped3 = false; continue; }
      if (ch === '\\') { out += ch; escaped3 = true; continue; }
      if (ch === '"') { out += ch; inStr3 = false; continue; }
      if (ch === '\n') { out += '\\n'; continue; }
      if (ch === '\r') { out += '\\r'; continue; }
      if (ch === '\t') { out += '\\t'; continue; }
      out += ch;
    } else {
      if (ch === '"') { inStr3 = true; out += ch; continue; }
      out += ch;
    }
  }
  return out;
}

/** Quét từ startIdx để trích xuất tất cả các đối tượng cấp cao nhất hoàn chỉnh { ... } */
function scanObjects(t, startIdx) {
  const results = [];
  let depth = 0;
  let objStart = -1;
  let inStr2 = false;
  let escaped2 = false;
  for (let i = startIdx; i < t.length; i++) {
    const ch = t[i];
    if (inStr2) {
      if (escaped2) { escaped2 = false; continue; }
      if (ch === '\\') { escaped2 = true; continue; }
      if (ch === '"') { inStr2 = false; }
      continue;
    }
    if (ch === '"') { inStr2 = true; continue; }
    if (ch === '{') {
      if (depth === 0) objStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && objStart >= 0) {
        try { results.push(JSON.parse(t.slice(objStart, i + 1))); } catch (e) { /* skip bad */ }
        objStart = -1;
      }
    }
  }
  return results;
}

function parseDiaryJson(text) {
  let t = String(text || '').trim();
  t = t.replace(/```json/gi, '').replace(/```/g, '');
  if (!t.includes('"npcs"')) t = '{"npcs":[' + t;
  t = sanitizeJsonString(t);
  try { const obj = JSON.parse(t); if (Array.isArray(obj.npcs) && obj.npcs.length) return obj.npcs; } catch (_) {}
  const key = t.indexOf('"npcs"');
  const arrIdx = t.indexOf('[', key >= 0 ? key : 0);
  const npcs = scanObjects(t, arrIdx >= 0 ? arrIdx + 1 : 0).filter(o => o && o.name);
  if (npcs.length) return npcs;
  throw new Error('Phân tích JSON nhật ký thất bại, nguyên văn: ' + String(text).slice(0, 150));
}

function parseRelationJson(text) {
  let t = String(text || '').trim();
  t = t.replace(/```json/gi, '').replace(/```/g, '');
  if (!t.includes('"relations"')) t = '{"relations":[' + t;
  t = sanitizeJsonString(t);
  try { const obj = JSON.parse(t); if (Array.isArray(obj.relations)) return obj.relations; } catch (_) {}
  const key = t.indexOf('"relations"');
  const arrIdx = t.indexOf('[', key >= 0 ? key : 0);
  const rels = scanObjects(t, arrIdx >= 0 ? arrIdx + 1 : 0).filter(o => o && o.from && o.to);
  if (rels.length) return rels;
  throw new Error('Phân tích JSON quan hệ thất bại, nguyên văn: ' + String(text).slice(0, 150));
}