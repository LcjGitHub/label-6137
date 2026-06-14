import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ScoreListPage from '@/pages/ScoreListPage';
import PracticePage from '@/pages/PracticePage';
import HistoryPage from '@/pages/HistoryPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScoreListPage />} />
        <Route path="/practice/:id" element={<PracticePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
