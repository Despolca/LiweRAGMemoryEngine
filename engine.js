// ============================================================
// Nhật ký nhân vật Plugin v2.0.0 — Engine nhật ký (Quy trình cốt lõi)
// Đường dẫn: SillyTavern/extensions/character-diary/engine.js
// ============================================================
'use strict';

/** Khóa Mutex - Ngăn chặn tạo đồng thời dẫn đến hỏng dữ liệu */
let cdBusy = false;
let cdPending = false;  // Khi đang khóa mà lại nhận được tín hiệu kích hoạt, đánh dấu "sau khi hoàn thành sẽ chạy thêm một vòng"

/**
 * Thực thi một lần tạo nhật ký + quan hệ.
 * @param {{ manual?: boolean, silent?: boolean }} opts
 *   manual: true = Người dùng kích hoạt thủ công, chạy ngay cả khi enabled=false
 *   silent: true = Không hiện thông báo toastr (Dùng cho kích hoạt tự động)
 */
async function cdRunDiary({ manual = false, silent = false, extraFloors = null } = {}) {
  if (cdBusy) {
    if (manual) { toastr.info('Đang viết, vui lòng đợi'); cdPending = true; }
    return;
  }

  const s = cdGetSettings();
  if (!s.enabled && !manual) return;

  let data = await cdGetData();
  
  // Nếu kích hoạt tự động đã truyền vào các tầng được tính toán trước, sử dụng trực tiếp
  let windowFloors;
  if (extraFloors && Array.isArray(extraFloors) && extraFloors.length) {
    windowFloors = extraFloors;
  } else {
    windowFloors = await cdGetNewFloors(data);
  }

  if (!windowFloors.length) {
    if (manual && !silent) toastr.info('Không có tầng mới nào cần viết nhật ký');
    return;
  }

  if (windowFloors.length > (s.maxWindowFloors || 40))
    windowFloors = windowFloors.slice(-(s.maxWindowFloors || 40));

  cdBusy = true;
  try {
    if (!silent) toastr.info(`Bắt đầu viết nhật ký (${windowFloors.length} tầng mới)...`);

    // Đồng thời: Nhật ký + Quan hệ + Hồ sơ cốt truyện
    const diaryMsgs    = cdBuildDiaryPrompt(windowFloors, data, s);
    const relMsgs      = cdBuildRelationPrompt(windowFloors, data, s);
    const archiveMsgs  = cdBuildArchivePrompt(windowFloors, data, s);
    const [diaryRes, relRes, archiveRes] = await Promise.allSettled([
      cdApiComplete(diaryMsgs, s),
      cdApiComplete(relMsgs, s),
      cdApiComplete(archiveMsgs, s),
    ]);

    let diaryOk   = false;
    let relOk     = false;
    let archiveOk = false;

    // Xử lý nhật ký
    if (diaryRes.status === 'fulfilled') {
      try {
        const npcs = parseDiaryJson(diaryRes.value);
        data = mergeDiaries(data, npcs, windowFloors, s);
        diaryOk = true;
      } catch (e) {
        cdWarn('Phân tích nhật ký thất bại', e);
        if (manual) toastr.error('Tạo nhật ký thất bại: ' + e.message);
      }
    } else {
      if (manual) toastr.error('Yêu cầu nhật ký thất bại: ' + (diaryRes.reason && diaryRes.reason.message));
    }

    // Xử lý quan hệ (Độc lập)
    if (relRes.status === 'fulfilled') {
      try {
        const rels = parseRelationJson(relRes.value);
        data = mergeRelations(data, rels);
        relOk = true;
      } catch (e) {
        cdWarn('Phân tích quan hệ thất bại', e);
        if (manual) toastr.warning('Cập nhật quan hệ thất bại (Nhật ký không bị ảnh hưởng)');
      }
    } else {
      if (manual) toastr.warning('Yêu cầu quan hệ thất bại (Nhật ký không bị ảnh hưởng)');
    }

    // Xử lý hồ sơ cốt truyện (Độc lập)
    if (archiveRes.status === 'fulfilled') {
      try {
        const arc = parseArchiveJson(archiveRes.value);
        if (!data.archive) data.archive = Object.assign({}, emptyData().archive);
        // Chỉ ghi đè trường tương ứng khi AI trả về nội dung không rỗng, nếu không giữ nguyên giá trị cũ
        if (arc.mainline !== undefined && arc.mainline !== '')   data.archive.mainline   = arc.mainline;
        if (arc.sideline !== undefined && arc.sideline !== '')   data.archive.sideline   = arc.sideline;
        if (arc.states !== undefined && arc.states !== '')       data.archive.states     = arc.states;
        if (arc.unresolved !== undefined && arc.unresolved !== '') data.archive.unresolved = arc.unresolved;
        archiveOk = true;
      } catch (e) {
        cdWarn('Phân tích hồ sơ cốt truyện thất bại', e);
        if (manual) toastr.warning('Cập nhật hồ sơ cốt truyện thất bại (Nhật ký không bị ảnh hưởng)');
      }
    } else {
      if (manual) toastr.warning('Yêu cầu hồ sơ cốt truyện thất bại (Nhật ký không bị ảnh hưởng)');
    }

    // Lưu
    if (diaryOk || relOk || archiveOk) {
      await cdSaveData(data);
      if (diaryOk) await cdSyncWorldbook(data);
      if (!silent) {
        const tips = [];
        if (diaryOk) tips.push('Nhật ký đã cập nhật');
        if (relOk) tips.push('Quan hệ đã cập nhật');
        if (archiveOk) tips.push('Hồ sơ cốt truyện đã cập nhật');
        toastr.success(tips.join(' · '));
      } else {
        cdLog('Nhật ký tự động hoàn tất');
      }
    }
  } catch (e) {
    cdWarn('Ngoại lệ runDiary', e);
    if (manual && !silent) toastr.error('Viết nhật ký thất bại: ' + e.message);
  } finally {
    cdBusy = false;
    // Nếu nhận được kích hoạt trong lúc đang bận, chạy lại một lần nữa
    if (cdPending) {
      cdPending = false;
      cdRunDiary({ manual: false, silent: true });
    }
  }
}

