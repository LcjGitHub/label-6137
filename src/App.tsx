import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ScoreListPage from '@/pages/ScoreListPage';
import ScoreDetailPage from '@/pages/ScoreDetailPage';
import PracticePage from '@/pages/PracticePage';
import HistoryPage from '@/pages/HistoryPage';
import RandomPracticePage from '@/pages/RandomPracticePage';
import StatisticsPage from '@/pages/StatisticsPage';

/** 应用路由配置 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScoreListPage />} />
        <Route path="/random" element={<RandomPracticePage />} />
        <Route path="/score/:id" element={<ScoreDetailPage />} />
        <Route path="/practice/:id" element={<PracticePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
