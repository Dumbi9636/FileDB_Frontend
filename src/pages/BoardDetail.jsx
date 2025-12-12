// src/pages/BoardDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../api/boardApi";
import { formatDateTime } from "../utils/dateFormat";
import "../css/BoardDetail.css"; 


const BoardDetail = () => {

  // URL 에서 id 가져오기
  const { id } = useParams();          
  const navigate = useNavigate();
   
  // 상태값 관리
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 

  // 렌더링 시점에 가져올 데이터
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPostById(id);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;
  if (!post)   return null;

  // JSON 파싱 + HTML 출력용 함수
  const renderContent = (rawContent) => {
    if (!rawContent) return null;
    try {
      const parsed = JSON.parse(rawContent);
      // Json 파싱 처리
      if (parsed.type === "toast" && parsed.html) {
        return (
          <div
            className="post-detail__content"
            dangerouslySetInnerHTML={{ __html: parsed.html }}
          />
        );
      }
      // 구조가 다르다면 그냥 텍스트 출력
      return <p className="post-detail__content">{rawContent}</p>;
    } catch {
      // JSON.parse 실패 → 텍스트로 출력
      return <p className="post-detail__content">{rawContent}</p>;
    }
  };

  // 게시글 수정
  const handleClickEdit = () => {
    // 나중에 /post/edit/:id 페이지 만들 때 연결
    navigate(`/post/edit/${post.id}`);
  };
  const handleClickDelete = async () => {
    const isConfirmed = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
    if (!isConfirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await deletePost(post.id);
      alert("게시글이 삭제되었습니다.");
      navigate("/"); // 삭제 후 게시판 목록으로 이동  
    } catch (err) {
      console.error(err);
      alert("게시글 삭제에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsDeleting(false);
    }
  };




  return (
    <div className="post-detail">

      {/* 제목 */}
      <header className="post-detail__header">
        <h1 className="post-detail__title">{post.title}</h1>
      </header>

      {/* 전체 회색 박스 */}
      <div className="post-detail__body-wrapper">

        {/* 메타 정보 */}
        <div className="post-detail__meta">
          <span>
            작성자: <strong>{post.writer}</strong>
          </span>

          <span className="post-detail__meta-divider">·</span>
          <span>작성일: {formatDateTime(post.createdAt)}</span>

          {post.updatedAt && (
            <>
              <span className="post-detail__meta-divider">·</span>
              <span>수정일: {formatDateTime(post.updatedAt)}</span>
            </>
          )}
        </div>

        {/* 본문: JSON → HTML 변환 후 출력 */}
        <section className="post-detail__content-box">
          {renderContent(post.content)}
        </section>
      </div>

      {/* 버튼 */}
      <div className="post-detail__footer">
        <button
          type="button"
          className="post-detail__button post-detail__button--secondary"
          onClick={handleClickEdit}
          disabled={isDeleting}
        >
          수정
        </button>

        <button
          type="button"
          className="post-detail__button post-detail__button--danger"
          onClick={handleClickDelete}
          disabled={isDeleting}
        >
          삭제
        </button>

        <button
          type="button"
          className="post-detail__button"
          onClick={() => navigate("/")}
          disabled={isDeleting}
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default BoardDetail;
