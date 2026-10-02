import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { seasons, getCurrentSeason } from "../data/seasons";
import "./Lifestyle.css";

const dinacharya = [
  {
    time: "3:30 – 5:30 AM",
    period: "Brahma Muhurta",
    emoji: "🌌",
    title: "The Auspicious Hour",
    description:
      "The most sacred time in Ayurveda. The mind is clear, the world is quiet, and spiritual energy is at its peak. Ideal for meditation, pranayama, and setting intentions for the day.",
    practices: ["Meditation (20–30 min)", "Pranayama breathing", "Affirmations or prayer", "Light yoga or stretching"],
    dosha: "all",
    color: "#3f51b5",
    bg: "#e8eaf6",
  },
  {
    time: "5:30 – 7:00 AM",
    period: "Vata Time",
    emoji: "🌅",
    title: "Cleansing & Activation",
    description:
      "Vata energy dominates. This is the best time for elimination, cleansing rituals, and gentle activation of the body and mind.",
    practices: [
      "Drink warm water (copper vessel if possible)",
      "Natural elimination (bowel movement)",
      "Oil pulling (Gandusha) with sesame oil",
      "Tongue scraping (Jihva Nirlekhana)",
      "Warm bath or shower",
    ],
    dosha: "vata",
    color: "#7b1fa2",
    bg: "#f3e5f5",
  },
  {
    time: "7:00 – 9:00 AM",
    period: "Abhyanga & Exercise",
    emoji: "🧘",
    title: "Oil Massage & Movement",
    description:
      "Abhyanga (self-oil massage) nourishes the skin, calms the nervous system, and improves lymphatic drainage. Follow with exercise appropriate to your dosha.",
    practices: [
      "Abhyanga (self-oil massage) 10–20 min",
      "Yoga asanas (30 min)",
      "Brisk walk or jogging",
      "Light breakfast after exercise",
      "Nasal drops (Nasya) — 2–3 drops of sesame oil",
    ],
    dosha: "all",
    color: "#27ae60",
    bg: "#e8f5e9",
  },
  {
    time: "12:00 – 1:30 PM",
    period: "Pitta Time",
    emoji: "☀️",
    title: "Main Meal (Lunch)",
    description:
      "Pitta governs digestion and is at its peak at noon. This is when Agni (digestive fire) is strongest. Eat your largest, most nourishing meal now.",
    practices: [
      "Eat the largest meal of the day",
      "Eat in a calm, peaceful environment",
      "Avoid phones and screens during meals",
      "Chew slowly and mindfully",
      "Sit for 5–10 min after eating",
    ],
    dosha: "pitta",
    color: "#e65100",
    bg: "#fff3e0",
  },
  {
    time: "2:00 – 5:00 PM",
    period: "Afternoon",
    emoji: "🌤️",
    title: "Work & Focus",
    description:
      "Kapha tends to accumulate after lunch. Light activity, focused work, or creative projects are ideal. Avoid heavy foods or sleeping during this time.",
    practices: [
      "Focus work or creative projects",
      "Light herbal tea (ginger or tulsi)",
      "Short walk if feeling sluggish",
      "Avoid heavy snacking",
      "Avoid napping (unless you are elderly or unwell)",
    ],
    dosha: "kapha",
    color: "#1565c0",
    bg: "#e3f2fd",
  },
  {
    time: "5:00 – 7:00 PM",
    period: "Vata Time",
    emoji: "🌆",
    title: "Evening Transition",
    description:
      "Vata energy rises again. This is a beautiful time for gentle movement, journaling, creative expression, and connecting with loved ones.",
    practices: [
      "Evening walk at sunset",
      "Gentle yoga or stretching",
      "Journaling or reading",
      "Light activity, avoid intense exercise",
      "Begin winding down screens",
    ],
    dosha: "vata",
    color: "#e67e22",
    bg: "#fef9e7",
  },
  {
    time: "7:00 – 9:00 PM",
    period: "Kapha Time",
    emoji: "🌙",
    title: "Light Dinner & Relaxation",
    description:
      "Kapha evening energy supports rest and nourishment. Eat a light dinner at least 2–3 hours before sleep. Begin your wind-down routine.",
    practices: [
      "Light, easily digestible dinner",
      "Warm milk with turmeric and nutmeg",
      "Gentle family time",
      "Reduce blue light (phones, screens)",
      "Warm foot bath with a few drops of lavender",
    ],
    dosha: "kapha",
    color: "#8e44ad",
    bg: "#f3e5f5",
  },
  {
    time: "9:00 – 10:00 PM",
    period: "Wind Down",
    emoji: "💤",
    title: "Prepare for Sleep",
    description:
      "The Ayurvedic ideal is sleep by 10 PM. Pitta activity peaks between 10 PM and 2 AM — being awake during this time causes excess mental activity and poor regeneration.",
    practices: [
      "Abhyanga on feet with warm oil",
      "Meditation or deep breathing",
      "Gratitude journaling (3 things)",
      "No screens in bedroom",
      "Sleep by 10 PM",
    ],
    dosha: "all",
    color: "#2c3e50",
    bg: "#ecf0f1",
  },
];

