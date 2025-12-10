// src/pages/BoardDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById } from "../api/boardApi";
import "../css/BoardDetail.css"; 


const BoardDetail = () => {

  // URL 에서 id 가져오기
  const { id } = useParams();          
  const navigate = useNavigate();
   
  // 상태값 관리
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 날짜 포맷 함수
  const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


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
          <span>작성일: {formatDate(post.createdAt)}</span>

          {post.updatedAt && (
            <>
              <span className="post-detail__meta-divider">·</span>
              <span>수정일: {formatDate(post.updatedAt)}</span>
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
          className="post-detail__button"
          onClick={() => navigate("/")}
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default BoardDetail;
