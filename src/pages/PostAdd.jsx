// src/pages/PostAdd.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/boardApi";
import "../css/BoardAdd.css"; 
import client from "../api/client"; // 이미지 업로드 API

// Toast UI
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";



const PostAdd = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);


  const [form, setForm] = useState({
    title: "",
    writer: "",
  });

  // 에디터에서 업로드한 이미지 URL들
  const [imageUrls, setImageUrls] = useState([]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const editor = editorRef.current?.getInstance();
    const markdown = editor ? editor.getMarkdown() : "";
    const html = editor ? editor.getHTML() : "";

    // JSON 구조로 content 생성
    const contentJson = {
      type: "toast",
      markdown,
      html,
      images: imageUrls,
    };

    const payload = {
      title: form.title,
      writer: form.writer,
      content: JSON.stringify(contentJson), // 문자열로 보내기
    };

    try {
      await createPost(payload);
      alert("게시글이 등록되었습니다!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  const onCancel = () => {
    navigate("/");
  };

  return (
    <div className="board-page">
      <div className="board-page__inner post-add">
        {/* 상단 헤더: 제목 + 목록 버튼 */}
        <div className="post-add__header">
          <h2 className="post-add__title">새 글 작성</h2>
          <button
            type="button"
            className="board-button board-button--outline"
            onClick={onCancel}
          >
            목록으로
          </button>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={onSubmit} className="post-add__form">
          <div className="post-add__field">
            <label htmlFor="title" className="post-add__label">
              제목
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              className="post-add__input"
            />
          </div>

          <div className="post-add__field">
            <label htmlFor="writer" className="post-add__label">
              작성자
            </label>
            <input
              id="writer"
              type="text"
              name="writer"
              value={form.writer}
              onChange={onChange}
              className="post-add__input"
            />
          </div>

          <div className="post-add__field">
            <label className="post-add__label">내용</label>
            <div className="post-add__editor-wrapper">
              <Editor
                ref={editorRef}
                initialValue=""
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                hideModeSwitch={true}
                useCommandShortcut={false}
                hooks={{
                  // 이미지 업로드 훅
                  addImageBlobHook: async (blob, callback) => {
                    try {
                      const formData = new FormData();
                      formData.append("file", blob);

                      // TODO: 백엔드에 맞는 URL로 수정
                      const res = await client.post(
                        "/posts/images", // 예시 엔드포인트
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );

                      const imageUrl = res.data.url; // 백엔드 응답 형식에 맞게 수정
                      // 에디터에 이미지 삽입
                      callback(imageUrl, blob.name);

                      // 우리 state에도 저장
                      setImageUrls((prev) => [...prev, imageUrl]);
                    } catch (err) {
                      console.error(err);
                      alert("이미지 업로드 중 오류가 발생했습니다.");
                    }

                    // 기본 업로드 막기
                    return false;
                  },
                }}
              />
            </div>
          </div>

          {/* 하단 버튼: 오른쪽 정렬, 리스트랑 톤 통일 */}
          <div className="post-add__buttons">
            <button
              type="button"
              className="board-button board-button--outline"
              onClick={onCancel}
            >
              취소
            </button>
            <button
              type="submit"
              className="board-button board-button--solid"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostAdd;