/**
 * Callback nhận tin nhắn: Dựa trên bộ đếm lastTriggerFloor để làm "mỗi N tầng kích hoạt một lần"
 * ★ Tính toán trực tiếp windowFloors truyền vào cdRunDiary, tránh kiểm tra nội bộ không nhất quán
 */
async function cdOnMessageReceived() {
  const s = cdGetSettings();
  if (!s.enabled) return;
  if (s.autoSummary === false) return;
  
  const data = await cdGetData();
  const currentMaxFloor = getLastFloorId();
  if (currentMaxFloor < 0) return;
  const lastTriggerFloor = data._lastTriggerFloor ?? -1;
  const interval = s.interval || 5;
  
  cdLog('Kiểm tra kích hoạt tự động: Tầng lớn nhất hiện tại', currentMaxFloor, 'Tầng kích hoạt lần trước', lastTriggerFloor, 'Khoảng cách', interval);
  
  const aiFloors = await cdGetAiFloors();
  const newFloors = aiFloors.filter(m => m.message_id > lastTriggerFloor);
  const newAiCount = newFloors.length;
  
  if (newAiCount >= interval) {
    cdLog('Kích hoạt tự động: Số tầng AI mới thêm', newAiCount, '>=', interval);
    
    let windowFloors = newFloors;
    if (windowFloors.length > (s.maxWindowFloors || 40))
      windowFloors = windowFloors.slice(-(s.maxWindowFloors || 40));
    
    data._lastTriggerFloor = currentMaxFloor;
    await cdSaveData(data);
    await cdRunDiary({ manual: false, silent: true, extraFloors: windowFloors });
  }
}

/**
 * Callback xóa/thu hồi tin nhắn
 */
async function cdOnMessageDeleted(floor) {
  await cdRollbackFrom(floor);
}