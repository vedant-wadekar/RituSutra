import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

import { auth, googleProvider } from "../services/firebase";
import { hasCompletedAssessment } from "../services/userService";

import { useNavigate, Link } from "react-router-dom";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check if user has taken Prakriti questionnaire
      const assessed = await hasCompletedAssessment(userCredential.user.uid);
      if (assessed) {
        navigate("/dashboard");
      } else {
        navigate("/questionnaire");
      }

    } catch (error) {
      console.error(error);

      if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setLoading(true);

      const userCredential = await signInWithPopup(auth, googleProvider);

      // Check if user has taken Prakriti questionnaire
      const assessed = await hasCompletedAssessment(userCredential.user.uid);
      if (assessed) {
        navigate("/dashboard");
      } else {
        navigate("/questionnaire");
      }

    } catch (error) {
      console.error(error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Google login popup was closed. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        setError("Please allow popups for localhost.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">

        <div className="brand">
          <div className="brand-icon">🌿</div>

          <div>
            <h1>RutuSutra</h1>
            <p>Ayurveda • Seasons • Wellness</p>
          </div>
        </div>

        <div className="left-content">

          <h2>
            Live in harmony
            <br />
            with every season.
          </h2>

          <p className="description">
            Discover personalized Ayurvedic guidance for your diet,
            lifestyle and daily wellness based on your Prakriti,
            season and local weather.
          </p>

          <div className="features">

            <div className="feature">
              <span>🌿</span>
              <p>Personalized Ayurvedic Guidance</p>
            </div>

            <div className="feature">
              <span>☀️</span>
              <p>Seasonal Wellness Recommendations</p>
            </div>

            <div className="feature">
              <span>🥗</span>
              <p>Smart Diet & Lifestyle Suggestions</p>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Continue your journey towards seasonal wellness.
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <button
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <p className="signup-text">
            Don't have an account?
            {" "}
            <Link to="/signup">
              Sign Up
            </Link>
          </p>

          <p className="terms">
            By continuing, you agree to our
            Terms & Privacy Policy.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;