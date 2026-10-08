# 📘 Nhật ký nhân vật (HCDiary) · Tài liệu Trung tâm Phát triển

> **Tài liệu này là cổng vào duy nhất (one-stop) cho mọi hoạt động bảo trì/phát triển plugin HCDiary sau này. Khi bắt đầu một cuộc hội thoại mới để tiếp quản, hãy đọc tài liệu này trước tiên.**
> Cập nhật lần cuối: 2026-08-21
> Phiên bản hiện tại: v2.7.5 (Bao gồm bản vá lỗi "Tuyến chính/Tuyến phụ biến mất sau khi nén thủ công" lần này)

---

## 📚 Hướng dẫn tài liệu (Bắt buộc đọc khi tạo hội thoại mới)

**Tệp này là tài liệu chính duy nhất**, đã tích hợp các nội dung cốt lõi từ các file md rải rác trong khu vực công cụ cũ (hướng dẫn phát triển, liên kết Worldbook, ghi nhớ workflow, trung tâm phát triển, review đài tiêm nghi thức, kinh nghiệm về hảo cảm âm). **Khi tiếp quản một cuộc hội thoại mới, chỉ cần đọc tệp này là đủ**, không cần lật lại các file md cũ nữa. Các file md rải rác cũ được giữ lại để tham khảo lịch sử, nhưng **mọi thứ đều phải lấy tệp này làm chuẩn**; tất cả các thay đổi sau này sẽ được ghi gộp vào phần "VI. Changelog" của tài liệu này. ✨

---

## ⚠️ Vài lời nhắn gửi cho AI tiếp quản (Bắt buộc đọc trước)

**Người dùng là một "Newbie trong việc phát triển plugin"** - Mô tả của họ thường mơ hồ, dựa trên trực giác, văn phong nói, thậm chí là mâu thuẫn trước sau (ví dụ: "trước đây thì được" có thể là chỉ một phiên bản cũ từ rất lâu rồi). **Khi nhận được yêu cầu, đừng chỉ hiểu theo nghĩa đen, hãy chủ động suy luận mở rộng xem người dùng thực sự muốn gì, vấn đề thực sự nằm ở đâu**, nếu cần thiết hãy liệt kê ra để làm rõ rồi mới bắt tay vào làm. Nhưng đồng thời cũng phải **kiềm chế**: tuyệt đối không đoán mò khi chưa có bằng chứng, tuyệt đối không làm hỏng những tính năng đang hoạt động bình thường. (｀・ω・´)

---

## I. Dự án này là gì

- Tên plugin: **Nhật ký nhân vật (Character Diary)**, bí danh HCDiary / `character-diary` / LIWE·RAG Memory Engine
- Loại: **Plugin mở rộng cho SillyTavern (ST)**, chạy trên client **Tauri Tavern** (Android)
- Repository: `github.com/Despolca/LiweRAGMemoryEngine`
- Chức năng: Tự động viết nhật ký góc nhìn thứ nhất cho nhân vật trong cốt truyện, duy trì mạng lưới quan hệ nhân vật, lắng đọng hồ sơ cốt truyện, truy xuất vector + Rerank, tiêm trí nhớ, điền bảng, tiêm nghi thức, di chuyển toàn bộ.
- Kiến trúc: **Tệp đơn `index.js`** (trường `js` trong manifest.json chỉ tải tệp này); `data.js`/`engine.js`/`api.js`/`prompts.js`/`constants.js` chỉ là các lát cắt mã nguồn, **sửa chúng sẽ không có tác dụng, bắt buộc phải sửa `index.js`**.

## II. Thư mục chạy thực tế (Lưu trữ dữ liệu)

```
/storage/emulated/0/Android/data/com.tauritavern.client/data/extensions/third-party/SillyTavern-Plugin-HCDiary/
```

