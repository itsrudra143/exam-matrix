import React, { useState, useEffect } from "react";
import "./StudentTest.css";

const ExamPlatform = () => {
  // State for timer
  const [time, setTime] = useState({
    hours: 0,
    minutes: 45,
    seconds: 0,
  });

  // Current question index and section
  const [currentSection, setCurrentSection] = useState("SectionA");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions state
  const [questions, setQuestions] = useState({
    SectionA: [
      {
        id: 1,
        status: "current",
        section: "SectionA",
        text: "Which HTML tag is used to create a hyperlink?",
        options: [
          { id: "A", text: "<a>", selected: false },
          { id: "B", text: "<link>", selected: false },
          { id: "C", text: "<href>", selected: false },
          { id: "D", text: "<url>", selected: false },
        ],
      },
      // ... other SectionA questions remain the same
    ],
    SectionB: [
      // ... SectionB questions remain the same
    ],
  });

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes =
          newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
        const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;

        return {
          hours: newHours < 0 ? 0 : newHours,
          minutes: newMinutes < 0 ? 59 : newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Progress calculation
  const calculateProgress = () => {
    const totalQuestions =
      questions.SectionA.length + questions.SectionB.length;
    const answeredQuestions = [
      ...questions.SectionA.filter((q) => q.status === "answered"),
      ...questions.SectionB.filter((q) => q.status === "answered"),
    ].length;

    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Get current question
  const getCurrentQuestion = () => {
    return questions[currentSection][currentQuestionIndex];
  };

  // Handle option selection
  const handleOptionSelect = (optionId) => {
    const updatedQuestions = { ...questions };
    const currentQuestion = getCurrentQuestion();

    updatedQuestions[currentSection] = updatedQuestions[currentSection].map(
      (q) => {
        if (q.id === currentQuestion.id) {
          return {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              selected: opt.id === optionId,
            })),
            status: "answered",
          };
        }
        return q;
      }
    );

    setQuestions(updatedQuestions);
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentQuestionIndex < questions[currentSection].length - 1) {
      const updatedQuestions = { ...questions };
      const currentQuestion = getCurrentQuestion();

      if (currentQuestion.status === "current") {
        updatedQuestions[currentSection][currentQuestionIndex].status =
          "not-attempted";
      }

      updatedQuestions[currentSection][currentQuestionIndex + 1].status =
        "current";
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSection === "SectionA") {
      setCurrentSection("SectionB");
      setCurrentQuestionIndex(0);

      const updatedQuestions = { ...questions };
      const currentQuestion = getCurrentQuestion();

      if (currentQuestion.status === "current") {
        updatedQuestions[currentSection][currentQuestionIndex].status =
          "not-attempted";
      }

      updatedQuestions["SectionB"][0].status = "current";
      setQuestions(updatedQuestions);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const updatedQuestions = { ...questions };
      const currentQuestion = getCurrentQuestion();

      if (currentQuestion.status === "current") {
        updatedQuestions[currentSection][currentQuestionIndex].status =
          "not-attempted";
      }

      updatedQuestions[currentSection][currentQuestionIndex - 1].status =
        "current";
      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSection === "SectionB") {
      setCurrentSection("SectionA");
      const lastIndex = questions["SectionA"].length - 1;
      setCurrentQuestionIndex(lastIndex);

      const updatedQuestions = { ...questions };
      const currentQuestion = getCurrentQuestion();

      if (currentQuestion.status === "current") {
        updatedQuestions[currentSection][currentQuestionIndex].status =
          "not-attempted";
      }

      updatedQuestions["SectionA"][lastIndex].status = "current";
      setQuestions(updatedQuestions);
    }
  };

  const handleMarkForReview = () => {
    const updatedQuestions = { ...questions };
    const currentQuestion = getCurrentQuestion();

    updatedQuestions[currentSection] = updatedQuestions[currentSection].map(
      (q) => {
        if (q.id === currentQuestion.id) {
          return { ...q, status: "review" };
        }
        return q;
      }
    );

    setQuestions(updatedQuestions);
  };

  const handleQuestionNavigation = (section, id) => {
    const currentQuestion = getCurrentQuestion();
    const currentIndex = questions[currentSection].findIndex(
      (q) => q.id === currentQuestion.id
    );

    const updatedQuestions = { ...questions };

    if (currentQuestion.status === "current") {
      updatedQuestions[currentSection][currentIndex].status = "not-attempted";
    }

    const newIndex = questions[section].findIndex((q) => q.id === id);
    updatedQuestions[section][newIndex].status = "current";

    setQuestions(updatedQuestions);
    setCurrentSection(section);
    setCurrentQuestionIndex(newIndex);
  };

  // Get the current question to display
  const currentQuestion = getCurrentQuestion();

  // Get status color class
  const getStatusClass = (status) => {
    switch (status) {
      case "answered":
        return "answered";
      case "current":
        return "current";
      case "review":
        return "review";
      default:
        return "not-attempted";
    }
  };

  // Count answered questions
  const getAnsweredCount = () => {
    const answeredA = questions.SectionA.filter(
      (q) => q.status === "answered"
    ).length;
    const answeredB = questions.SectionB.filter(
      (q) => q.status === "answered"
    ).length;
    return answeredA + answeredB;
  };

  // Count review questions
  const getReviewCount = () => {
    const reviewA = questions.SectionA.filter(
      (q) => q.status === "review"
    ).length;
    const reviewB = questions.SectionB.filter(
      (q) => q.status === "review"
    ).length;
    return reviewA + reviewB;
  };

  // Total questions
  const totalQuestions = questions.SectionA.length + questions.SectionB.length;

  return (
    <div className="exam-container">
      {/* Header */}
      <div className="header">
        <div className="test-info">
          <div className="test-title">HTML & CSS Programming Test</div>
          <div className="test-subtitle">
            Web Development Fundamentals - Spring 2025
          </div>
        </div>
        <div className="timer-container">
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              <span className="answered-count">
                <span className="dot answered-dot"></span>
                {getAnsweredCount()}/{totalQuestions} answered
              </span>
              <span className="review-count">
                <span className="dot review-dot"></span>
                {getReviewCount()} marked for review
              </span>
            </div>
          </div>
          <div className="timer">
            <div className="timer-icon">⏱️</div>
            <div className="timer-display">
              <div className="timer-unit">
                <div className="timer-value">
                  {time.hours.toString().padStart(2, "0")}
                </div>
                <div className="timer-unit-label">h</div>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-unit">
                <div className="timer-value">
                  {time.minutes.toString().padStart(2, "0")}
                </div>
                <div className="timer-unit-label">m</div>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-unit">
                <div className="timer-value">
                  {time.seconds.toString().padStart(2, "0")}
                </div>
                <div className="timer-unit-label">s</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flipped order */}
      <div className="main-content">
        {/* Question Area - Now on the left with more width */}
        <div className="question-area">
          <div className="question-header">
            <div className="question-badge">{currentSection}</div>
            <div className="question-number">Question {currentQuestion.id}</div>
          </div>
          <div className="question-content">
            <div className="question-text">{currentQuestion.text}</div>

            <div className="options">
              {currentQuestion.options &&
                currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`option ${option.selected ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <div className="option-indicator">
                      <input
                        type="radio"
                        id={`option-${option.id}`}
                        name="answer"
                        checked={option.selected}
                        onChange={() => {}}
                      />
                    </div>
                    <label
                      htmlFor={`option-${option.id}`}
                      className="option-label"
                    >
                      {option.text}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          <div className="question-footer">
            <div className="question-status-indicator">
              <div
                className={`status-dot ${getStatusClass(
                  currentQuestion.status
                )}`}
              ></div>
              <span className="status-text">
                {currentQuestion.status === "answered"
                  ? "Answered"
                  : currentQuestion.status === "review"
                  ? "Marked for review"
                  : currentQuestion.status === "current"
                  ? "Current question"
                  : "Not attempted"}
              </span>
            </div>
            <div className="button-area">
              <button onClick={handleMarkForReview} className="btn btn-review">
                <span className="btn-icon">🔖</span> Mark for review
              </button>
              <button
                onClick={handlePrevious}
                className="btn btn-nav prev"
                disabled={
                  currentQuestionIndex === 0 && currentSection === "SectionA"
                }
              >
                <span className="btn-icon">←</span> Previous
              </button>
              <button
                onClick={handleNext}
                className="btn btn-nav next"
                disabled={
                  currentQuestionIndex ===
                    questions[currentSection].length - 1 &&
                  currentSection === "SectionB"
                }
              >
                Next <span className="btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Panel - Now on the right */}
        <div className="navigation-area">
          <div className="nav-sections-tabs">
            <div
              className={`nav-tab ${
                currentSection === "SectionA" ? "active" : ""
              }`}
              onClick={() => handleQuestionNavigation("SectionA", 1)}
            >
              Section A
            </div>
            <div
              className={`nav-tab ${
                currentSection === "SectionB" ? "active" : ""
              }`}
              onClick={() => handleQuestionNavigation("SectionB", 1)}
            >
              Section B
            </div>
          </div>

          {/* SectionA */}
          <div
            className={`section ${
              currentSection === "SectionA" ? "active" : ""
            }`}
          >
            <div className="section-title">HTML Fundamentals</div>
            <div className="question-grid">
              {questions.SectionA.map((question) => (
                <button
                  key={`sectiona-${question.id}`}
                  onClick={() =>
                    handleQuestionNavigation("SectionA", question.id)
                  }
                  className={`question-btn ${getStatusClass(question.status)}`}
                >
                  {question.id}
                </button>
              ))}
            </div>
          </div>

          {/* SectionB */}
          <div
            className={`section ${
              currentSection === "SectionB" ? "active" : ""
            }`}
          >
            <div className="section-title">CSS Fundamentals</div>
            <div className="question-grid">
              {questions.SectionB.map((question) => (
                <button
                  key={`sectionb-${question.id}`}
                  onClick={() =>
                    handleQuestionNavigation("SectionB", question.id)
                  }
                  className={`question-btn ${getStatusClass(question.status)}`}
                >
                  {question.id}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color current"></div>
              <div className="legend-text">Current</div>
            </div>
            <div className="legend-item">
              <div className="legend-color not-attempted"></div>
              <div className="legend-text">Not Attempted</div>
            </div>
            <div className="legend-item">
              <div className="legend-color answered"></div>
              <div className="legend-text">Answered</div>
            </div>
            <div className="legend-item">
              <div className="legend-color review"></div>
              <div className="legend-text">For Review</div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-area">
            <button className="btn btn-submit">Submit Test</button>
            <p className="submit-note">
              You can't change answers after submission
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPlatform;
