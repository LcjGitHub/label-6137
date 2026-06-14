import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ScoreListPage from '@/pages/ScoreListPage';
import PracticePage from '@/pages/PracticePage';

/** 应用路由 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScoreListPage />} />
        <Route path="/practice/:id" element={<PracticePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
