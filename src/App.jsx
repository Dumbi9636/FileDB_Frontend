import { Routes, Route } from 'react-router-dom'
import Board from './pages/Board'
import PostAdd from "./pages/PostAdd"; 
import BoardDetail from "./pages/BoardDetail";
import BoardUpdate from "./pages/BoardUpdate";
import AdminImageCleanup from './pages/AdminImageCleanup';

function App() {
  return <>
  
    <Routes>
      <Route path="/" element={<Board />} />
      <Route path="/post/add" element={<PostAdd />} /> 
      <Route path="/posts/:id" element={<BoardDetail />} />
      <Route path="/post/edit/:id" element={<BoardUpdate />} />
      <Route path="/admin/images/cleanup" element={<AdminImageCleanup />} />
    </Routes>
  </>
}

export default App