- Tệp `index.js` thực tế được ST tải nằm ở đây.
- **Cách truy cập**: `super_admin:shell` (Shizuku/Root) có thể đọc/ghi Android/data; `terminal`/proot **không đọc được** (Permission denied).
- **Workflow**: Sửa xong tệp → đưa vào khu vực dùng chung (ví dụ: `/sdcard/Download/`) → dùng `shell` `cp` vào thư mục thực tế → **Khởi động lại hoàn toàn Tavern** mới có tác dụng.
- Bản sao phát triển (Thư mục này): `/storage/emulated/0/Download/酒馆插件开发/角色日记/SillyTavern-Plugin-HCDiary-main/index.js`

## III. Workflow chỉnh sửa tiêu chuẩn (Phải làm theo mỗi khi sửa code) 🚨

1. **Backup trước**: Dùng `shell` trong thư mục thực tế chạy `cp index.js index.js.bak_<lý_do>_<timestamp>`.
2. **Sửa bản sao phát triển**: `Download/酒馆插件开发/角色日记/SillyTavern-Plugin-HCDiary-main/index.js` (Dùng edit_file / Python để thay thế chính xác).
3. **Xác thực cú pháp**: Trong `super_admin:terminal` chạy `node --check index.js` (Bắt buộc phải là SYNTAX_OK).
4. **Đồng bộ vào thư mục chạy**: Dùng `shell` chạy `cp <bản_sao_phát_triển> index.js` (vào thư mục thực tế).
5. **Khởi động lại Tavern**: Dùng `shell` chạy `am force-stop com.tauritavern.client && am start -n com.tauritavern.client/.MainActivity` (Bắt buộc khởi động lại hoàn toàn, không phải refresh).
6. **Sửa xong BẮT BUỘC phải thêm một dòng vào mục "Changelog" trong tài liệu này** (Xem phần VI, đây là quy định cứng!).

## IV. Phát hành lên GitHub (Quy trình tiêu chuẩn từ v2.7.5)

1. Trong terminal Ubuntu, dùng **Contents API** để cập nhật tệp (Tệp lớn thì trực tiếp base64 + PUT):
   - Trước tiên `GET contents/index.js` để lấy sha hiện tại.
   - Ở local dùng `python3` đọc tệp → base64 → cấu trúc payload `{message, content, sha}` → `PUT`.
   - Payload của tệp lớn nên ghi ra `/tmp` rồi dùng `curl -d @payload`, tránh command line quá dài.
2. **Cập nhật tag**: Di chuyển tag `v2.7.x` bằng lệnh `PATCH /git/refs/tags/v2.7.x` (`force:true`) đến commit mới, đảm bảo Release lấy được bản mới nhất.
3. **Xác thực**: Kéo về bằng `GET contents` từ GitHub, chạy `node --check` + `grep` các mốc đánh dấu quan trọng, xác nhận số byte khớp với local.
4. **Dọn dẹp**: Xóa payload tạm / tệp xác thực; nhắc nhở luân chuyển token sau khi sử dụng.

> Đồng bộ phiên bản ở 4 nơi: `PLUGIN_VERSION` + Dưới cùng UI `Plugin SillyTavern · vX.Y.Z` + `manifest.version` + Mục mới ở đầu CHANGELOG (Đừng làm hỏng dấu đóng `];`).

## V. Thu hoạch cốt lõi từ phiên làm việc này (2026-08-21, v2.7.5) 🧠

