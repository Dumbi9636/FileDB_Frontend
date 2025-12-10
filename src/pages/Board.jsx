import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { fetchPosts } from "../api/boardApi";
import "../css/Board.css";


const Board = () => {
  // 상태값
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // navigate 함수
  const navigate = useNavigate(); 

  // 공통 로딩 함수
  const load = async ({ page: p = page, keyword: k = keyword } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosts({ page: p, size, keyword: k });

      setPosts(data.content || []);      // 중요
      setPage(data.page ?? p);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error(err);
      setError("게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ page: 0, keyword: "" });
  }, []);

  // 검색 버튼 클릭
  const handleSearch = () => {
    load({ page: 0, keyword });
  };

  // ◀ / ▶ 페이지 이동 (원하면)
  const goPrev = () => {
    if (page > 0) load({ page: page - 1 });
  };
  const goNext = () => {
    if (page < totalPages - 1) load({ page: page + 1 });
  };


  if (loading) return <p>로딩중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return <>
    
    <div className="board-page">
      <h1 className="ms-4">FileDB Board</h1>
      <hr />
      <br />
      <div className="board-page__inner">
        {/* 상단 검색 + 새 글 버튼 영역 */}
        <div className="board-page__top">
          <div className="board-search">
            <input
              className="board-search__input"
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              className="board-button board-button--outline"
              onClick={handleSearch}
            >
              검색
            </button>
          </div>

          <button
            className="board-button board-button--solid"
            onClick={() => navigate("/post/add")}
          >
            새 글 작성
          </button>
        </div>

        {/* 테이블 영역 */}
        <div className="board-table-wrapper">
          <table className="board-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>번호</th>
                <th>제목</th>
                <th style={{ width: "160px" }}>작성자</th>
                <th style={{ width: "220px" }}>등록일</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="board-table__empty">
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="board-table__row"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    <td>{post.id}</td>
                    <td className="board-table__title-cell">{post.title}</td>
                    <td>{post.writer}</td>
                    <td>{post.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* 페이지네이션 영역 */}
          <div className="board-pagination">
            <button
              className="board-button board-button--outline"
              onClick={goPrev}
              disabled={page === 0}
            >
              ◀ 이전
            </button>

            <span className="board-pagination__info">
              {page + 1} / {totalPages} 페이지
            </span>

            <button
              className="board-button board-button--outline"
              onClick={goNext}
              disabled={page >= totalPages - 1}
            >
              다음 ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
};

export default Board;
