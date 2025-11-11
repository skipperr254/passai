import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import StudyPlanPage from "./features/study-plan/pages/StudyPlanPage";
import SubjectsPage from "./features/subjects/pages/SubjectsPage";
import UploadPage from "./features/upload/pages/UploadPage";
import QuizzesPage from "./features/quizzes/pages/QuizzesPage";
import SettingsPage from "./features/settings/pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="study-plan" element={<StudyPlanPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// Work from here tomorrow. You are thinking of how to improve the dashboard page by adding more interactive elements and better data visualization.
// Consider integrating chart libraries for performance tracking and adding quick action buttons for common tasks.
// Also, think about enhancing the user experience with animations and transitions.
// End of work notes
// Remember to test all new features thoroughly to ensure they work seamlessly across different devices and screen sizes.
// Prioritize accessibility to make sure the app is usable for everyone.
// Keep the codebase clean and maintainable by following best practices and documenting new components and functions.
// Stay updated with the latest trends in web development to continuously improve the app's performance and user experience.
// End of notes
// Continue working on the dashboard page tomorrow.
// Think of how you will get the AI working on the features
