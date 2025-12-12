// src/utils/dateFormat.js
// 날짜 포맷 유틸
export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";

  return new Date(dateTime).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