### 1. Sự thật về việc "Nén hồ sơ cốt truyện thủ công nhưng dường như không có tác dụng"
- **Hiện tượng**: Sau khi nén thủ công, log in ra "Nén và dung hợp hồ sơ cốt truyện hoàn tất", nhưng số ký tự tiêm vào không hề nhúc nhích (15550), tưởng là chưa nén.
- **Sự thật**: Chức năng nén **vốn dĩ vẫn hoạt động tốt**. Log "Nén và dung hợp hoàn tất" này được in ra từ đường dẫn thành công của callback nút bấm, **nó chỉ chứng minh hàm không ném ra exception, chứ không chứng minh nội dung thực sự đã được thay thế**. Log thực sự chứng minh "thay thế thành công" là log `Tự động nén xx: Cũ→Mới ký tự` bên trong `cdCompressArchive` - trong code cũ, **khi nén thất bại thì không in ra bất kỳ log "Tự động nén" nào, chỉ âm thầm in một câu "hoàn tất"**, tạo ra ảo giác "chức năng bị hỏng".
- **Bài học rút ra**: **Log "Hoàn tất" ≠ "Đã có tác dụng"**. Để đánh giá chức năng có thực sự hoạt động hay không, phải xem cái log chứng minh được "dữ liệu thực tế đã được ghi vào", chứ không phải câu chốt của quy trình.

### 2. Nguyên nhân gốc rễ và cách khắc phục lỗi "Không thấy Tuyến chính/Tuyến phụ trong giao diện Cốt truyện" (Phương án 3, đã phát hành)
- **Nguyên nhân gốc rễ**: Giao diện cốt truyện `cdRenderArchive` có hai luồng render:
  - Chế độ Timeline: `extractTimelineItems` **chỉ nhận các dòng sự kiện "Bắt đầu bằng chữ 【Thời gian】"** (`^【xx】nội dung`).
  - Chế độ fallback: Khi không có bất kỳ mốc đánh dấu 【Thời gian】 nào, sẽ hiển thị dưới dạng thẻ đoạn văn (paragraph card).
- **Điểm chết người**: Chỉ cần **có một trường (field) bất kỳ** (ví dụ "Chưa giải quyết") còn sót lại mốc 【Thời gian】, thì toàn bộ trang sẽ chạy theo chế độ Timeline; trong khi đó, "Tuyến chính/Tuyến phụ" sau khi nén lại là **văn bản tường thuật thuần túy, không có mốc 【Thời gian】** → Bị lệnh `if (!cat.items.length) continue;` bỏ qua toàn bộ nhóm → **Tuyến chính/Tuyến phụ biến mất**.
- **Khắc phục (Phương án 3 = Trị tận gốc + Dự phòng)**:
  - **Sửa Prompt nén**: Bắt buộc yêu cầu "[Mốc thời gian] phải được giữ nguyên vẹn, mỗi sự kiện vẫn phải bắt đầu bằng [Thời gian], mỗi sự kiện một dòng; không được xóa/sửa/gộp các mốc thời gian, không được viết lại thành đoạn tường thuật liên tục không có thời gian" → Từ nay về sau nén Tuyến chính/Tuyến phụ vẫn sẽ giữ được cấu trúc thời gian.
  - **Sửa render dự phòng**: Trong chế độ Timeline, đối với các nhóm "không có mốc thời gian nhưng có văn bản", chuyển sang hiển thị dưới dạng thẻ đoạn văn (không dùng continue để bỏ qua nữa) → Dù Tuyến chính/Tuyến phụ có format nào đi nữa thì vẫn sẽ nhìn thấy.
- **Triển khai**: GitHub main = commit `ef6a9273`, tag v2.7.5 đã được cập nhật trỏ tới commit này, index.js (656269 byte, bao gồm chẩn đoán COMPRESS-DIAG).

### 3. Đã thêm log chẩn đoán (COMPRESS-DIAG) để lấy bằng chứng
- `[COMPRESS-DIAG] LLM trả về nguyên bản`: `res.text` có không, dài bao nhiêu, 200 chữ đầu.
- `[COMPRESS-DIAG] Kết quả phân tích out`: Mỗi trường phân tích ra được bao nhiêu chữ.
- `[COMPRESS-DIAG] Ghi ngược thành công/Đã thay thế N trường`: Thực tế đã ghi vào được bao nhiêu.
- Phương án B: Khi nén thất bại sẽ `throw` báo lỗi rõ ràng (không giả vờ thành công nữa).

