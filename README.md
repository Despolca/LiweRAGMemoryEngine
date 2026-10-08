# LIWE · RAG Memory Engine (Nhật ký nhân vật / Character Diary)

Một **plugin mở rộng quản lý trí nhớ cốt truyện SillyTavern (ST)** cực kỳ mạnh mẽ. Cốt lõi là hai hệ thống trí nhớ tự động: **Nhật ký nhân vật** và **Hồ sơ cốt truyện**, cộng thêm việc tiêm truy xuất vector (vector retrieval injection), giúp nhân vật AI của bạn thực sự "ghi nhớ" câu chuyện của bạn - những chuyện xảy ra hôm nay, những manh mối (foreshadowing) đã gài từ vài ngày trước, thái độ và sự gắn kết của bạn đối với mỗi nhân vật, tất cả đều sẽ không bị lãng quên. Ngoài ra còn có một bộ module lối chơi giúp nhân vật "sống động" hơn (Disk lưu game / Diễn đàn thế giới / Image-to-Image chân thực / Rạp hát nhỏ, v.v...).

> Bí danh: HCDiary · `character-diary` · LIWE · RAG Memory Engine
> Môi trường chạy: SillyTavern / Tauri Tavern (Client Android)
> Phiên bản hiện tại: v2.17.0

---

## 🧠 Cốt lõi · Hệ thống trí nhớ tự động

Sau mỗi lần AI trả lời, plugin sẽ tự động phân tích cốt truyện mới thêm vào, lắng đọng những chuyện đang xảy ra thành **trí nhớ dài hạn**, và có thể tiêm (inject) lại vào cuộc hội thoại bất cứ lúc nào khi cần, giúp AI nhớ được và trả lời đúng.

| Module | Mô tả |
|------|------|
| 📜 **Hồ sơ cốt truyện** | Tự động duy trì tuyến chính / tuyến phụ / trạng thái / vấn đề chưa giải quyết + các mục theo dõi tùy chỉnh, xâu chuỗi lại mạch của toàn bộ đoạn cốt truyện (xem chi tiết bên dưới). |
| 📖 **Nhật ký nhân vật** | Viết nhật ký riêng tư góc nhìn thứ nhất mang "cảm giác người thật" cho mỗi nhân vật có đất diễn, ghi lại tâm trạng/thái độ/tiếng lòng/sự kiện quan trọng (xem chi tiết bên dưới). |
| 🧠 **Truy xuất trí nhớ RAG** | Vector hóa nhật ký + hồ sơ, khi trúng (hit) hồi ức liên quan mới tiêm vào AI, không nhồi nhét toàn bộ context cho nó. |
| 🔗 **Mạng lưới quan hệ nhân vật** | Trích xuất quan hệ chủ quan một chiều giữa các nhân vật (Thân thiện/Bài xích/Trung lập), tự động diễn tiến theo cốt truyện. |

---

## 📜 Hồ sơ cốt truyện

Sắp xếp các tuyến cốt truyện chính rải rác trong từng câu thoại thành một **mạch cốt truyện** có thể xem lại và viết tiếp.

- **Cấu trúc nhiều cột (Multi-column)**: Tuyến chính / tuyến phụ / trạng thái quan trọng / vấn đề chưa giải quyết + các mục theo dõi do bạn tự định nghĩa (như thực lực, trang bị, manh mối nhân vật quan trọng, v.v...).
- **Bổ sung tăng dần**: Mỗi khi có cốt truyện mới sẽ **bổ sung thêm**, không bao giờ cắt xén ngữ cảnh để ghi đè lên những chuyện đã xảy ra.
- **Góc nhìn Timeline**: Tuyến chính/tuyến phụ/trạng thái được phân loại và hiển thị theo mốc [Thời gian], nhìn thoáng qua là hiểu ngay; xóa hàng loạt nhiều dòng ổn định và đáng tin cậy.
- **Tự động nén "Giảm béo không cắt chi"**: Khi cốt truyện tồn đọng quá nhiều có thể nén bằng một cú click - tất cả **những chuyện đã xảy ra dù nhỏ đến đâu cũng không bị mất**, chỉ tinh giản các mô tả dư thừa, độ dài mục tiêu bằng khoảng một nửa văn bản gốc.
- **Ghi đè thực sự cho vấn đề chưa giải quyết**: Khi AI phán đoán đã giải quyết xong thì sẽ xóa sạch, không còn tích tụ ngày càng nhiều.
- **Mục theo dõi tùy chỉnh**: Tùy ý tạo bất kỳ trường (field) nào bạn muốn theo dõi, AI sẽ liên tục ghi chép vào đó.

