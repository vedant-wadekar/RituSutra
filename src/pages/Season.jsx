import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { seasons, getCurrentSeason } from "../data/seasons";
import "./Season.css";

function Season() {
  const navigate = useNavigate();
  const currentSeasonId = getCurrentSeason();
  const [selectedId, setSelectedId] = useState(currentSeasonId);
  const [activeTab, setActiveTab] = useState("overview");

  const selected = seasons.find((s) => s.id === selectedId) || seasons[0];

  return (
    <div className="season-page">

      {/* NAVBAR */}
      <nav className="sp-navbar">
        <div
          className="sp-logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          🌿 RutuSutra
        </div>
        <div className="sp-nav-links">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span className="active">Seasons</span>
          <span onClick={() => navigate("/diet")}>Diet</span>
          <span onClick={() => navigate("/lifestyle")}>Lifestyle</span>
          <span onClick={() => navigate("/about")}>About</span>
        </div>
        <button className="sp-back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </nav>

      {/* HERO */}
      <section className="sp-hero" style={{ background: selected.gradient }}>
        <div className="sp-hero-content">
          <span className="sp-badge">🌿 AYURVEDIC SEASONS</span>
          <h1>
            {selected.emoji} {selected.name} Ritu
          </h1>
          <p className="sp-hero-sub">
            {selected.englishName} · {selected.months}
          </p>
          <p className="sp-hero-desc">{selected.description}</p>
          <div className="sp-dosha-badge">
            <span>Primary Dosha:</span>
            <strong
              style={{ color: selected.doshaColor, background: "white", padding: "4px 14px", borderRadius: "20px" }}
            >
              {selected.dosha}
            </strong>
          </div>
        </div>
        <div className="sp-hero-emoji">{selected.bgImage}</div>
      </section>

      {/* SEASON SELECTOR */}
      <section className="sp-selector-section">
        <div className="sp-selector-header">
          <h2>Select a Season</h2>
          <p>Explore all 6 Ayurvedic Ritu and their unique guidance</p>
        </div>
        <div className="sp-season-grid">
          {seasons.map((s) => (
            <div
              key={s.id}
              className={`sp-season-card ${selectedId === s.id ? "sp-season-card--active" : ""} ${s.id === currentSeasonId ? "sp-season-card--current" : ""}`}
              onClick={() => {
                setSelectedId(s.id);
                setActiveTab("overview");
              }}
              style={{
                borderColor: selectedId === s.id ? selected.accent : "transparent",
              }}
            >
              {s.id === currentSeasonId && (
                <span className="current-tag">Current</span>
              )}
              <div className="sp-card-emoji">{s.emoji}</div>
              <h3>{s.name}</h3>
              <p>{s.englishName}</p>
              <small>{s.months}</small>
              <div
                className="sp-dosha-tag"
                style={{ background: s.color, color: s.accent }}
              >
                {s.dosha}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TABS */}
      <section className="sp-detail-section">
        <div className="sp-tabs">
          {["overview", "diet", "lifestyle", "herbs"].map((tab) => (
            <button
              key={tab}
              className={`sp-tab ${activeTab === tab ? "sp-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" && "📋 Overview"}
              {tab === "diet" && "🥗 Diet Guide"}
              {tab === "lifestyle" && "🧘 Lifestyle"}
              {tab === "herbs" && "🌿 Herbs"}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="sp-tab-content">
            <div className="sp-overview-grid">
              <div className="sp-info-card">
                <h3>About {selected.name} Ritu</h3>
                <p>{selected.description}</p>
                <div className="sp-qualities">
                  <h4>Season Qualities (Gunas):</h4>
                  <div className="sp-quality-chips">
                    {selected.qualities.map((q) => (
                      <span key={q} className="sp-quality-chip">{q}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sp-stats-card">
                <div className="sp-stat">
                  <span className="sp-stat-icon">📅</span>
                  <div>
                    <p className="sp-stat-label">Duration</p>
                    <p className="sp-stat-value">{selected.months}</p>
                  </div>
                </div>
                <div className="sp-stat">
                  <span className="sp-stat-icon">⚡</span>
                  <div>
                    <p className="sp-stat-label">Aggravated Dosha</p>
                    <p className="sp-stat-value" style={{ color: selected.doshaColor }}>
                      {selected.dosha}
                    </p>
                  </div>
                </div>
                <div className="sp-stat">
                  <span className="sp-stat-icon">🌡️</span>
                  <div>
                    <p className="sp-stat-label">Dominant Qualities</p>
                    <p className="sp-stat-value">{selected.qualities.join(", ")}</p>
                  </div>
                </div>
                <div className="sp-stat">
                  <span className="sp-stat-icon">🌿</span>
                  <div>
                    <p className="sp-stat-label">Key Herbs</p>
                    <p className="sp-stat-value">{selected.herbs.slice(0, 2).join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sp-quick-tips">
              <div className="sp-quick-tip do">
                <h4>✅ Do This Season</h4>
                <ul>
                  {selected.dietTips.slice(0, 3).map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                  {selected.lifestyleTips.slice(0, 2).map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="sp-quick-tip avoid">
                <h4>❌ Avoid This Season</h4>
                <ul>
                  {selected.avoidFoods.map((food) => (
                    <li key={food}>{food}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* DIET TAB */}
        {activeTab === "diet" && (
          <div className="sp-tab-content">
            <div className="sp-diet-header">
              <h3>{selected.emoji} {selected.name} Diet Recommendations</h3>
              <p>
                During {selected.name} Ritu, focus on foods that balance{" "}
                <strong>{selected.dosha} Dosha</strong>.
              </p>
            </div>
            <div className="sp-diet-grid">
              <div className="sp-diet-card recommended">
                <h4>🌿 Foods to Include</h4>
                <ul>
                  {selected.dietTips.map((tip, i) => (
                    <li key={i}>
                      <span className="sp-check">✓</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sp-diet-card avoid">
                <h4>🚫 Foods to Avoid</h4>
                <ul>
                  {selected.avoidFoods.map((food, i) => (
                    <li key={i}>
                      <span className="sp-cross">✗</span> {food}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="sp-diet-cta">
              <p>Want a complete food guide with categories and dosha filters?</p>
              <button onClick={() => navigate("/diet")} className="sp-cta-btn">
                Explore Full Diet Guide →
              </button>
            </div>
          </div>
        )}

        {/* LIFESTYLE TAB */}
        {activeTab === "lifestyle" && (
          <div className="sp-tab-content">
            <div className="sp-lifestyle-header">
              <h3>🧘 {selected.name} Lifestyle Practices</h3>
              <p>Daily routines and practices to align with {selected.englishName}</p>
            </div>
            <div className="sp-lifestyle-list">
              {selected.lifestyleTips.map((tip, i) => (
                <div key={i} className="sp-lifestyle-item">
                  <div
                    className="sp-lifestyle-num"
                    style={{ background: selected.gradient }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
            <div className="sp-diet-cta">
              <p>Explore a complete Ayurvedic daily routine guide</p>
              <button onClick={() => navigate("/lifestyle")} className="sp-cta-btn">
                View Full Lifestyle Guide →
              </button>
            </div>
          </div>
        )}

        {/* HERBS TAB */}
        {activeTab === "herbs" && (
          <div className="sp-tab-content">
            <div className="sp-herbs-header">
              <h3>🌿 Recommended Herbs for {selected.name}</h3>
              <p>
                These Ayurvedic herbs are particularly beneficial during{" "}
                {selected.englishName} to maintain dosha balance.
              </p>
            </div>
            <div className="sp-herbs-grid">
              {selected.herbs.map((herb, i) => {
                const herbDetails = {
                  Ashwagandha: { emoji: "🌿", benefit: "Adaptogen. Builds strength and immunity. Calms Vata." },
                  Brahmi: { emoji: "🍃", benefit: "Brain tonic. Reduces Pitta and stress. Improves memory." },
                  Triphala: { emoji: "🫐", benefit: "Gentle detox. Balances all three doshas. Supports digestion." },
                  Neem: { emoji: "🌳", benefit: "Blood purifier. Reduces Kapha and Pitta. Antibacterial." },
                  Tulsi: { emoji: "🌱", benefit: "Holy basil. Immunity booster. Relieves respiratory issues." },
                  Shatavari: { emoji: "🌿", benefit: "Cooling tonic. Nourishes Pitta. Supports female health." },
                  Amalaki: { emoji: "🫐", benefit: "Richest in Vitamin C. Tridoshic Rasayana." },
                  Guduchi: { emoji: "🍃", benefit: "Immunity herb. Reduces all doshas. Anti-inflammatory." },
                  Haritaki: { emoji: "🌿", benefit: "Digestive tonic. Detoxifier. Balances Vata." },
                  Ginger: { emoji: "🫚", benefit: "Universal medicine. Kindles Agni. Reduces Vata and Kapha." },
                  Bala: { emoji: "🌸", benefit: "Strength herb. Nourishes tissues. Calms Vata." },
                  Trikatu: { emoji: "🌶️", benefit: "Digestive stimulant. Clears Ama. Reduces Kapha." },
                  Chyawanprash: { emoji: "🏺", benefit: "Rasayana jam. Builds Ojas. Strengthens immunity." },
                };
                const details = herbDetails[herb] || {
                  emoji: "🌿",
                  benefit: "Traditional Ayurvedic herb for seasonal balance.",
                };
                return (
                  <div key={i} className="sp-herb-card">
                    <div
                      className="sp-herb-icon"
                      style={{ background: selected.color }}
                    >
                      {details.emoji}
                    </div>
                    <h4>{herb}</h4>
                    <p>{details.benefit}</p>
                  </div>
                );
              })}
            </div>
            <div className="sp-herb-note">
              <p>
                🔔 <strong>Note:</strong> Always consult an Ayurvedic practitioner before
                starting any herbal regimen. Individual needs vary based on Prakriti and
                current health condition.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="sp-footer">
        <div>
          <h3>🌿 RutuSutra</h3>
          <p>Ayurveda • Seasons • Wellness</p>
          <p>© 2026 RutuSutra. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Season;