### 4. Lắng đọng phương pháp luận (Quan trọng nhất)
- **Tư duy mở rộng (Divergent thinking)**: Người dùng newbie mô tả mơ hồ, phải chủ động thăm dò tất cả dữ liệu hệ thống liên quan, **nghiêm cấm đoán mò khi không có bằng chứng**.
- **Không vượt quyền**: Người dùng bảo "đưa ra giải pháp" thì chỉ đưa ra giải pháp, đừng trực tiếp sửa code; người dùng bảo "thêm log chẩn đoán" thì chỉ thêm log, đừng tiện tay viết lại logic.
- **Phải hỏi kỹ câu "Trước đây thì được"**: Là "lần này không được" hay là "từ rất lâu trước đây mới được"? Đừng vì một câu "trước đây thì được" mà đi sửa một parser vốn dĩ không có vấn đề gì.
- **Lấy luồng dữ liệu để xác minh ngược**: Giao diện sai → Lưu trữ đúng → Nguồn gốc (Prompt/Tầng tạo text) là đáng ngờ nhất. Tham khảo case study "Sửa lỗi hảo cảm âm".
- **Sửa xong phải node --check + grep chuỗi quan trọng để xác nhận + cp backup + khởi động lại hoàn toàn**.

---

## VI. 📝 Changelog (Quy định cứng: Mọi thay đổi sau này BẮT BUỘC phải ghi thêm vào đây)

> **Quy tắc**: Bất kỳ ai (bao gồm cả AI ở hội thoại mới) sửa `index.js` / `style.css` / `manifest.json` hoặc phát hành phiên bản mới, **đều bắt buộc phải thêm một mục vào phần này**, theo định dạng bên dưới. Không ghi log = Thay đổi chưa hoàn thành.

### Template định dạng
```
#### YYYY-MM-DD · vX.Y.Z
- Tệp thay đổi: index.js
- Nội dung thay đổi: ...
- Nguyên nhân gốc/Động lực: ...
- Xác thực: node --check ✅ / grep chuỗi quan trọng ✅ / Bản sao chạy thực đã đồng bộ ✅ / Tavern đã khởi động lại ✅
- Thư mục chạy: /storage/emulated/0/Android/data/com.tauritavern.client/data/extensions/third-party/SillyTavern-Plugin-HCDiary/
- GitHub: commit xxx / tag vX.Y.Z đã cập nhật
- Backup: index.js.bak_xxx
```

### Lịch sử ghi chép

#### 2026-08-21 · v2.7.5 (Phiên làm việc này)
- Tệp thay đổi: index.js
- Nội dung thay đổi:
  1. Prompt nén của `cdCompressArchive` bắt buộc yêu cầu giữ nguyên cấu trúc [Mốc thời gian] (mỗi sự kiện vẫn bắt đầu bằng [Thời gian], mỗi sự kiện một dòng, không được viết lại thành đoạn tường thuật liên tục không có thời gian).
  2. Chế độ Timeline của `cdRenderArchive` thêm phương án dự phòng: các trường không có mốc [Thời gian] nhưng có văn bản (Tuyến chính/Tuyến phụ) sẽ hiển thị bằng thẻ đoạn văn, không bị bỏ qua nữa.
  3. `cdCompressArchive` thêm log chẩn đoán COMPRESS-DIAG (LLM trả về nguyên bản/kết quả phân tích/ghi ngược thành công) + throw khi thất bại (Phương án B).
- Nguyên nhân gốc/Động lực: Sau khi nén thủ công, Tuyến chính/Tuyến phụ biến mất khỏi giao diện cốt truyện (Quá trình nén đã biến cấu trúc có mốc [Thời gian] thành văn bản tường thuật thuần túy, trong khi các trường như "Chưa giải quyết" vẫn còn sót mốc thời gian khiến toàn bộ trang chạy theo chế độ Timeline, Tuyến chính/Tuyến phụ dạng tường thuật thuần túy bị lọc bỏ).
- Xác thực: node --check ✅ / grep "[Mốc thời gian] phải được giữ nguyên vẹn"=1, "dự phòng thẻ đoạn văn"=1, COMPRESS-DIAG=4 ✅ / Bản sao chạy thực đã đồng bộ ✅ / Tavern đã khởi động lại ✅
- GitHub: commit ef6a9273 / tag v2.7.5 đã cập nhật ✅
- Backup: index.js.bak_compressdiag_*

