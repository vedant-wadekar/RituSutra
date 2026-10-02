import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const team = [
  {
    name: "Ancient Wisdom",
    role: "Charaka Samhita",
    emoji: "📜",
    desc: "Our foundation lies in the Charaka Samhita, the primary text of Ayurvedic medicine written over 2000 years ago.",
  },
  {
    name: "Modern Science",
    role: "Evidence-Based Approach",
    emoji: "🔬",
    desc: "We bridge traditional knowledge with modern nutritional science to make Ayurveda accessible and actionable.",
  },
  {
    name: "Personalization",
    role: "Your Prakriti",
    emoji: "🌿",
    desc: "Every person is unique. Our platform tailors guidance to your individual constitution and current health needs.",
  },
];

const faqs = [
  {
    q: "What is Ayurveda?",
    a: "Ayurveda is a 5000-year-old system of medicine from India. It translates to 'the science of life' (Ayur = life, Veda = knowledge) and focuses on maintaining health through diet, lifestyle, herbs, and seasonal alignment.",
  },
  {
    q: "What are the 6 Ayurvedic Seasons (Ritu)?",
    a: "Ayurveda divides the year into 6 seasons: Vasanta (Spring), Grishma (Summer), Varsha (Monsoon), Sharad (Autumn), Hemanta (Early Winter), and Shishira (Late Winter). Each season affects the doshas differently.",
  },
  {
    q: "What are Doshas?",
    a: "Doshas are bio-energetic forces that govern all physical and mental processes. There are three doshas: Vata (air & space), Pitta (fire & water), and Kapha (earth & water). Everyone has a unique combination of these.",
  },
  {
    q: "What is Prakriti?",
    a: "Prakriti is your unique Ayurvedic constitution determined at birth. It describes the natural proportion of your three doshas. Understanding your Prakriti helps you make personalised diet and lifestyle choices.",
  },
  {
    q: "What is Agni?",
    a: "Agni is the digestive fire — the metabolic force that transforms food into energy and nutrients. Weak Agni leads to accumulation of Ama (toxins). Strong Agni is the foundation of good health in Ayurveda.",
  },
  {
    q: "Is this medical advice?",
    a: "RutuSutra provides educational information based on Ayurvedic principles. It is not a substitute for professional medical advice. Always consult an Ayurvedic practitioner or healthcare provider for specific health concerns.",
  },
];

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* NAVBAR */}
      <nav className="ap-navbar">
        <div className="ap-logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          🌿 RutuSutra
        </div>
        <div className="ap-nav-links">
          <span onClick={() => navigate("/home")}>Home</span>
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/season")}>Seasons</span>
          <span onClick={() => navigate("/diet")}>Diet</span>
          <span onClick={() => navigate("/lifestyle")}>Lifestyle</span>
          <span className="active">About</span>
        </div>
        <button className="ap-back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </nav>

      {/* HERO */}
      <section className="ap-hero">
        <div className="ap-hero-content">
          <span className="ap-badge">🌿 ABOUT RUTUSUTRA</span>
          <h1>
            Ancient wisdom for
            <br />
            modern living.
          </h1>
          <p>
            RutuSutra is a platform that makes the timeless wisdom of Ayurveda
            accessible to everyone. We bridge 5000 years of traditional
            knowledge with modern personalized wellness guidance.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="ap-mission">
        <div className="ap-mission-content">
          <p className="ap-label">OUR MISSION</p>
          <h2>
            Empowering seasonal wellness
            <br />
            through Ayurveda.
          </h2>
          <p>
            We believe that living in harmony with nature's rhythms is the
            foundation of true health. Ayurveda has understood this for
            thousands of years — that the seasons shape not just the weather,
            but our bodies, minds, and souls.
          </p>
          <p>
            RutuSutra takes the profound knowledge of Ritucharya (seasonal
            regimen) and Dinacharya (daily routine) and makes it
            understandable, beautiful, and actionable for the modern world.
          </p>
        </div>
        <div className="ap-mission-visual">
          <div className="ap-mandala">
            <div className="ap-mandala-ring">
              {["🌸", "☀️", "🌧️", "🍂", "❄️", "🌨️"].map((emoji, i) => (
                <div
                  key={i}
                  className="ap-mandala-dot"
                  style={{
                    transform: `rotate(${i * 60}deg) translateY(-70px)`,
                  }}
                >
                  {emoji}
                </div>
              ))}
              <div className="ap-mandala-center">🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="ap-pillars">
        <div className="ap-section-header">
          <p className="ap-label">OUR APPROACH</p>
          <h2>Built on three pillars</h2>
        </div>
        <div className="ap-pillars-grid">
          {team.map((t, i) => (
            <div key={i} className="ap-pillar-card">
              <div className="ap-pillar-emoji">{t.emoji}</div>
              <h3>{t.name}</h3>
              <p className="ap-pillar-role">{t.role}</p>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="ap-stats">
        {[
          { num: "5000+", label: "Years of Ayurvedic knowledge" },
          { num: "6", label: "Ayurvedic seasons covered" },
          { num: "3", label: "Doshas explained" },
          { num: "24+", label: "Ayurvedic foods in our library" },
        ].map((s, i) => (
          <div key={i} className="ap-stat">
            <h3>{s.num}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      {/* AYURVEDA GLOSSARY */}
      <section className="ap-glossary">
        <div className="ap-section-header">
          <p className="ap-label">AYURVEDIC TERMS</p>
          <h2>Key concepts explained</h2>
        </div>
        <div className="ap-glossary-grid">
          {[
            { term: "Prakriti", meaning: "Your innate Ayurvedic body constitution, determined at birth." },
            { term: "Vikriti", meaning: "Your current state of dosha imbalance, which can change over time." },
            { term: "Agni", meaning: "The digestive fire. The root of health and disease in Ayurveda." },
            { term: "Ama", meaning: "Undigested toxins that accumulate due to weak Agni. Root cause of illness." },
            { term: "Ojas", meaning: "The vital essence of all tissues. The foundation of immunity and vitality." },
            { term: "Ritu", meaning: "Season. Ayurveda recognises 6 Ritu in a year, each requiring different care." },
            { term: "Dinacharya", meaning: "Daily routine. The Ayurvedic system of daily practices aligned with nature." },
            { term: "Ritucharya", meaning: "Seasonal regimen. Adjusting diet and lifestyle according to each Ritu." },
            { term: "Rasayana", meaning: "Rejuvenation therapy. Foods and herbs that nourish tissues and promote longevity." },
            { term: "Panchakarma", meaning: "Five purification therapies for deep detoxification and dosha balancing." },
            { term: "Abhyanga", meaning: "Self-massage with warm oil. Nourishes skin, calms Vata, improves circulation." },
            { term: "Nasya", meaning: "Nasal administration of medicated oils. Clears the channels above the neck." },
          ].map((g, i) => (
            <div key={i} className="ap-glossary-item">
              <h4>{g.term}</h4>
              <p>{g.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="ap-faq">
        <div className="ap-section-header">
          <p className="ap-label">FAQ</p>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="ap-faq-list">
          {faqs.map((f, i) => (
            <FAQItem key={i} question={f.q} answer={f.a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ap-cta">
        <h2>Start your seasonal wellness journey</h2>
        <p>
          Explore Ayurvedic seasons, discover the right diet for your dosha,
          and build a daily routine aligned with nature.
        </p>
        <div className="ap-cta-buttons">
          <button onClick={() => navigate("/season")} className="ap-cta-btn primary">
            Explore Seasons →
          </button>
          <button onClick={() => navigate("/diet")} className="ap-cta-btn secondary">
            Diet Guide →
          </button>
          <button onClick={() => navigate("/lifestyle")} className="ap-cta-btn secondary">
            Lifestyle →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ap-footer">
        <div className="ap-footer-content">
          <div>
            <h3>🌿 RutuSutra</h3>
            <p>Ayurveda • Seasons • Wellness</p>
          </div>
          <div className="ap-footer-links">
            <span onClick={() => navigate("/home")}>Home</span>
            <span onClick={() => navigate("/season")}>Seasons</span>
            <span onClick={() => navigate("/diet")}>Diet</span>
            <span onClick={() => navigate("/lifestyle")}>Lifestyle</span>
          </div>
        </div>
        <div className="ap-footer-bottom">
          <p>
            © 2026 RutuSutra. All rights reserved. Built with 🌿 and ancient wisdom.
          </p>
          <p>
            Disclaimer: The content on RutuSutra is for educational purposes
            only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>

    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`ap-faq-item ${isOpen ? "ap-faq-item--open" : ""}`}>
      <button className="ap-faq-q" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className="ap-faq-icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <p className="ap-faq-a">{answer}</p>}
    </div>
  );
}

export default About;
