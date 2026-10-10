const devices = [
  {
    id: "DEV_001",
    name: "Đèn phòng khách",
    room: "Phòng khách",
    powerWatts: 20,
    isActive: true
  },
  {
    id: "DEV_002",
    name: "Điều hòa",
    room: "Phòng ngủ",
    powerWatts: 1200,
    isActive: true
  },
  {
    id: "DEV_003",
    name: "Quạt điện",
    room: "Phòng khách",
    powerWatts: 75,
    isActive: false
  }
];

const validateDevice = (newDev) => {
  if (!newDev || typeof newDev !== "object" || Array.isArray(newDev)) {
    return false;
  }

  if (typeof newDev.name !== "string" || newDev.name.trim() === "") {
    return false;
  }

  if (typeof newDev.room !== "string" || newDev.room.trim() === "") {
    return false;
  }

  if (
    typeof newDev.powerWatts !== "number" ||
    !Number.isFinite(newDev.powerWatts) ||
    newDev.powerWatts <= 0
  ) {
    return false;
  }

  return true;
};

const createDevice = (list, newDev) => {
  if (!Array.isArray(list) || !validateDevice(newDev)) {
    return false;
  }

  const deviceNumbers = list.map((device) => {
    const match = /^DEV_(\d+)$/.exec(device.id);
    return match ? Number(match[1]) : 0;
  });

  const nextId = Math.max(0, ...deviceNumbers) + 1;
  const newDevice = {
    id: `DEV_${String(nextId).padStart(3, "0")}`,
    name: newDev.name.trim(),
    room: newDev.room.trim(),
    powerWatts: newDev.powerWatts,
    isActive: newDev.isActive ?? false
  };

  if (typeof newDevice.isActive !== "boolean") {
    return false;
  }

  list.push(newDevice);
  return newDevice;
};

const readDevicesByRoom = (list, roomName) => {
  if (!Array.isArray(list) || typeof roomName !== "string") {
    return [];
  }

  return list.filter(
    (device) => device.room.toLowerCase() === roomName.trim().toLowerCase()
  );
};

const updateDevice = (list, id, updateData) => {
  if (
    !Array.isArray(list) ||
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    return false;
  }

  const targetDevice = list.find((device) => device.id === id);

  if (!targetDevice) {
    return false;
  }

  const allowedFields = ["name", "room", "powerWatts", "isActive"];
  const updateKeys = Object.keys(updateData);

  if (
    updateKeys.length === 0 ||
    updateKeys.some((key) => !allowedFields.includes(key))
  ) {
    return false;
  }

  if (
    updateData.name !== undefined &&
    (typeof updateData.name !== "string" || updateData.name.trim() === "")
  ) {
    return false;
  }

  if (
    updateData.room !== undefined &&
    (typeof updateData.room !== "string" || updateData.room.trim() === "")
  ) {
    return false;
  }

  if (
    updateData.powerWatts !== undefined &&
    (typeof updateData.powerWatts !== "number" ||
      !Number.isFinite(updateData.powerWatts) ||
      updateData.powerWatts < 0)
  ) {
    return false;
  }

  if (
    updateData.isActive !== undefined &&
    typeof updateData.isActive !== "boolean"
  ) {
    return false;
  }

  const safeUpdateData = { ...updateData };

  if (safeUpdateData.name !== undefined) {
    safeUpdateData.name = safeUpdateData.name.trim();
  }

  if (safeUpdateData.room !== undefined) {
    safeUpdateData.room = safeUpdateData.room.trim();
  }

  Object.assign(targetDevice, safeUpdateData);
  return true;
};

const deleteDevice = (list, id) => {
  if (!Array.isArray(list)) {
    return false;
  }

  const index = list.findIndex((device) => device.id === id);

  if (index === -1) {
    return false;
  }

  list.splice(index, 1);
  return true;
};

console.log("===== 1. DANH SÁCH THIẾT BỊ BAN ĐẦU =====");
console.table(devices);

console.log("===== 2. THÊM THIẾT BỊ =====");
const newDevice = createDevice(devices, {
  name: "Đèn phòng bếp",
  room: "Phòng bếp",
  powerWatts: 15,
  isActive: true
});
console.log("Kết quả thêm:", newDevice);
console.table(devices);

console.log("===== 3. KIỂM TRA DỮ LIỆU KHÔNG HỢP LỆ =====");
console.log("Công suất bằng 0 khi thêm:", createDevice(devices, {
  name: "Đèn lỗi",
  room: "Phòng bếp",
  powerWatts: 0
}));
console.log("Thiếu tên:", createDevice(devices, {
  room: "Phòng bếp",
  powerWatts: 10
}));

console.log("===== 4. LỌC THIẾT BỊ THEO PHÒNG =====");
console.table(readDevicesByRoom(devices, "Phòng khách"));

console.log("===== 5. CẬP NHẬT THIẾT BỊ =====");
console.log("Tắt thiết bị:", updateDevice(devices, "DEV_001", {
  isActive: false
}));
console.log("Cập nhật công suất về 0:", updateDevice(devices, "DEV_003", {
  powerWatts: 0
}));
console.table(devices);

console.log("===== 6. KIỂM TRA ID KHÔNG TỒN TẠI =====");
console.log("Cập nhật DEV_999:", updateDevice(devices, "DEV_999", {
  isActive: true
}));
console.log("Xóa DEV_999:", deleteDevice(devices, "DEV_999"));

console.log("===== 7. XÓA THIẾT BỊ =====");
console.log("Xóa DEV_002:", deleteDevice(devices, "DEV_002"));
console.table(devices);