#### 2026-08-20 · v2.7.5 (Phiên làm việc trước, khóa ngay khi bắt được)
- Tệp thay đổi: index.js
- Nội dung thay đổi: Phương án A sửa tận gốc lỗi "Tóm tắt trùng lặp các tầng cũ do trigger từ nhiều entry point":
  - FIX-1 Khóa ngay khi bắt được (Ngay sau khi chọn tầng thì ghi ngay vào processedFloors).
  - FIX-3 Căn chỉnh ba con trỏ (lastFloor/_lastDiaryChatLength/_baselineChatLength).
  - FIX-2 Rollback khi thất bại + Xóa cờ khóa ở luồng thành công (window.__cdLockedBatch).
- Xác thực: node --check ✅ / Bản sao chạy thực đồng bộ ✅ / Tavern khởi động lại ✅
- GitHub: commit 3db4f51 / tag v2.7.5

---

## VII. Hồ sơ kỹ thuật cốt lõi (Mô hình dữ liệu / Cơ chế hoạt động)

### 1. Lưu trữ dữ liệu (Đối tượng `data` cốt lõi)
Tất cả được lưu trong `chatMetadata.extensions['character-diary']` của ST (PLUGIN_ID=`character-diary`). Cổng vào duy nhất: `cdGetData()` để đọc, `cdSaveData(data)` để ghi. Cấu trúc (được định nghĩa bởi `emptyData()`):
```js
{
  diaries: {},        // Nhật ký nhân vật { Tên nhân vật: [{turn,date,entry,mood,attitude_to_user,secret,key_events,relationship_with_others,message_id}] }
  aliases: {},        // Bí danh nhân vật { Tên nhân vật: [Bí danh...] }
  cameo: {},          // Số lần xuất hiện của người qua đường
  promoted: {},       // Có phải là nhân vật chính thức không
  relations: {},      // Quan hệ nhân vật { from: { to: {type,attitude,note} } }
  lastFloor: -1,      // message_id của tầng cuối cùng đã xử lý
  _baselineChatLength: -1,
  _lastDiaryChatLength: 0,
  processedFloors: [],// Các tầng đã xử lý (Cờ đánh dấu khóa ngay khi bắt được)
  archive: { mainline, sideline, states, unresolved, custom:{} },  // Hồ sơ cốt truyện (Dạng nối thêm)
  cards: [], archiveVectors: [], diaryVectors: [], liveTableData: [], liveTableSnapshots: [],
}
```
- `archive.mainline/sideline/states/unresolved` = Văn bản dạng nối thêm (nối bằng `\n\n`); `archive.custom[key]` = Mảng dạng nối thêm `[{time,desc}]`.
- `diaries[Nhân vật]` = Mảng dạng nối thêm, mỗi mục mang theo `message_id` (Dùng để khử trùng lặp/định vị).

### 2. Chuỗi lưu trữ (Quan trọng)
- **Bắt buộc** phải là `ctx.chatMetadata.extensions[PLUGIN_ID]` + gọi `saveChat` thì mới thực sự ghi xuống đĩa.
- Mức độ ưu tiên lưu trữ (Bỏ break, chạy toàn bộ): `ctx.saveChat` → `window.saveChatConditional` → `window.saveChat` → `ctx.saveMetadata` → `window.saveMetadataDebounced`.
- Dự phòng: Lộ trình kép `insertOrAssignVariables({[PLUGIN_ID]:data},{type:'chat'})`.
- Thứ tự đọc của `cdGetData`: chatMetadata.extensions → chatMetadata cấp cao nhất → Chat Variables.

