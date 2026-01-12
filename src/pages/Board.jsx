import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { fetchPosts } from "../api/boardApi";
import "../css/Board.css";
import { formatDateTime } from "../utils/dateFormat";
import { Link } from 'react-router-dom'



const Board = () => {
  // 상태값
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0); //0-based (0이 1페이지)
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // 블록 페이징 메타 상태 추가
  const [startPage, setStartPage] = useState(0); // 1-based
  const [endPage, setEndPage] = useState(0);     // 1-based
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevBlock, setHasPrevBlock] = useState(false);
  const [hasNextBlock, setHasNextBlock] = useState(false);
  const [prevPage, setPrevPage] = useState(0);           // 0-based
  const [nextPage, setNextPage] = useState(0);           // 0-based
  const [prevBlockPage, setPrevBlockPage] = useState(0); // 0-based
  const [nextBlockPage, setNextBlockPage] = useState(0); // 0-based

  // navigate 함수
  const navigate = useNavigate(); 
  
  // 특정 페이지로 이동(공통)
  const movePage = (p) => {
    if (p < 0) return;
    if (totalPages > 0 && p > totalPages - 1) return;
    load({ page: p });
  };

  // 공통 로딩 함수
  const load = async ({ page: p = page, keyword: k = keyword } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchPosts({ page: p, size, keyword: k });

      setPosts(data.content || []);
      setPage(data.page ?? p);
      setTotalPages(data.totalPages ?? 0);

       // 블록 페이징 메타 세팅 (백엔드 DTO 확장값)
      setStartPage(data.startPage ?? 0);
      setEndPage(data.endPage ?? 0);
      setHasPrevPage(!!data.hasPrevPage);
      setHasNextPage(!!data.hasNextPage);
      setHasPrevBlock(!!data.hasPrevBlock);
      setHasNextBlock(!!data.hasNextBlock);
      setPrevPage(data.prevPage ?? 0);
      setNextPage(data.nextPage ?? 0);
      setPrevBlockPage(data.prevBlockPage ?? 0);
      setNextBlockPage(data.nextBlockPage ?? 0);

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

  // ◀ / ▶ 페이지 이동 
  // const goPrev = () => {
  //   if (page > 0) load({ page: page - 1 });
  // };
  // const goNext = () => {
  //   if (page < totalPages - 1) load({ page: page + 1 });
  // };

  // Board 탭 클릭 시: 검색어/페이지 초기화 + 목록 다시 로딩
  const handleClickBoardNav = () => {
    setKeyword("");
    setPage(0);
    load({ page: 0, keyword: "" });
  };

  if (loading) return <p>로딩중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
    <div className="board-page">
      <h1 className="ms-4">FileDB Board</h1>
      <hr />
      <nav style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        <Link to="/" onClick={handleClickBoardNav}>
          [Board]
        </Link>
        {/* 관리자용 메뉴 (관리자 로그인 등 구현하게되면 나중에 숨기기 / 권한 체크) */}
        <Link to="/admin/images/cleanup">[이미지 파일 정리]</Link>
      </nav>
      <br />
      
      <div className="board-page__inner">
        {/* 상단 검색 + 새 글 버튼 영역 */}
        <div className="board-page__top">
          <div className="board-search">
            <input
              className="board-search__input"
              type="text"
              placeholder="검색어를 입력하세요(제목, 내용)"
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
            + 새 글 작성
          </button>
        </div>

        {/* 테이블 영역 */}
        <div className="board-table-wrapper">
          <table className="board-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>글번호</th>
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
                    <td>{formatDateTime(post.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 영역 (<< < 1..10 > >>) */}
          <div className="board-pagination">
            <button
              className="board-button board-button--outline"
              onClick={() => movePage(prevBlockPage)}
              disabled={!hasPrevBlock}
              aria-label="이전 블록"
            >
              &laquo;
            </button>

            <button
              className="board-button board-button--outline"
              onClick={() => movePage(prevPage)}
              disabled={!hasPrevPage}
              aria-label="이전 페이지"
            >
              &lsaquo;
            </button>

            <div className="board-pagination__pages">
              {startPage > 0 &&
                Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
                  .map((displayPage) => {
                    const pageIndex = displayPage - 1;
                    const isActive = pageIndex === page;

                    return (
                      <button
                        key={displayPage}
                        className={
                          "board-pagination__page" + (isActive ? " is-active" : "")
                        }
                        onClick={() => movePage(pageIndex)}
                        disabled={isActive}
                      >
                        {displayPage}
                      </button>
                    );
                  })}
            </div>

            <button
              className="board-button board-button--outline"
              onClick={() => movePage(nextPage)}
              disabled={!hasNextPage}
              aria-label="다음 페이지"
            >
              &rsaquo;
            </button>

            <button
              className="board-button board-button--outline"
              onClick={() => movePage(nextBlockPage)}
              disabled={!hasNextBlock}
              aria-label="다음 블록"
            >
              &raquo;
            </button>

            <span className="board-pagination__info">
              {page + 1} / {totalPages} 페이지
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Board;
