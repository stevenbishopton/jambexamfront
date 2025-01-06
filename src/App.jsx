import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TopicsPage from "./pages/TopicsPage";
import QuestionsPage from "./pages/QuestionsPage";
export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />


        <Route path="/subjects/:subjectId/topics" element={<TopicsPage />} />
        <Route path="/topics/:topicId/questions" element={<QuestionsPage />} />
      </Routes>
    </Router>
  )
};