### 3. Cơ chế hoạt động (Luồng xử lý quan trọng)
- **Tự động kích hoạt**: Lắng nghe `MESSAGE_RECEIVED` (Sau khi AI trả lời) → `cdOnMessageReceived` dùng `_baselineChatLength`/`data.lastFloor` để phán đoán số tầng mới thêm, đạt đến `interval` (mặc định là 5) thì kích hoạt → `cdRunDiary`.
- **Luật thép của tự động kích hoạt (Khóa ngay khi bắt được của v2.7.5)**: Sau khi chọn tầng thì lập tức ghi vào `processedFloors` và lưu lại (Không đợi AI phản hồi), chấm dứt triệt để lỗi "Sập sau khi chọn → Tái phát ở các tầng cũ"; căn chỉnh ba con trỏ (lastFloor/_lastDiaryChatLength/_baselineChatLength); rollback khi thất bại, xóa khóa khi thành công (window.__cdLockedBatch).
- **Viết nhật ký ba luồng song song**: `cdRunDiary` gọi đồng thời Nhật ký/Quan hệ/Hồ sơ, mỗi cái chạy độc lập, thất bại không ảnh hưởng lẫn nhau.
- **Tiêm (Cốt lõi)**: Lắng nghe `CHAT_COMPLETION_PROMPT_READY`, thao tác thủ công với mảng `eventData.chat` trước khi sinh text để chèn nội dung tiêm vào theo vị trí "Đầu/Trong hội thoại/Cuối" (`cdBuildDiaryInjectionText`); Số chỉ định role là 0=system/1=user/2=assistant.
- **Vector + Rerank**: `cdSearchVectors` thu hồi → `cdRerankResults` sắp xếp lại (Tương thích `/rerank` của OpenAI, hạ cấp nếu thất bại).
- **Điền bảng**: Được điều khiển bởi `liveTableEnabled/liveTableInject`.

### 4. Các mục cài đặt quan trọng (Tóm tắt DEFAULT_SETTINGS)
`enabled`(Công tắc chính, Tắt = Dừng toàn bộ) / `interval`(5) / `autoSummary` / `enableDiary|Relation|Archive` / `injectDiary|Relation|Archive` / `archiveMode`('append'|'vector') / `diaryMode` / `vectorTopK` / `vectorThreshold` / `rerankEnabled` / `rerankApi` / `customFields` / `injectPosition`('after'|'before'|'chat') / `autoCompress` / `autoCompressThreshold` / `liveTableEnabled|Inject`

## VIII. Bảng tra cứu nhanh các hàm quan trọng

| Hàm | Tác dụng |
|---|---|
| `cdGetData()` / `cdSaveData(data)` | Đọc ghi data (Cổng vào duy nhất) |
| `cdRunDiary()` | Luồng viết nhật ký chính (Ba luồng song song) |
| `cdOnMessageReceived` | Entry point kích hoạt tự động (Khóa ngay khi bắt được) |
| `cdBuildDiaryPrompt` / `cdBuildRelationPrompt` / `cdBuildArchivePrompt` | Xây dựng prompt cho ba luồng |
| `cdApiComplete(messages,s)` | Gọi LLM tập trung (Trả về `{text,elapsed,tokenUsage}`) |
| `cdParseCompressedBlocks` | Phân tích kết quả nén (Chia đoạn theo [Tiêu đề]) |
| `cdCompressArchive` | Nén và dung hợp hồ sơ cốt truyện (Thủ công/Tự động) |
| `cdRenderArchive` | Render timeline cốt truyện (Tuyến chính/Tuyến phụ/Trạng thái/Chưa giải quyết) |
| `cdBuildDiaryInjectionText` | Tạo nội dung tiêm |
| `cdOnBeforeGeneration` | Callback tiêm của CHAT_COMPLETION_PROMPT_READY |
| `cdSearchVectors` / `cdRerankResults` / `cdRerank` | Thu hồi Vector / Sắp xếp lại Rerank |
| `cdGetStCtx` / `_cdDoInit` / `cdInjectFab` | Khởi tạo / Tiêm FAB |
| `cdSaveSettings` / `cdGetSettings` | Đọc ghi cài đặt |