const lifestylePrinciples = [
  {
    emoji: "🔥",
    title: "Agni (Digestive Fire)",
    desc: "The foundation of health in Ayurveda. Keep your Agni strong with warm foods, regular meal timings, and digestive herbs like ginger.",
  },
  {
    emoji: "⚖️",
    title: "Dosha Balance",
    desc: "Understand your Prakriti (constitution) and Vikriti (current imbalance). Adjust diet and lifestyle to restore balance.",
  },
  {
    emoji: "🌿",
    title: "Sattvic Living",
    desc: "Favour pure, light, and nourishing foods and activities. Reduce rajas (over-stimulation) and tamas (inertia).",
  },
  {
    emoji: "🌊",
    title: "Ritucharya (Seasonal Routine)",
    desc: "Adjust your daily routine each season. What works in summer may aggravate you in winter and vice versa.",
  },
  {
    emoji: "🌅",
    title: "Alignment with Nature",
    desc: "Rise with the sun, eat with the sun at its peak, and rest as it sets. Your biology is designed to follow nature's cycles.",
  },
  {
    emoji: "🧘",
    title: "Mind-Body-Spirit Unity",
    desc: "True health encompasses body, mind, and consciousness. Meditation, community, purpose, and joy are as essential as diet.",
  },
];

function Lifestyle() {
  const navigate = useNavigate();
  const [selectedDosha, setSelectedDosha] = useState("all");
  const currentSeasonId = getCurrentSeason();
  const currentSeason = seasons.find((s) => s.id === currentSeasonId);

  const filteredDinacharya =
    selectedDosha === "all"
      ? dinacharya
      : dinacharya.filter((d) => d.dosha === selectedDosha || d.dosha === "all");

  return (
    <div className="lifestyle-page">

      {/* NAVBAR */}
      <nav className="lp-navbar">
        <div className="lp-logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          🌿 RutuSutra
        </div>
        <div className="lp-nav-links">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/season")}>Seasons</span>
          <span onClick={() => navigate("/diet")}>Diet</span>
          <span className="active">Lifestyle</span>
          <span onClick={() => navigate("/about")}>About</span>
        </div>
        <button className="lp-back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <span className="lp-badge">🌿 AYURVEDIC LIFESTYLE</span>
          <h1>
            A life in rhythm
            <br />
            with nature.
          </h1>
          <p>
            Dinacharya — the Ayurvedic daily routine — is a proven system of
            daily practices that aligns your body, mind and spirit with
            nature's cycles. Small, consistent habits create profound
            transformation.
          </p>
          <div className="lp-hero-tags">
            <span>🕐 Dinacharya</span>
            <span>🌿 Ritucharya</span>
            <span>⚖️ Dosha Balance</span>
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-clock">
            {dinacharya.map((item, i) => (
              <div
                key={i}
                className="lp-clock-dot"
                style={{
                  transform: `rotate(${(i / dinacharya.length) * 360}deg) translateY(-80px)`,
                  background: item.color,
                }}
                title={item.title}
              >
                <span>{item.emoji}</span>
              </div>
            ))}
            <div className="lp-clock-center">
              🌿
              <p>Dinacharya</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT SEASON NOTE */}
      <div className="lp-season-note">
        <span>
          {currentSeason?.emoji} Current Season: <strong>{currentSeason?.name} ({currentSeason?.englishName})</strong>
        </span>
        <button onClick={() => navigate("/season")}>
          View Season Guide →
        </button>
      </div>

      {/* PRINCIPLES */}
      <section className="lp-principles">
        <div className="lp-section-header">
          <p className="lp-label">CORE PRINCIPLES</p>
          <h2>The pillars of Ayurvedic wellness</h2>
        </div>
        <div className="lp-principles-grid">
          {lifestylePrinciples.map((p, i) => (
            <div key={i} className="lp-principle-card">
              <span className="lp-principle-emoji">{p.emoji}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DINACHARYA TIMELINE */}
      <section className="lp-dinacharya">
        <div className="lp-section-header">
          <p className="lp-label">DAILY ROUTINE</p>
          <h2>Dinacharya — Hour by hour</h2>
          <p className="lp-section-desc">
            A complete guide to the Ayurvedic daily routine from sunrise to
            sleep. Filter by dosha to customise for your constitution.
          </p>
        </div>

        {/* DOSHA FILTER */}
        <div className="lp-dosha-filter">
          {[
            { id: "all", label: "All Doshas", color: "#12603c" },
            { id: "vata", label: "Vata", color: "#7b1fa2" },
            { id: "pitta", label: "Pitta", color: "#e65100" },
            { id: "kapha", label: "Kapha", color: "#1565c0" },
          ].map((d) => (
            <button
              key={d.id}
              className={`lp-dosha-btn ${selectedDosha === d.id ? "active" : ""}`}
              onClick={() => setSelectedDosha(d.id)}
              style={
                selectedDosha === d.id
                  ? { background: d.color, borderColor: d.color, color: "white" }
                  : {}
              }
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* TIMELINE */}
        <div className="lp-timeline">
          {filteredDinacharya.map((item, i) => (
            <div key={i} className="lp-timeline-item">
              <div
                className="lp-timeline-dot"
                style={{ background: item.color }}
              >
                {item.emoji}
              </div>
              <div
                className="lp-timeline-card"
                style={{ borderLeft: `4px solid ${item.color}` }}
              >
                <div className="lp-card-header">
                  <div>
                    <span
                      className="lp-time-badge"
                      style={{ background: item.bg, color: item.color }}
                    >
                      ⏰ {item.time}
                    </span>
                    <span className="lp-period-badge">{item.period}</span>
                  </div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="lp-practices">
                  <h4>Practices:</h4>
                  <ul>
                    {item.practices.map((practice, j) => (
                      <li key={j}>
                        <span
                          className="lp-practice-dot"
                          style={{ background: item.color }}
                        />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEASONAL LIFESTYLE */}
      <section className="lp-seasonal">
        <div className="lp-section-header">
          <p className="lp-label">RITUCHARYA</p>
          <h2>Seasonal lifestyle adjustments</h2>
        </div>
        <div className="lp-seasonal-grid">
          {seasons.map((s) => (
            <div
              key={s.id}
              className={`lp-seasonal-card ${s.id === currentSeasonId ? "lp-seasonal-card--current" : ""}`}
              onClick={() => navigate("/season")}
              style={{ borderTop: `4px solid ${s.accent}` }}
            >
              {s.id === currentSeasonId && (
                <span className="lp-current-badge">Current Season</span>
              )}
              <div className="lp-seasonal-emoji">{s.emoji}</div>
              <h3>{s.name}</h3>
              <p className="lp-seasonal-sub">{s.englishName} · {s.months}</p>
              <p className="lp-seasonal-tip">{s.lifestyleTips[0]}</p>
              <button
                className="lp-see-more"
                style={{ color: s.accent }}
              >
                Full seasonal guide →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-content">
          <h2>Start your Ayurvedic journey today</h2>
          <p>
            Explore seasonal diet recommendations, understand your dosha, and
            discover personalised wellness guidance.
          </p>
          <div className="lp-cta-buttons">
            <button onClick={() => navigate("/season")} className="lp-cta-btn primary">
              Explore Seasons →
            </button>
            <button onClick={() => navigate("/diet")} className="lp-cta-btn secondary">
              Diet Guide →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div>
          <h3>🌿 RutuSutra</h3>
          <p>Ayurveda • Seasons • Wellness</p>
          <p>© 2026 RutuSutra. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Lifestyle;
