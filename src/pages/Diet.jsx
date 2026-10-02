import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dietFoods, dietCategories, doshaTypes, mealPlans } from "../data/diet";
import { seasons, getCurrentSeason } from "../data/seasons";
import "./Diet.css";

function Diet() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDosha, setActiveDosha] = useState("all");
  const [activeSeason, setActiveSeason] = useState("all");
  const [activeView, setActiveView] = useState("foods");
  const [searchQuery, setSearchQuery] = useState("");

  const currentSeason = getCurrentSeason();
  const currentSeasonData = seasons.find((s) => s.id === currentSeason);

  const filteredFoods = useMemo(() => {
    return dietFoods.filter((food) => {
      const categoryMatch =
        activeCategory === "all" || food.category === activeCategory;
      const doshaMatch =
        activeDosha === "all" || food.dosha.includes(activeDosha);
      const seasonMatch =
        activeSeason === "all" || food.season.includes(activeSeason);
      const searchMatch =
        searchQuery === "" ||
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return categoryMatch && doshaMatch && seasonMatch && searchMatch;
    });
  }, [activeCategory, activeDosha, activeSeason, searchQuery]);

  const mealPlan = mealPlans[currentSeason] || mealPlans.vasanta;
  const mealPlanSeason = activeSeason !== "all" ? mealPlans[activeSeason] : mealPlan;

  return (
    <div className="diet-page">

      {/* NAVBAR */}
      <nav className="dp-navbar">
        <div className="dp-logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          🌿 RutuSutra
        </div>
        <div className="dp-nav-links">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/season")}>Seasons</span>
          <span className="active">Diet</span>
          <span onClick={() => navigate("/lifestyle")}>Lifestyle</span>
          <span onClick={() => navigate("/about")}>About</span>
        </div>
        <button className="dp-back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </nav>

      {/* HERO */}
      <section className="dp-hero">
        <div className="dp-hero-content">
          <span className="dp-badge">🥗 AYURVEDIC DIET GUIDE</span>
          <h1>
            Eat right for
            <br />
            every season.
          </h1>
          <p>
            Discover the best Ayurvedic foods for your dosha and current
            season. Explore seasonal recipes, food wisdom and meal plans rooted
            in 5000 years of knowledge.
          </p>
          <div className="dp-current-season-pill">
            <span>🌤️ Current Season:</span>
            <strong>
              {currentSeasonData?.emoji} {currentSeasonData?.name} (
              {currentSeasonData?.englishName})
            </strong>
          </div>
        </div>
        <div className="dp-hero-stats">
          <div className="dp-stat-card">
            <span>{dietFoods.length}+</span>
            <p>Ayurvedic Foods</p>
          </div>
          <div className="dp-stat-card">
            <span>6</span>
            <p>Season Plans</p>
          </div>
          <div className="dp-stat-card">
            <span>3</span>
            <p>Doshas Covered</p>
          </div>
        </div>
      </section>

      {/* VIEW TOGGLE */}
      <div className="dp-view-toggle">
        <button
          className={activeView === "foods" ? "active" : ""}
          onClick={() => setActiveView("foods")}
        >
          🍽️ Food Library
        </button>
        <button
          className={activeView === "mealplan" ? "active" : ""}
          onClick={() => setActiveView("mealplan")}
        >
          📋 Meal Plans
        </button>
      </div>

      {/* FOOD LIBRARY VIEW */}
      {activeView === "foods" && (
        <section className="dp-foods-section">
          {/* SEARCH */}
          <div className="dp-search-bar">
            <span className="dp-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search foods, benefits, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="dp-clear-btn" onClick={() => setSearchQuery("")}>
                ✕
              </button>
            )}
          </div>

          {/* FILTERS */}
          <div className="dp-filters">
            <div className="dp-filter-group">
              <label>Category</label>
              <div className="dp-filter-chips">
                {dietCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`dp-chip ${activeCategory === cat.id ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="dp-filter-group">
              <label>Dosha</label>
              <div className="dp-filter-chips">
                {doshaTypes.map((d) => (
                  <button
                    key={d.id}
                    className={`dp-chip dp-chip--dosha ${activeDosha === d.id ? "active" : ""}`}
                    onClick={() => setActiveDosha(d.id)}
                    style={
                      activeDosha === d.id && d.color
                        ? { background: d.color, borderColor: d.color, color: "white" }
                        : {}
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="dp-filter-group">
              <label>Season</label>
              <div className="dp-filter-chips">
                <button
                  className={`dp-chip ${activeSeason === "all" ? "active" : ""}`}
                  onClick={() => setActiveSeason("all")}
                >
                  All Seasons
                </button>
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    className={`dp-chip ${activeSeason === s.id ? "active" : ""}`}
                    onClick={() => setActiveSeason(s.id)}
                  >
                    {s.emoji} {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RESULTS COUNT */}
          <div className="dp-results-bar">
            <p>
              Showing <strong>{filteredFoods.length}</strong> of {dietFoods.length} foods
              {activeCategory !== "all" && ` · ${dietCategories.find((c) => c.id === activeCategory)?.label}`}
              {activeDosha !== "all" && ` · ${activeDosha} dosha`}
              {activeSeason !== "all" && ` · ${seasons.find((s) => s.id === activeSeason)?.name} season`}
              {searchQuery && ` · "${searchQuery}"`}
            </p>
            {(activeCategory !== "all" || activeDosha !== "all" || activeSeason !== "all" || searchQuery) && (
              <button
                className="dp-clear-filters"
                onClick={() => {
                  setActiveCategory("all");
                  setActiveDosha("all");
                  setActiveSeason("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* FOOD GRID */}
          {filteredFoods.length === 0 ? (
            <div className="dp-empty">
              <span>🌿</span>
              <h3>No foods found</h3>
              <p>Try adjusting your filters or search query.</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveDosha("all");
                  setActiveSeason("all");
                  setSearchQuery("");
                }}
                className="dp-reset-btn"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="dp-food-grid">
              {filteredFoods.map((food) => (
                <div key={food.id} className={`dp-food-card ${food.recommended ? "dp-food-card--featured" : ""}`}>
                  {food.recommended && (
                    <span className="dp-featured-badge">⭐ Recommended</span>
                  )}
                  <div className="dp-food-emoji">{food.emoji}</div>
                  <h3>{food.name}</h3>
                  <p className="dp-food-taste">
                    <strong>Taste:</strong> {food.taste}
                  </p>
                  <p className="dp-food-benefit">{food.benefit}</p>
                  <div className="dp-food-meta">
                    <div className="dp-food-doshas">
                      {food.dosha.map((d) => (
                        <span key={d} className={`dp-dosha-chip dp-dosha-chip--${d}`}>
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="dp-food-tags">
                      {food.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="dp-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="dp-food-seasons">
                    {food.season.map((sid) => {
                      const s = seasons.find((x) => x.id === sid);
                      return s ? (
                        <span key={sid} className="dp-season-mini">{s.emoji} {s.name}</span>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* MEAL PLAN VIEW */}
      {activeView === "mealplan" && (
        <section className="dp-mealplan-section">
          <div className="dp-mealplan-header">
            <h2>Seasonal Meal Plans</h2>
            <p>Select a season to view the recommended daily meal plan</p>
          </div>

          <div className="dp-season-selector">
            <button
              className={activeSeason === "all" ? "active" : ""}
              onClick={() => setActiveSeason("all")}
            >
              {currentSeasonData?.emoji} Current ({currentSeasonData?.name})
            </button>
            {seasons.map((s) => (
              <button
                key={s.id}
                className={activeSeason === s.id ? "active" : ""}
                onClick={() => setActiveSeason(s.id)}
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>

          <div className="dp-mealplan-card">
            <div className="dp-mealplan-title">
              <h3>
                {activeSeason === "all"
                  ? `${currentSeasonData?.emoji} ${mealPlan.season}`
                  : `${seasons.find((s) => s.id === activeSeason)?.emoji} ${mealPlanSeason?.season}`}
              </h3>
              <p>
                {activeSeason === "all"
                  ? mealPlan.description
                  : mealPlanSeason?.description}
              </p>
            </div>

            {Object.entries(
              (activeSeason === "all" ? mealPlan : mealPlanSeason)?.meals || {}
            ).map(([mealTime, items]) => (
              <div key={mealTime} className="dp-meal-row">
                <div className="dp-meal-time">
                  {mealTime === "morning" && "🌅 Morning"}
                  {mealTime === "lunch" && "☀️ Lunch"}
                  {mealTime === "evening" && "🌆 Evening"}
                  {mealTime === "dinner" && "🌙 Dinner"}
                </div>
                <div className="dp-meal-items">
                  {items.map((item, i) => (
                    <span key={i} className="dp-meal-item">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="dp-mealplan-note">
            <p>
              💡 <strong>Ayurvedic Tip:</strong> Eat according to your hunger
              and the strength of your Agni (digestive fire). The largest meal
              should be at noon when Agni is strongest.
            </p>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="dp-footer">
        <div>
          <h3>🌿 RutuSutra</h3>
          <p>Ayurveda • Seasons • Wellness</p>
          <p>© 2026 RutuSutra. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Diet;
