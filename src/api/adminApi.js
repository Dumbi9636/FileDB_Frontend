// src/api/adminApi.js
import client from "./client";

/**
 * 고아 이미지(어떤 게시글에서도 참조되지 않는 파일)를 정리하는 API 호출.
 * DELETE /admin/images/cleanup
 */
export const cleanupOrphanImages = async () => {
  const res = await client.delete("/admin/images/cleanup");
  return res.data; // ImageGcResult
};
