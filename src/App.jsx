import { Routes, Route, Link } from 'react-router-dom'
import Board from './pages/Board'
import PostAdd from "./pages/PostAdd"; 
import BoardDetail from "./pages/BoardDetail";


function App() {
  return <>
    <Routes>
      <Route path="/" element={<Board />} />
      <Route path="/post/add" element={<PostAdd />} /> 
      <Route path="/posts/:id" element={<BoardDetail />} />
    </Routes>
  </>
}

export default App