## IX. Danh sách hố mìn và Lệnh cấm (Những bài học xương máu) 💀

### Lưu trữ/Dữ liệu
- Bắt buộc phải `saveChat` để ghi xuống đĩa thực sự, `saveMetadata` chưa chắc đã được lưu trữ liên tục (thoát hội thoại là mất dữ liệu).
- `cdGetData`/`cdSaveData` là cổng đọc/ghi duy nhất, thêm trường mới bắt buộc phải đồng bộ ở hai nơi này.
- Dữ liệu giảm đột ngột sẽ tự động được bù đắp từ bản backup localStorage (Bảo vệ dữ liệu).

### Chỉnh sửa code
- **Tuyệt đối không dùng replace/re.sub chuỗi thuần túy để thay thế nội dung chứa `\n`**, repl luôn phải dùng hàm (`lambda m:...`), tránh việc bị escape và bung ra lần hai.
- Thay thế JSON xuyên môi trường: Tự cấu trúc literal `\n` bằng tay, đừng tin vào hành vi của json.dumps/repr trên terminal.
- Sửa xong bắt buộc phải `node --check` + `repr()` để xem số byte thực tế, đừng tin vào việc hiển thị gập dòng gây hiểu lầm trên terminal.
- Phân tích trường động (dynamic field) dùng "quét từng dòng" sẽ ổn định hơn dùng regex non-greedy.
- Trộn lẫn ngoặc kép tiếng Trung/key tiếng Trung với ngoặc kép half-width rất dễ gây lỗi cú pháp; dùng full-width/**in đậm** sẽ an toàn hơn.

### Môi trường ST
- Đa số ST API là `ctx.xxx` (saveChat/saveMetadata v.v...), gọi global trực tiếp sẽ bị ReferenceError.
- Vị trí tiêm dùng CHAT_COMPLETION_PROMPT_READY thao tác thủ công với eventData.chat là ổn định nhất, đừng phụ thuộc vào setExtensionPrompt.
- Nút bấm "không phản hồi" thường do sự kiện bị vô hiệu hóa sau khi re-render → Dùng `onclick` inline để bind hàm global, hoặc ủy quyền bằng `$('#cd-content').off('click',...).on('click',...)`.
- Tệp trên ổ đĩa của plugin sau khi sửa phải khởi động lại hoàn toàn ST (force-stop + start), chỉ refresh sẽ không có tác dụng.

### Cạm bẫy snapshot cài đặt của người dùng
- Snapshot cũ của cài đặt ST được ưu tiên hơn giá trị mặc định trong code (`Object.assign({},DEFAULT_SETTINGS,stored)`) → Khi sửa code mà không thấy tác dụng, hãy cung cấp nút "Khôi phục mặc định" để người dùng kéo dữ liệu về.

### Phát hành
- Trước khi phát hành phải xác nhận local là superset (tập cha) hoàn chỉnh của remote (so sánh danh sách hàm), chống bị lùi phiên bản do ghi đè.
- Đồng bộ phiên bản ở 4 nơi + Đóng mảng CHANGELOG.
- Mạng không ổn định, dùng GitHub API `POST /releases` (truyền tag_name+target_commitish=main) để Release là an toàn nhất.

### Phương pháp luận (Quan trọng nhất, hãy đọc đi đọc lại nhiều lần) 🧠
- 🚫 Đừng tự kiểm tra đi kiểm tra lại ở tầng phân tích/render (Comment đã ghi "Tránh bị nuốt dấu âm" nghĩa là đã được xử lý rồi).
- ✅ Giao diện sai → Lưu trữ đúng → Nguồn (Prompt/Tầng sinh text) đáng ngờ nhất, hãy dùng luồng dữ liệu để xác minh ngược.
- ⚠️ **Ví dụ trong prompt chính là quy tắc**: AI sẽ bắt chước ví dụ, ví dụ được bổ sung đầy đủ (Dấu âm/Mốc thời gian) thì AI mới output ra.
- ⚠️ Output dạng ghi đè rất dễ làm mất thông tin (Dấu âm/Mốc thời gian) → Bắt buộc phải yêu cầu giữ lại một cách rõ ràng.
- 📌 Dữ liệu lịch sử sẽ không tự động được sửa, chỉ ảnh hưởng đến lần tạo/ghi đè tiếp theo.
- 📌 Log "Hoàn tất" ≠ "Đã có tác dụng", phải xem log chứng minh được việc dữ liệu đã ghi vào.

---

## X. Tra cứu nhanh các chuyên đề chức năng

### Liên kết Worldbook (Chuẩn hóa Bí danh → Tên chính)
- Vấn đề: Tên hiển thị trong chat (Bí danh) ≠ Tên chính logic của nhân vật → Entry của Worldbook (key là tên chính) không thể hit được.
- Khắc phục: `cdSceneWorldbookRoles` dùng key của `data.diaries` + `data.aliases` (Tên chính → [Bí danh]) để tạo mapping ngược "Bí danh → Tên chính", gộp tên hiển thị trong tầng chat về lại tên chính.
- Ứng cử viên 3 dùng `async function` + `await loadWorldInfo` (ST phiên bản mới trả về Promise); đổi forEach thành vòng lặp for.
- Đường dẫn Worldbook: `data/default-user/worlds/*.json`, cấu trúc `{entries:{'0':{...}}}`.

### Lỗi hiển thị nuốt mất hảo cảm âm (v2.7.2)
- Tầng parser không có vấn đề gì, căn bệnh gốc nằm ở **Prompt trạng thái nạp cho AI** không bảo nó viết số âm, ví dụ toàn là số dương → AI lưu -90 thành 90.
- Khắc phục: Thêm vào ví dụ của prompt `Hảo cảm với nhân vật chính -90` + Yêu cầu rõ ràng "Hảo cảm âm bắt buộc phải giữ lại dấu âm".

### Đài tiêm nghi thức (v2.7.2)
- Mỗi "Khế ước (Sigil)" = Một module prompt cố định có thể bật/tắt `{id,name,icon,enabled,desc,variant,position,texts}`.
- Trích xuất hằng số cho văn bản gốc siêu dài (Ở đầu tệp), settings tham chiếu tới.
- Tiêm tái sử dụng CHAT_COMPLETION_PROMPT_READY, phân nhóm theo position before/chat/after để chèn độc lập.
- Khi trí nhớ được tiêm vào bị trống sẽ không return trực tiếp, chỉ bỏ qua trí nhớ và tiếp tục tiêm nghi thức.
- Style động `document.createElement('style')` + `#cd-content` giới hạn phạm vi tác dụng; tiền tố class name `cd-rit-*`.

### Trí nhớ có chọn lọc (Whitelist)
- Khi `selectiveMemory:true` thì chỉ ghi nhớ focusRoles (Nhân vật trọng tâm), các nhân vật còn lại sẽ bị bỏ qua.
- Không mang tính phá hủy: Chỉ chặn việc ghi nhớ nhân vật mới, không xóa trí nhớ cũ.

### Lọc trùng lặp AI (Deduplication)
- Phát hiện các mục trùng lặp gần giống nhau ở cấp độ ngữ nghĩa, hiển thị popup preview rồi mới dọn dẹp, có thể khôi phục lại.

---

*(Tài liệu này sẽ liên tục được cập nhật theo quá trình bảo trì plugin. Bất kỳ tính năng mới/sửa lỗi/hố mìn nào cũng bắt buộc phải được đồng bộ vào chương tương ứng của tài liệu này + Changelog.)*