---

## 📖 Nhật ký nhân vật

Viết "nhật ký của con người" cho nhân vật trong mỗi cảnh diễn, chứ không phải những bản ghi chép lạnh lẽo.

- **Nhật ký riêng tư mang cảm giác người thật**: Những lời trong lòng ở góc nhìn thứ nhất, bộc bạch thẳng thắn + sự trẻ con đầy tính phản cực (hương vị người thật), giống như diễn biến nội tâm do người thật viết lúc đêm khuya, chứ không phải là báo cáo cốt truyện.
- **Lệnh cấm toàn tri**: Chỉ viết những gì nhân vật đích thân trải qua và biết ở hiện tại, tránh "góc nhìn của Chúa" spoil tương lai.
- **Phản ứng cảm xúc thực tế**: Lấy những sự kiện quan trọng đụng chạm đến nhân vật trong cốt truyện, viết ra phản ứng chân thực dựa trên tính cách của nhân vật đó - thay đổi cái nhìn, thù dai, rung động, sợ hãi sau sự việc, biết ơn, phàn nàn, tất cả đều có thể là suy nghĩ của anh ấy/cô ấy lúc này.
- **Hai mức độ Đơn giản / Phức tạp**: Phiên bản tinh giản dưới 100 chữ chỉ viết tiếng lòng + một chuyện quan trọng nhất + điểm ký ức; phiên bản phức tạp dàn trải từ 300~520 chữ. Cùng một lối viết mang hương vị con người, chỉ khác nhau về mức độ chữ.
- **Vòng lặp trí nhớ (Memory loop)**: Có thể liên kết chéo các điểm ký ức trước đó giữa các chương, giúp nhật ký có "cảm giác thời gian".

---

## 🎯 Truy xuất và Tiêm trí nhớ

- **Truy xuất vector RAG**: Vector hóa Hồ sơ cốt truyện / Nhật ký nhân vật, khi trúng hồi ức liên quan mới tiêm vào, không nhồi nhét toàn bộ context cho AI.
- **Sắp xếp lại (Rerank)**: Tương thích với endpoint `/rerank` của OpenAI để sắp xếp lại kết quả thu hồi, nếu thất bại sẽ tự động hạ cấp (không làm nghẽn luồng chính).
- **Tiêm theo nhân vật xuất hiện**: Dùng Regex nhận diện nhân vật xuất hiện trong cốt truyện, chỉ đẩy nhật ký gần đây của những nhân vật này, chuẩn xác mà không dư thừa.
- **Vị trí tiêm tùy chọn**: Đầu / Trong hội thoại / Cuối.
- **Trí nhớ có chọn lọc (Whitelist)**: Chỉ nhớ "nhân vật trọng tâm", tránh tích tụ các nhân vật phụ không liên quan.
- **API luồng đơn gộp chung + Prompt động**: Gộp Nhật ký nhân vật / Hồ sơ cốt truyện vào một lần gọi (call), prompt được ghép động theo các module bạn đã tick (tiết kiệm token, nhanh hơn); quan hệ nhân vật có thể bật/tắt độc lập.
- **Nén tóm tắt (Tiết kiệm token)**: Khi tóm tắt mặc định chỉ gửi những tầng (floor) cần tóm tắt, không mang theo nhật ký/hồ sơ/Worldbook lịch sử; nếu muốn context lịch sử có thể bật thủ công "Tiêm lịch sử khi tóm tắt" trong cài đặt.
- **Bảo vệ dữ liệu**: Phát hiện nhật ký giảm đột ngột sẽ tự động bù đắp từ bản backup local, chống mất trí nhớ.
- **Di chuyển toàn bộ (Full migration)**: Xuất/nhập lịch sử chat + hồi ức plugin chỉ với một cú click, đổi thiết bị không mất trí nhớ.

---

## 🎲 Các module lối chơi khác

Ngoài trí nhớ, plugin còn mang theo một bộ lối chơi tùy chọn giúp nhân vật "sống động" hơn, muốn dùng cái nào thì bật cái đó:

