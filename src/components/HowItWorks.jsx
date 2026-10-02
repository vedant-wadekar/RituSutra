import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section className="how-section" id="about">

      <div className="section-heading">
        <p>HOW RUTUSUTRA WORKS</p>

        <h2>
          Your Journey Towards
          <span> Seasonal Wellness</span>
        </h2>

        <p className="section-description">
          RutuSutra combines Ayurvedic principles, your Prakriti,
          seasonal changes and local weather to provide personalized
          wellness recommendations.
        </p>
      </div>

      <div className="steps">

        <div className="step-card">
          <div className="step-number">01</div>
          <div className="step-icon">🧘</div>

          <h3>Know Your Prakriti</h3>

          <p>
            Understand your unique body constitution and
            wellness needs.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">02</div>
          <div className="step-icon">🌤️</div>

          <h3>Understand Your Season</h3>

          <p>
            Get recommendations according to the current
            Ritu and local weather.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">03</div>
          <div className="step-icon">🥗</div>

          <h3>Get Personalized Guidance</h3>

          <p>
            Receive personalized food, lifestyle and
            daily wellness suggestions.
          </p>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;