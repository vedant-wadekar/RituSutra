import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { seasons, getCurrentSeason } from "../data/seasons";
import { generateRecommendations } from "../engine/recommendationEngine";
import { getPrakritiColors, getPrakritiDescription } from "../engine/prakritiEngine";
import {
  getBrowserCoordinates,
  fetchWeatherByCoords,
  fetchWeatherByCity,
  classifyWeather,
} from "../services/weatherService";
import "./Dashboard.css";

// Greeting based on time of day
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Get first name from email
function getDisplayName(user, profile) {
  if (profile?.displayName) return profile.displayName;
  if (user?.displayName) return user.displayName.split(" ")[0];
  if (user?.email) return user.email.split("@")[0];
  return "Friend";
}

function Dashboard() {
  const { currentUser, userProfile, profileLoading } = useAuth();
  const navigate = useNavigate();

  // Weather state
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [citySearching, setCitySearching] = useState(false);

  // UI state
  const [activeMealTab, setActiveMealTab] = useState("breakfast");
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false);

  // Derived data
  const currentRutuId = getCurrentSeason();
  const currentRutu = seasons.find((s) => s.id === currentRutuId);

  const getStoredProfile = () => {
    try {
      if (currentUser?.uid) {
        const u = localStorage.getItem(`prakriti_profile_${currentUser.uid}`);
        if (u) return JSON.parse(u);
      }
      const cur = localStorage.getItem("prakriti_profile_current");
      if (cur) return JSON.parse(cur);
      const guest = localStorage.getItem("guest_prakriti_profile") || localStorage.getItem("prakriti_profile_guest_user");
      if (guest) return JSON.parse(guest);
    } catch (e) {
      console.warn("Storage profile read error:", e);
    }
    return null;
  };

  const storedProfile = getStoredProfile();
  // Ensure we prioritize having the complete assessment data
  const effectiveProfile = (userProfile && userProfile.prakriti)
    ? { ...(storedProfile || {}), ...userProfile }
    : (storedProfile || userProfile);

  const prakriti = effectiveProfile?.prakriti || null;
  const doshaScores = effectiveProfile?.doshaScores || null;
  const doshaPercentages = effectiveProfile?.doshaPercentages || null;
  const weatherClassification = weather ? classifyWeather(weather) : null;
  const recommendations = prakriti
    ? generateRecommendations(prakriti, currentRutuId, weatherClassification)
    : null;
  const prakritiColors = getPrakritiColors(prakriti);
  const name = getDisplayName(currentUser, effectiveProfile);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError("");
    try {
      const coords = await getBrowserCoordinates();
      const w = await fetchWeatherByCoords(coords.lat, coords.lon);
      setWeather(w);
      setLocationDenied(false);
    } catch (err) {
      if (err.code === 1) {
        // PERMISSION_DENIED
        setLocationDenied(true);
        setWeatherError("");
      } else {
        setWeatherError("Unable to fetch weather data. Please try again.");
      }
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setCitySearching(true);
    setWeatherError("");
    try {
      const w = await fetchWeatherByCity(cityInput.trim());
      setWeather(w);
      setLocationDenied(false);
    } catch (err) {
      setWeatherError(`Could not find weather for "${cityInput}". Try a different city name.`);
    } finally {
      setCitySearching(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const MEAL_TABS = [
    { id: "breakfast", label: "🌅 Breakfast" },
    { id: "lunch", label: "☀️ Lunch" },
    { id: "dinner", label: "🌙 Dinner" },
    { id: "snacks", label: "🍎 Snacks" },
    { id: "hydration", label: "💧 Hydration" },
  ];

  // Loading state (only show if we do not already have assessment data)
  if (profileLoading && !effectiveProfile?.prakriti) {
    return (
      <div className="db-loading-screen">
        <div className="db-spinner" />
        <p>Loading your personalized dashboard...</p>
      </div>
    );
  }

  return (
    <div className="db-page">

      {/* ── NAVBAR ── */}
      <nav className="db-navbar">
        <div className="db-nav-logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          🌿 RutuSutra
        </div>
        <div className="db-nav-links">
          <span onClick={() => navigate("/home")}>Home</span>
          <span className="active">Dashboard</span>
          <span onClick={() => navigate("/season")}>Seasons</span>
          <span onClick={() => navigate("/diet")}>Diet</span>
          <span onClick={() => navigate("/lifestyle")}>Lifestyle</span>
          <span onClick={() => navigate("/about")}>About</span>
        </div>
        <button className="db-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="db-main">

        {/* ── WELCOME HEADER ── */}
        <section className="db-welcome">
          <div className="db-welcome-text">
            <h1>{getGreeting()}, {name} 👋</h1>
            <p>Your personalized Ayurvedic wellness dashboard</p>
          </div>
          <div className="db-welcome-date">
            <span>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
            <span className="db-rutu-chip">
              {currentRutu?.emoji} {currentRutu?.name} Ritu
            </span>
          </div>
        </section>

        {/* ── TOP GRID (Prakriti + Rutu + Weather) ── */}
        <div className="db-top-grid">

          {/* PRAKRITI CARD */}
          <div className="db-card db-prakriti-card" style={{ borderTop: `4px solid ${prakritiColors.primary}` }}>
            <div className="db-card-label">YOUR PRAKRITI</div>
            {prakriti ? (
              <>
                <div className="db-prakriti-name" style={{ color: prakritiColors.primary }}>
                  {prakriti.split("-").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join("-")}
                </div>
                {doshaScores && (
                  <div className="db-dosha-bars">
                    {[
                      { key: "vata", label: "Vata", emoji: "🌬️", color: "#7b1fa2" },
                      { key: "pitta", label: "Pitta", emoji: "🔥", color: "#e65100" },
                      { key: "kapha", label: "Kapha", emoji: "🌊", color: "#1565c0" },
                    ].map((d) => {
                      const total = (doshaScores.vata || 0) + (doshaScores.pitta || 0) + (doshaScores.kapha || 0);
                      const pct = total > 0 ? Math.round(((doshaScores[d.key] || 0) / total) * 100) : 0;
                      return (
                        <div key={d.key} className="db-dosha-bar-row">
                          <span className="db-dosha-bar-label">
                            {d.emoji} {d.label}
                          </span>
                          <div className="db-dosha-bar-track">
                            <div
                              className="db-dosha-bar-fill"
                              style={{ width: `${pct}%`, background: d.color }}
                            />
                          </div>
                          <span className="db-dosha-bar-pct" style={{ color: d.color }}>
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <p className="db-prakriti-desc">{getPrakritiDescription(prakriti)}</p>
                <button
                  className="db-retake-btn"
                  onClick={() => setShowRetakeConfirm(true)}
                >
                  Retake Assessment
                </button>
              </>
            ) : (
              <div className="db-empty-prakriti">
                <span>🌿</span>
                <p>You haven't completed the Prakriti assessment yet.</p>
                <button className="db-take-assessment-btn" onClick={() => navigate("/questionnaire")}>
                  Take Assessment →
                </button>
              </div>
            )}
          </div>

          {/* RUTU CARD */}
          <div className="db-card db-rutu-card" style={{ background: currentRutu?.gradient }}>
            <div className="db-card-label" style={{ color: "rgba(255,255,255,0.8)" }}>CURRENT RUTU</div>
            <div className="db-rutu-emoji">{currentRutu?.emoji}</div>
            <h2 className="db-rutu-name">{currentRutu?.name}</h2>
            <p className="db-rutu-english">{currentRutu?.englishName} · {currentRutu?.months}</p>
            <p className="db-rutu-desc">{currentRutu?.description}</p>
            <div className="db-rutu-qualities">
              {currentRutu?.qualities.map((q) => (
                <span key={q} className="db-quality-chip">{q}</span>
              ))}
            </div>
            <button
              className="db-rutu-explore-btn"
              onClick={() => navigate("/season")}
            >
              Season Guide →
            </button>
          </div>

          {/* WEATHER CARD */}
          <div className="db-card db-weather-card">
            <div className="db-card-label">CURRENT WEATHER</div>
            {weatherLoading ? (
              <div className="db-weather-loading">
                <div className="db-spinner-sm" />
                <p>Detecting your location...</p>
              </div>
            ) : weather ? (
              <div className="db-weather-data">
                <div className="db-weather-top">
                  <div>
                    <div className="db-weather-city">📍 {weather.city}</div>
                    <div className="db-weather-temp">{weather.temperature}{weather.unit}</div>
                    <div className="db-weather-feels">Feels like {weather.feelsLike}{weather.unit}</div>
                  </div>
                  <div className="db-weather-icon">{weather.conditionIcon}</div>
                </div>
                <div className="db-weather-details">
                  <div className="db-weather-detail">
                    <span>💧</span> Humidity: <strong>{weather.humidity}%</strong>
                  </div>
                  <div className="db-weather-detail">
                    <span>💨</span> Wind: <strong>{weather.windSpeed} km/h</strong>
                  </div>
                  <div className="db-weather-detail">
                    <span>{weather.conditionIcon}</span> <strong>{weather.condition}</strong>
                  </div>
                </div>
                <p className="db-weather-updated">
                  Updated {new Date(weather.fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <button className="db-weather-refresh" onClick={requestLocation}>
                  ↻ Refresh
                </button>
              </div>
            ) : locationDenied ? (
              <div className="db-location-denied">
                <div className="db-location-icon">📍</div>
                <p>Location access was denied.</p>
                <p className="db-location-sub">Enter your city to get weather-based recommendations:</p>
                <form onSubmit={handleCitySearch} className="db-city-form">
                  <input
                    type="text"
                    placeholder="e.g. Kolhapur, Mumbai..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="db-city-input"
                  />
                  <button type="submit" disabled={citySearching} className="db-city-submit">
                    {citySearching ? "..." : "→"}
                  </button>
                </form>
                {weatherError && <p className="db-weather-err">{weatherError}</p>}
              </div>
            ) : (
              <div className="db-weather-error">
                <span>🌡️</span>
                <p>{weatherError || "Weather data unavailable."}</p>
                <button onClick={requestLocation} className="db-retry-btn">
                  Try Again
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ── PERSONALIZED DIET ── */}
        {recommendations ? (
          <section className="db-diet-section">
            <div className="db-diet-header">
              <h2>🥗 Your Personalized Diet</h2>
              <p className="db-diet-rationale">{recommendations.rationale}</p>
            </div>

            {/* Weather notes */}
            {recommendations.weatherNotes.length > 0 && (
              <div className="db-weather-notes">
                {recommendations.weatherNotes.map((note, i) => (
                  <div key={i} className="db-weather-note">🌤️ {note}</div>
                ))}
              </div>
            )}

            {/* Meal tabs */}
            <div className="db-meal-tabs">
              {MEAL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`db-meal-tab ${activeMealTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveMealTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Meal content */}
            <div className="db-meal-content">
              {(recommendations.meals[activeMealTab] || []).map((item, i) => (
                <div key={i} className="db-meal-item">
                  <span className="db-meal-bullet">🌿</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Favor / Limit */}
            <div className="db-food-grid">
              <div className="db-food-card db-food-card--favor">
                <h3>✅ Favour These Foods</h3>
                <ul>
                  {recommendations.favorFoods.slice(0, 8).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="db-food-card db-food-card--limit">
                <h3>🚫 Limit These Foods</h3>
                <ul>
                  {recommendations.limitFoods.slice(0, 8).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Seasonal tip */}
            <div className="db-seasonal-tip">
              <span>💡</span>
              <div>
                <strong>{currentRutu?.name} Tip:</strong> {recommendations.seasonalTip}
              </div>
            </div>

            {/* Weather tips */}
            {recommendations.weatherTips.length > 0 && (
              <div className="db-weather-tips">
                <h4>Today's Weather Tips</h4>
                {recommendations.weatherTips.map((tip, i) => (
                  <div key={i} className="db-weather-tip">🌤️ {tip}</div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="db-disclaimer">
              ⚠️ {recommendations.disclaimer}
            </div>
          </section>
        ) : (
          <section className="db-diet-empty">
            <div className="db-diet-empty-content">
              <span>🌿</span>
              <h3>Complete your Prakriti assessment</h3>
              <p>
                Take the Prakriti questionnaire to unlock personalized diet
                recommendations based on your unique constitution, current season,
                and local weather.
              </p>
              <button
                className="db-empty-cta"
                onClick={() => navigate("/questionnaire")}
              >
                Start Assessment →
              </button>
            </div>
          </section>
        )}

        {/* ── QUICK LINKS ── */}
        <section className="db-quick-links">
          {[
            { emoji: "🌿", title: "Season Guide", desc: "Explore all 6 Ayurvedic Ritu", path: "/season" },
            { emoji: "🥗", title: "Diet Library", desc: "Browse Ayurvedic foods", path: "/diet" },
            { emoji: "🧘", title: "Lifestyle", desc: "Daily Ayurvedic routine", path: "/lifestyle" },
            { emoji: "📖", title: "About Ayurveda", desc: "Glossary & concepts", path: "/about" },
          ].map((link) => (
            <div
              key={link.title}
              className="db-quick-link-card"
              onClick={() => navigate(link.path)}
            >
              <span>{link.emoji}</span>
              <div>
                <strong>{link.title}</strong>
                <p>{link.desc}</p>
              </div>
            </div>
          ))}
        </section>

      </main>

      {/* Retake confirm modal */}
      {showRetakeConfirm && (
        <div className="db-modal-overlay" onClick={() => setShowRetakeConfirm(false)}>
          <div className="db-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Retake Assessment?</h3>
            <p>
              You'll answer the questionnaire again and your Prakriti will be
              updated based on the new results.
            </p>
            <div className="db-modal-actions">
              <button
                className="db-modal-confirm"
                onClick={() => {
                  setShowRetakeConfirm(false);
                  navigate("/questionnaire");
                }}
              >
                Yes, Retake
              </button>
              <button
                className="db-modal-cancel"
                onClick={() => setShowRetakeConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
