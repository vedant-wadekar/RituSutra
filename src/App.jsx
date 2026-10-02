import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/Home";
import Season from "./pages/Season";
import Diet from "./pages/Diet";
import Lifestyle from "./pages/Lifestyle";
import About from "./pages/About";
import Questionnaire from "./pages/Questionnaire";
import Dashboard from "./pages/Dashboard";

// Smart root redirect based on auth & assessment status
function RootRedirect() {
  const { currentUser, userProfile, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f7faf3",
        color: "#2d5a27",
        fontFamily: "Inter, sans-serif"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(45, 90, 39, 0.2)",
          borderTopColor: "#2d5a27",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "16px"
        }} />
        <p style={{ fontWeight: 600 }}>Loading RutuSutra...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has completed assessment via profile or storage
  const hasAssessment =
    userProfile?.hasCompletedAssessment === true ||
    !!userProfile?.prakriti ||
    !!localStorage.getItem("prakriti_profile_current") ||
    !!(currentUser && localStorage.getItem(`prakriti_profile_${currentUser.uid}`));

  if (hasAssessment) {
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in but hasn't completed questionnaire
  return <Navigate to="/questionnaire" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Smart Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Questionnaire (Assess Prakriti) */}
          <Route path="/questionnaire" element={<Questionnaire />} />

          {/* Personalized User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Main Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/season" element={<Season />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/about" element={<About />} />

          {/* Catch-all → Root redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;