// src/api/boardApi.js
import client from "./client";

// GET /api/posts 게시글 조회
// options: { page, size, keyword }
export const fetchPosts = async ({
  page = 0,
  size = 10,
  keyword = "",
} = {}) => {
  const hasKeyword = keyword && keyword.trim() !== "";

  const url = hasKeyword ? "/posts/search" : "/posts";

  const res = await client.get(url, {
    params: hasKeyword
      ? { keyword, page, size }
      : { page, size },
  });

  // backend에서 PostPageResponse 형태
  // { content, page, size, totalElements, totalPages ... }
  return res.data;
};

// POST /api/posts 게시글 등록
export const createPost = async (postData) => {
  const res = await client.post("/posts", postData);
  return res.data;
};

// GET /posts/{id} 단건 조회
export const fetchPostById = async (id) => {
  const res = await client.get(`/posts/${id}`);
  return res.data;
};
