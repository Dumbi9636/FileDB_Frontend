import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostById, updatePost } from "../api/boardApi";
import "../css/BoardAdd.css";
import client from "../api/client";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const BoardUpdate = () => {
  const navigate = useNavigate();
  const { id: postId } = useParams();
  const editorRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    writer: "",
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  // 기존 게시글 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await fetchPostById(postId);

        const parsedContent = safeParseJSON(post.content);

        setForm({
          title: post.title,
          writer: post.writer,
        });

        // 에디터 초기값 설정
        setTimeout(() => {
          const editor = editorRef.current?.getInstance();
          if (!editor) return;

          if (parsedContent.type === "toast" && parsedContent.html) {
            editor.setHTML(parsedContent.html);
          }
        }, 0);

        setImageUrls(parsedContent.images ?? []);
      } catch (err) {
        console.error(err);
        alert("게시글을 불러오지 못했습니다.");
        navigate("/board");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, navigate]);


  // JSON 안전 파싱 함수
  const safeParseJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      return { type: "toast", html: text, markdown: text, images: [] };
    }
  };


  // 입력 변경 핸들러
  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const editor = editorRef.current?.getInstance();
    const markdown = editor ? editor.getMarkdown() : "";
    const html = editor ? editor.getHTML() : "";

    const contentJson = {
      type: "toast",
      markdown,
      html,
      images: imageUrls,
    };

    const payload = {
      title: form.title,
      writer: form.writer,
      content: JSON.stringify(contentJson),
    };

    try {
      await updatePost(postId, payload);
      alert("게시글이 수정되었습니다.");
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error(err);
      alert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/posts/${postId}`);
  };


  // 로딩 중
  if (loading) {
    return <p style={{ padding: "20px" }}>불러오는 중...</p>;
  }

  return (
    <div className="board-page">
      <div className="board-page__inner post-add">

        {/* 상단 헤더 */}
        <div className="post-add__header">
          <h2 className="post-add__title">게시글 수정</h2>

          <button
            type="button"
            className="board-button board-button--outline"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="post-add__form">

          {/* 제목 */}
          <div className="post-add__field">
            <label className="post-add__label">제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChangeInput}
              className="post-add__input"
            />
          </div>

          {/* 작성자 */}
          <div className="post-add__field">
            <label className="post-add__label">작성자</label>
            <input
              type="text"
              name="writer"
              value={form.writer}
              onChange={handleChangeInput}
              className="post-add__input"
            />
          </div>

          {/* 에디터 */}
          <div className="post-add__field">
            <label className="post-add__label">내용</label>
            <div className="post-add__editor-wrapper">
              <Editor
                ref={editorRef}
                previewStyle="vertical"
                height="400px"
                initialEditType="wysiwyg"
                hideModeSwitch={true}
                useCommandShortcut={false}
                hooks={{
                  addImageBlobHook: async (blob, callback) => {
                    try {
                      const formData = new FormData();
                      formData.append("file", blob);

                      const res = await client.post("/posts/images", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });

                      const imageUrl = res.data.url;

                      callback(imageUrl, blob.name);

                      setImageUrls((prev) => [...prev, imageUrl]);
                    } catch (err) {
                      console.error(err);
                      alert("이미지 업로드 실패");
                    }

                    return false;
                  },
                }}
              />
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="post-add__buttons">
            <button
              type="button"
              className="board-button board-button--outline"
              onClick={handleCancel}
            >
              취소
            </button>

            <button
              type="submit"
              className="board-button board-button--solid"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardUpdate;