| Module | Tóm tắt một câu |
|------|--------|
| 🎮 **Disk lưu game** | Lưu game kiểu RPG: Lưu snapshot theo nhân vật, ghim dấu sao, lưu nhanh mỗi tin nhắn, xuất zip/nhập, quay lại điểm lưu (rollback) bất cứ lúc nào (v2.16+). |
| 🌐 **Diễn đàn thế giới · Cộng đồng xuyên thế giới** | Các nhân vật ở các thế giới cốt truyện khác nhau đăng bài, bình luận qua lại, ghen tuông xuyên thế giới, phong cách thần post Tieba. |
| 🎨 **Image-to-Image chân thực** | Thư viện ảnh/Album/Xem ảnh, 12 bộ phong cách vẽ, prompt có thể chỉnh sửa, giúp nhân vật "nhìn thấy được". |
| 🎭 **Rạp hát nhỏ** | Để AI dùng một đoạn biểu diễn nhập vai thể hiện lại một đoạn cốt truyện/bối cảnh nào đó, có thể sưu tầm. |
| 🔔 **Âm báo trả lời** | Tự động đổ chuông sau khi AI trả lời/tóm tắt xong, có thể tùy chỉnh âm thanh và thời điểm kích hoạt. |
| 📋 **Bảng tình báo LIWE** | Điền bảng trạng thái/lý lịch nhân vật tùy chỉnh, tự động snapshot diễn tiến. |
| 🔎 **Điều hướng chương hồi** | Tự động tạo tiêu đề chương hồi, lật xem các phiên bản lịch sử. |
| 📚 **Liên kết Worldbook** | Chuẩn hóa ký tự bí danh (alias), đánh trúng chuẩn xác mục (entry) Worldbook của nhân vật đã bind ban đầu. |

> Ngoài ra còn có một loạt các khế ước (sigil) thú vị: Xúc xắc định mệnh, Engine hảo cảm, Bullet screen (Danmaku), Manh mối (Foreshadowing), Thế giới song song, Khởi tạo Frontend, v.v..., có thể bật thủ công như một "Đài tiêm nghi thức (Ritual injection desk)" độc lập (xem chi tiết trong plugin).

---

## 📥 Phương pháp cài đặt

```bash
cd SillyTavern/extensions/
git clone https://github.com/Despolca/LiweRAGMemoryEngine.git character-diary
```

Sau khi khởi động lại SillyTavern, click vào "Nhật ký nhân vật (Character Diary)" trong menu tiện ích mở rộng (extensions) là có thể sử dụng.

---

## 🚀 Hướng dẫn sử dụng nhanh

1. Kéo thanh trượt ở góc trên bên phải để vào **Cài đặt**, cấu hình nguồn API (mặc định đi theo Tavern).
2. Trò chuyện bình thường, sau khi AI trả lời, plugin sẽ tự động viết nhật ký, cập nhật hồ sơ cốt truyện (hoặc click thủ công vào "Viết nhật ký").
3. "Duyệt" để xem nhật ký nhân vật; "Timeline" để xem diễn tiến hồ sơ cốt truyện; "Quan hệ" để xem mạng lưới quan hệ nhân vật.
4. Chơi đủ tuyến chính rồi thì vào "Lưu trữ" để lưu một bản save, vào "Diễn đàn" để các nhân vật ở các thế giới tương tác qua lại.
5. Bảng "Log" có thể kiểm tra Token và chi phí của mỗi lần call.

---

## 💾 Lưu trữ dữ liệu

- Nhật ký / Quan hệ / Hồ sơ cốt truyện được lưu trong `chatMetadata.extensions['character-diary']` của ST, tự động lưu theo cuộc chat, và có Chat Variables làm phương án dự phòng đường đôi.
- File save được lưu trong IndexedDB (`cd-save-db`), tạm biệt nút thắt dung lượng của localStorage.
- Thế giới/bài đăng/nhân vật/danh hiệu của Diễn đàn thế giới được lưu trong localStorage (`cd-forum-data`), đổi thẻ (card) không bị mất.
- Có thể dùng "Di chuyển toàn bộ" để chuyển trọn vẹn trí nhớ khi đổi thiết bị.

---

*Tiếp tục cập nhật theo các bản nâng cấp của plugin.*