function Hero() {
  return (
    <section id="home" className="hero">

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <p className="hero-tag">
          🌿 AYURVEDA • SEASONS • WELLNESS
        </p>

        <h1>
          Live in Harmony
          <br />
          With Every Season
        </h1>

        <p className="hero-description">
          Discover personalized Ayurvedic guidance for your diet,
          lifestyle and daily wellness based on your Prakriti,
          current season and local weather.
        </p>

        <div className="hero-buttons">

          <a href="#seasons" className="primary-btn">
            Discover Your Prakriti →
          </a>

          <a href="#diet" className="secondary-btn">
            Explore Wellness
          </a>

        </div>

        <div className="hero-features">

          <span>🌿 Seasonal Ayurveda</span>

          <span>☀️ Weather Based</span>

          <span>🥗 Personalized Diet</span>

        </div>

      </div>

    </section>
  );
}

export default Hero;