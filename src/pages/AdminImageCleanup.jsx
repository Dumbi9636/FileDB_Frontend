// src/pages/AdminImageCleanup.jsx
import { useState } from "react";
import {  useNavigate } from "react-router-dom"; 
import { cleanupOrphanImages } from "../api/adminApi";
import "../css/Board.css"; // 기존 레이아웃 재사용

const AdminImageCleanup = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClickCleanup = async () => {
    const confirmed = window.confirm(
      "고아 이미지를 정리합니다.\n(게시글에서 사용 중인 이미지는 삭제되지 않습니다.)\n정말 실행하시겠습니까?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await cleanupOrphanImages();
      setResult(data);
      alert("이미지 정리가 완료되었습니다.");
    } catch (err) {
      console.error(err);
      setError("이미지 정리 중 오류가 발생했습니다. 콘솔 로그를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const returnHome = () =>{
    navigate("/");
  }

  return (
    <div className="board-page">
      <div className="board-page__inner">
        

        {/* 상단 타이틀 영역 */}
        <div className="post-add__header">
          <h2 className="post-add__title">이미지 가비지 컬렉션 (관리자용)</h2>
        </div>


        {/* 설명+ 버튼 영역 */}
        {!result && (
        <>
            <p className="ms-1" style={{ marginBottom: "16px" }}>
            삭제된 게시글에서 더 이상 사용되지 않는 editor 폴더 내의 이미지를 정리합니다.
            <br />
            <br />
            ※ 게시글에서 참조 중인 이미지는 삭제되지 않습니다.
            </p>

            {/* 실행 버튼 */}
            <div style={{ marginBottom: "24px" }}>
            <button
                type="button"
                className="board-button board-button--solid"
                onClick={handleClickCleanup}
                disabled={loading}
            >
                {loading ? "정리 중..." : "이미지 정리 실행"}
            </button>
            <button
                type="button"
                className="board-button board-button--solid"
                onClick={returnHome}
                disabled={loading}
            >
                취소
            </button>
            </div>
        </>
        )}


        {/* 에러 메시지 */}
        {error && (
          <p style={{ color: "red", marginBottom: "16px" }}>
            {error}
          </p>
        )}


        {/* 결과 영역 */}
        {result && (
          <div className="board-table-wrapper">
            <table className="board-table">
              <tbody>
                <tr>
                  <th style={{ width: "220px" }}>총 이미지 파일 수</th>
                  <td>{result.totalImageFileCount}</td>
                </tr>
                <tr>
                  <th>게시글에서 참조 중인 이미지 수</th>
                  <td>{result.referencedImageCount}</td>
                </tr>
                <tr>
                  <th>고아 이미지 수</th>
                  <td>{result.orphanImageCount}</td>
                </tr>
                <tr>
                  <th>삭제된 파일 목록</th>
                  <td>
                    {result.deletedFileNames.length === 0 ? (
                      <span>삭제된 파일이 없습니다.</span>
                    ) : (
                      <ul style={{ paddingLeft: "20px", marginBottom: 0 }}>
                        {result.deletedFileNames.map((name) => (
                          <li key={name}>{name}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <br />
                <button
                    type="button"
                    className="board-button board-button--solid"
                    onClick={returnHome}
                    disabled={loading}
                    >
                    {loading ? "정리 중..." : "돌아가기"}
                   </button>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImageCleanup;
