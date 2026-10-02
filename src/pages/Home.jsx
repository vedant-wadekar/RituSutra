import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import lifestyleImg from "../assets/images/lifestyle.jpg";
import herbsImg from "../assets/images/herbs.jpg";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className={`home-navbar ${scrolled ? "home-navbar--scrolled" : ""}`}>
        <div className="home-logo" onClick={() => scrollToSection("home")} style={{ cursor: "pointer" }}>
          🌿 RutuSutra
        </div>

        <div className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          <a onClick={() => scrollToSection("home")}>Home</a>
          <a onClick={() => navigate("/dashboard")} style={{ fontWeight: 600, color: "#2d5a27" }}>✨ Dashboard</a>
          <a onClick={() => scrollToSection("seasons")}>Seasons</a>
          <a onClick={() => scrollToSection("diet-section")}>Diet</a>
          <a onClick={() => scrollToSection("lifestyle")}>Lifestyle</a>
          <a onClick={() => scrollToSection("about")}>About</a>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="hero-small">🌿 AYURVEDA • SEASONS • WELLNESS</p>
          <h1>
            Live in harmony
            <br />
            with every season.
          </h1>
          <p>
            Discover personalized Ayurvedic guidance for your diet, lifestyle
            and daily wellness based on your Prakriti, current season and local
            weather.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/dashboard")} className="primary-cta">
              Personalized Dashboard →
            </button>
            <button
              className="secondary-button"
              onClick={() => scrollToSection("seasons")}
            >
              Explore Seasons
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-heading">
          <p>PERSONALIZED WELLNESS</p>
          <h2>
            Your wellness,
            <br />
            guided by nature.
          </h2>
        </div>
        <div className="feature-grid">
          <div className="home-feature-card" onClick={() => navigate("/season")}>
            <span>🌿</span>
            <h3>Personalized Ayurveda</h3>
            <p>
              Get recommendations based on your Prakriti and individual
              wellness needs.
            </p>
            <span className="card-link">Learn more →</span>
          </div>
          <div className="home-feature-card" onClick={() => navigate("/season")}>
            <span>☀️</span>
            <h3>Seasonal Guidance</h3>
            <p>
              Understand what to eat and how to live according to each Ritu.
            </p>
            <span className="card-link">Explore Seasons →</span>
          </div>
          <div className="home-feature-card" onClick={() => navigate("/diet")}>
            <span>🌦️</span>
            <h3>Weather Based</h3>
            <p>
              Receive recommendations according to your local weather
              conditions.
            </p>
            <span className="card-link">Check Diet →</span>
          </div>
          <div className="home-feature-card" onClick={() => navigate("/diet")}>
            <span>🥗</span>
            <h3>Smart Diet</h3>
            <p>Discover seasonal foods, meals and lifestyle suggestions.</p>
            <span className="card-link">View Foods →</span>
          </div>
        </div>
      </section>

      {/* SEASONS */}
      <section className="season-section" id="seasons">
        <div>
          <p className="section-label">AYURVEDIC SEASONS</p>
          <h2>
            Understand your
            <br />
            body's rhythm.
          </h2>
          <p>
            RutuSutra connects traditional Ayurvedic seasonal wisdom with
            modern personalized wellness recommendations. Each of the 6 Ritu
            carries its own energy and requires a unique approach to diet and
            lifestyle.
          </p>
          <div className="season-cards-mini">
            {[
              { emoji: "🌸", name: "Vasanta", sub: "Spring" },
              { emoji: "☀️", name: "Grishma", sub: "Summer" },
              { emoji: "🌧️", name: "Varsha", sub: "Monsoon" },
              { emoji: "🍂", name: "Sharad", sub: "Autumn" },
              { emoji: "❄️", name: "Hemanta", sub: "Early Winter" },
              { emoji: "🌨️", name: "Shishira", sub: "Late Winter" },
            ].map((s) => (
              <div
                key={s.name}
                className="mini-season-chip"
                onClick={() => navigate("/season")}
              >
                <span>{s.emoji}</span>
                <div>
                  <strong>{s.name}</strong>
                  <small>{s.sub}</small>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/season")} className="section-cta">
            Explore All Seasons →
          </button>
        </div>
        <div className="season-image">
          <img src={lifestyleImg} alt="Ayurvedic lifestyle" />
        </div>
      </section>

      {/* DIET SECTION */}
      <section className="diet-preview-section" id="diet-section">
        <div className="diet-preview-image">
          <img src={herbsImg} alt="Ayurvedic herbs and foods" />
        </div>
        <div className="diet-preview-content">
          <p className="section-label">SEASONAL DIET</p>
          <h2>
            Eat right for
            <br />
            every season.
          </h2>
          <p>
            Ayurveda prescribes specific foods for each season to maintain
            balance of the three doshas — Vata, Pitta, and Kapha. Discover
            what foods best support your body right now.
          </p>
          <div className="dosha-pills">
            <span className="dosha-pill vata">Vata</span>
            <span className="dosha-pill pitta">Pitta</span>
            <span className="dosha-pill kapha">Kapha</span>
          </div>
          <button onClick={() => navigate("/diet")} className="section-cta">
            Explore Diet Guide →
          </button>
        </div>
      </section>

      {/* LIFESTYLE */}
      <section className="lifestyle-section" id="lifestyle">
        <div className="section-heading centered">
          <p>DAILY ROUTINE</p>
          <h2>
            A lifestyle rooted
            <br />
            in ancient wisdom.
          </h2>
          <p className="section-desc">
            Dinacharya — the Ayurvedic daily routine — aligns your body clock
            with nature's rhythms. Small changes in your routine can create
            profound transformations in health and wellbeing.
          </p>
        </div>
        <div className="lifestyle-grid">
          {[
            {
              time: "🌄 Dawn (5–7 AM)",
              title: "Brahma Muhurta",
              desc: "Wake before sunrise. Meditate, practice pranayama. Drink warm water to flush the system.",
              color: "#fff3e0",
              border: "#f39c12",
            },
            {
              time: "🌅 Morning (7–9 AM)",
              title: "Abhyanga & Exercise",
              desc: "Self-oil massage with sesame or coconut oil followed by yoga or walking for 30 minutes.",
              color: "#e8f5e9",
              border: "#27ae60",
            },
            {
              time: "☀️ Noon (12–2 PM)",
              title: "Main Meal",
              desc: "Largest meal of the day when digestive fire (Agni) is strongest. Eat mindfully, in peace.",
              color: "#e3f2fd",
              border: "#2980b9",
            },
            {
              time: "🌆 Evening (5–7 PM)",
              title: "Gentle Walk & Reflection",
              desc: "A short walk at dusk. Light stretching, journaling, or creative pursuits. Avoid screens.",
              color: "#fce4ec",
              border: "#e74c3c",
            },
            {
              time: "🌙 Night (9–10 PM)",
              title: "Wind Down",
              desc: "Light dinner 3 hours before sleep. Warm milk with nutmeg. Sleep by 10 PM for best rest.",
              color: "#f3e5f5",
              border: "#8e44ad",
            },
            {
              time: "💤 Sleep (10 PM – 5 AM)",
              title: "Deep Restoration",
              desc: "Quality sleep is the greatest healer. Avoid stimulants, screens and heavy food at night.",
              color: "#e8eaf6",
              border: "#3f51b5",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="lifestyle-card"
              style={{
                background: item.color,
                borderLeft: `4px solid ${item.border}`,
              }}
            >
              <p className="lifestyle-time">{item.time}</p>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="lifestyle-cta">
          <button onClick={() => navigate("/lifestyle")} className="section-cta">
            Full Lifestyle Guide →
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-heading centered">
          <p>HOW RUTUSUTRA WORKS</p>
          <h2>
            Your journey towards
            <span> seasonal wellness.</span>
          </h2>
        </div>
        <div className="steps-grid">
          {[
            {
              num: "01",
              icon: "🧘",
              title: "Know Your Prakriti",
              desc: "Understand your unique Ayurvedic body constitution — Vata, Pitta or Kapha.",
            },
            {
              num: "02",
              icon: "🌤️",
              title: "Understand Your Season",
              desc: "Get personalised recommendations based on the current Ritu and your local weather.",
            },
            {
              num: "03",
              icon: "🥗",
              title: "Get Personalised Guidance",
              desc: "Receive food, lifestyle and daily wellness suggestions tailored just for you.",
            },
          ].map((step) => (
            <div key={step.num} className="step-card">
              <div className="step-number">{step.num}</div>
              <div className="step-icon-large">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / FOOTER */}
      <footer id="about">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>🌿 RutuSutra</h2>
            <p>Ayurveda • Seasons • Wellness</p>
            <p className="footer-desc">
              Bringing ancient Ayurvedic wisdom to modern life through
              personalized seasonal wellness guidance.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <a onClick={() => scrollToSection("home")}>Home</a>
              <a onClick={() => navigate("/season")}>Seasons</a>
              <a onClick={() => navigate("/diet")}>Diet Guide</a>
              <a onClick={() => navigate("/lifestyle")}>Lifestyle</a>
            </div>
            <div className="footer-col">
              <h4>Doshas</h4>
              <a onClick={() => navigate("/season")}>Vata</a>
              <a onClick={() => navigate("/season")}>Pitta</a>
              <a onClick={() => navigate("/season")}>Kapha</a>
            </div>
            <div className="footer-col">
              <h4>Seasons</h4>
              <a onClick={() => navigate("/season")}>Vasanta (Spring)</a>
              <a onClick={() => navigate("/season")}>Grishma (Summer)</a>
              <a onClick={() => navigate("/season")}>Varsha (Monsoon)</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 RutuSutra. All rights reserved. Built with 🌿 and ancient wisdom.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;