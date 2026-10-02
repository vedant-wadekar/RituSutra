import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PRAKRITI_QUESTIONS, calculatePrakriti } from "../engine/prakritiEngine";
import { savePrakritiAssessment } from "../services/userService";
import "./Questionnaire.css";

function Questionnaire() {
  const { currentUser, refreshProfile, updateUserProfileLocally } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1..N = questions, N+1 = result
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [direction, setDirection] = useState("forward"); // for animation

  const TOTAL_QUESTIONS = PRAKRITI_QUESTIONS.length;
  const isIntro = currentStep === 0;
  const isResult = currentStep === TOTAL_QUESTIONS + 1;
  const questionIndex = currentStep - 1; // 0-based question index when in question mode
  const currentQuestion = PRAKRITI_QUESTIONS[questionIndex];

  const progress = isResult ? 100 : isIntro ? 0 : Math.round((currentStep / TOTAL_QUESTIONS) * 100);

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (isIntro) {
      setDirection("forward");
      setCurrentStep(1);
      return;
    }

    // Validate current question has an answer
    if (!answers[currentQuestion.id]) {
      return; // no navigation without answer
    }

    setDirection("forward");

    if (currentStep === TOTAL_QUESTIONS) {
      // Calculate result
      const calc = calculatePrakriti(answers);
      setResult(calc);
      setCurrentStep(TOTAL_QUESTIONS + 1);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep <= 1) {
      setDirection("back");
      setCurrentStep(0);
      return;
    }
    setDirection("back");
    setCurrentStep((s) => s - 1);
  };

  const handleSaveAndContinue = async () => {
    if (!result) return;
    setSaving(true);
    setSaveError("");

    try {
      const uid = currentUser ? currentUser.uid : "guest_user";
      const record = {
        prakriti: result.prakriti,
        prakritiLabel: result.prakritiLabel,
        primaryDosha: result.primaryDosha,
        secondaryDosha: result.secondaryDosha,
        doshaScores: result.doshaScores,
        doshaPercentages: result.doshaPercentages,
        questionnaireAnswers: answers,
        hasCompletedAssessment: true,
        updatedAt: new Date().toISOString(),
      };

      // 1. Immediately update global state so Dashboard displays results instantly
      if (updateUserProfileLocally) {
        updateUserProfileLocally(record);
      }

      // 2. Persist locally to storage
      try {
        localStorage.setItem("prakriti_profile_current", JSON.stringify(record));
        localStorage.setItem(`prakriti_profile_${uid}`, JSON.stringify(record));
        localStorage.setItem("guest_prakriti_profile", JSON.stringify(record));
      } catch (e) {}

      // 3. Save remotely in the background without blocking the UI
      savePrakritiAssessment(uid, record).catch((err) => {
        console.warn("Background assessment save warning:", err);
      });

      // 4. Navigate to dashboard immediately!
      navigate("/dashboard");
    } catch (err) {
      console.warn("Save assessment error:", err);
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const getDosha = (d) => {
    const map = {
      vata: { color: "#7b1fa2", bg: "#f3e5f5", emoji: "🌬️" },
      pitta: { color: "#e65100", bg: "#fff3e0", emoji: "🔥" },
      kapha: { color: "#1565c0", bg: "#e3f2fd", emoji: "🌊" },
      tridoshic: { color: "#2e7d32", bg: "#e8f5e9", emoji: "⚖️" },
    };
    return map[d] || map.tridoshic;
  };

  // ---- INTRO SCREEN ----
  if (isIntro) {
    return (
      <div className="qna-page">
        <div className="qna-container">
          <div className="qna-intro-card">
            <div className="qna-intro-icon">🌿</div>
            <h1>Discover Your Prakriti</h1>
            <p className="qna-intro-subtitle">
              Your Ayurvedic body constitution — determined by birth.
            </p>
            <div className="qna-intro-body">
              <p>
                In Ayurveda, <strong>Prakriti</strong> describes your unique
                mind-body constitution. Understanding it helps you make better
                choices about diet, lifestyle, and daily routine.
              </p>
              <div className="qna-intro-doshas">
                <div className="qna-dosha-pill" style={{ background: "#f3e5f5", color: "#7b1fa2" }}>
                  🌬️ Vata — Air & Space
                </div>
                <div className="qna-dosha-pill" style={{ background: "#fff3e0", color: "#e65100" }}>
                  🔥 Pitta — Fire & Water
                </div>
                <div className="qna-dosha-pill" style={{ background: "#e3f2fd", color: "#1565c0" }}>
                  🌊 Kapha — Earth & Water
                </div>
              </div>
              <div className="qna-intro-steps">
                <div className="qna-intro-step">
                  <span>📋</span>
                  <p>Answer {TOTAL_QUESTIONS} simple questions</p>
                </div>
                <div className="qna-intro-step">
                  <span>🧮</span>
                  <p>System calculates your dosha scores</p>
                </div>
                <div className="qna-intro-step">
                  <span>✨</span>
                  <p>Get your personalized Prakriti result</p>
                </div>
              </div>
              <p className="qna-disclaimer">
                ⚠️ This is a traditional Ayurvedic wellness classification — not a medical
                diagnosis. Results are for educational purposes only.
              </p>
            </div>
            <button className="qna-start-btn" onClick={handleNext}>
              Begin Assessment →
            </button>
            <button className="qna-skip-link" onClick={() => navigate("/dashboard")}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- RESULT SCREEN ----
  if (isResult && result) {
    const primaryStyle = getDosha(result.primaryDosha?.toLowerCase());
    const { doshaPercentages } = result;

    return (
      <div className="qna-page">
        <div className="qna-container">
          <div className="qna-result-card">
            <div className="qna-result-header">
              <div
                className="qna-result-badge"
                style={{ background: primaryStyle.bg, color: primaryStyle.color }}
              >
                {primaryStyle.emoji} Your Prakriti
              </div>
              <h1 className="qna-result-prakriti">
                {result.prakritiLabel}
              </h1>
              <p className="qna-result-desc">{result.description}</p>
            </div>

            {/* Score bars */}
            <div className="qna-score-bars">
              <h3>Your Dosha Scores</h3>
              {[
                { label: "Vata 🌬️", key: "vata", color: "#7b1fa2", bg: "#f3e5f5" },
                { label: "Pitta 🔥", key: "pitta", color: "#e65100", bg: "#fff3e0" },
                { label: "Kapha 🌊", key: "kapha", color: "#1565c0", bg: "#e3f2fd" },
              ].map((d) => (
                <div key={d.key} className="qna-score-row">
                  <div className="qna-score-label">{d.label}</div>
                  <div className="qna-score-bar-track">
                    <div
                      className="qna-score-bar-fill"
                      style={{
                        width: `${doshaPercentages[d.key]}%`,
                        background: d.color,
                      }}
                    />
                  </div>
                  <div className="qna-score-pct" style={{ color: d.color }}>
                    {doshaPercentages[d.key]}%
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="qna-result-summary">
              <div className="qna-result-info">
                <span>Primary Dosha</span>
                <strong style={{ color: primaryStyle.color }}>
                  {primaryStyle.emoji} {result.primaryDosha}
                </strong>
              </div>
              {result.secondaryDosha && (
                <div className="qna-result-info">
                  <span>Secondary Dosha</span>
                  <strong>{result.secondaryDosha}</strong>
                </div>
              )}
              <div className="qna-result-info">
                <span>Questions Answered</span>
                <strong>{TOTAL_QUESTIONS} / {TOTAL_QUESTIONS}</strong>
              </div>
            </div>

            <div className="qna-result-disclaimer">
              🔔 This classification is based on traditional Ayurvedic principles and is for
              general wellness purposes only — not a medical diagnosis.
            </div>

            {saveError && (
              <div className="qna-save-error">{saveError}</div>
            )}

            <div className="qna-result-actions">
              <button
                className="qna-save-btn"
                onClick={handleSaveAndContinue}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save & Go to My Dashboard →"}
              </button>
              <button
                className="qna-retake-link"
                onClick={() => {
                  setAnswers({});
                  setResult(null);
                  setCurrentStep(0);
                }}
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- QUESTION SCREEN ----
  const hasAnswer = !!answers[currentQuestion?.id];

  return (
    <div className="qna-page">
      <div className="qna-container">
        {/* Header */}
        <div className="qna-header">
          <div className="qna-logo" onClick={() => navigate("/home")}>
            🌿 RutuSutra
          </div>
          <div className="qna-step-label">
            Question {currentStep} of {TOTAL_QUESTIONS}
          </div>
        </div>

        {/* Progress */}
        <div className="qna-progress-track">
          <div
            className="qna-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="qna-progress-label">{progress}% complete</div>

        {/* Question Card */}
        <div className={`qna-question-card qna-anim-${direction}`}>
          <div className="qna-category-badge">
            {currentQuestion?.category}
          </div>
          <h2 className="qna-question-text">
            {currentQuestion?.question}
          </h2>

          <div className="qna-options">
            {currentQuestion?.options.map((opt) => {
              const selected = answers[currentQuestion.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  className={`qna-option ${selected ? "qna-option--selected" : ""}`}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                >
                  <span className="qna-option-radio">
                    {selected ? "●" : "○"}
                  </span>
                  <span className="qna-option-text">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {!hasAnswer && (
            <p className="qna-select-hint">Please select an option to continue</p>
          )}
        </div>

        {/* Navigation */}
        <div className="qna-nav">
          <button className="qna-back-btn" onClick={handleBack}>
            ← Back
          </button>
          <button
            className={`qna-next-btn ${!hasAnswer ? "qna-next-btn--disabled" : ""}`}
            onClick={handleNext}
            disabled={!hasAnswer}
          >
            {currentStep === TOTAL_QUESTIONS ? "Calculate My Prakriti →" : "Next →"}
          </button>
        </div>

        {/* Step dots */}
        <div className="qna-dots">
          {PRAKRITI_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`qna-dot ${
                i + 1 < currentStep
                  ? "qna-dot--done"
                  : i + 1 === currentStep
                  ? "qna-dot--active"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
