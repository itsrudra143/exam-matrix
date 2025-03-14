import React, { useState, useEffect } from "react";
import "./StudentTest.css"; // You'll need to create this CSS file separately

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
      {
        id: 2,
        status: "not-attempted",
        section: "SectionA",
        text: "Which CSS property is used to change the text color of an element?",
        options: [
          { id: "A", text: "text-color", selected: false },
          { id: "B", text: "font-color", selected: false },
          { id: "C", text: "color", selected: false },
          { id: "D", text: "text-style", selected: false },
        ],
      },
      {
        id: 3,
        status: "not-attempted",
        section: "SectionA",
        text: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
        options: [
          { id: "A", text: "alt", selected: false },
          { id: "B", text: "src", selected: false },
          { id: "C", text: "title", selected: false },
          { id: "D", text: "desc", selected: false },
        ],
      },
      {
        id: 4,
        status: "not-attempted",
        section: "SectionA",
        text: "Which CSS property is used to change the left margin of an element?",
        options: [
          { id: "A", text: "margin", selected: false },
          { id: "B", text: "margin-left", selected: false },
          { id: "C", text: "left-margin", selected: false },
          { id: "D", text: "padding-left", selected: false },
        ],
      },
      {
        id: 5,
        status: "not-attempted",
        section: "SectionA",
        text: "Which HTML tag defines an internal style sheet?",
        options: [
          { id: "A", text: "<css>", selected: false },
          { id: "B", text: "<script>", selected: false },
          { id: "C", text: "<style>", selected: false },
          { id: "D", text: "<link>", selected: false },
        ],
      },
      {
        id: 6,
        status: "not-attempted",
        section: "SectionA",
        text: "Which CSS property is used to change the background color of an element?",
        options: [
          { id: "A", text: "background-color", selected: false },
          { id: "B", text: "bg-color", selected: false },
          { id: "C", text: "color-background", selected: false },
          { id: "D", text: "bg-style", selected: false },
        ],
      },
      {
        id: 7,
        status: "not-attempted",
        section: "SectionA",
        text: "Which HTML attribute is used to define inline styles?",
        options: [
          { id: "A", text: "style", selected: false },
          { id: "B", text: "font", selected: false },
          { id: "C", text: "class", selected: false },
          { id: "D", text: "css", selected: false },
        ],
      },
      {
        id: 8,
        status: "not-attempted",
        section: "SectionA",
        text: "Which CSS selector selects elements with a specific class?",
        options: [
          { id: "A", text: "#class", selected: false },
          { id: "B", text: ".class", selected: false },
          { id: "C", text: "class", selected: false },
          { id: "D", text: "*class", selected: false },
        ],
      },
      {
        id: 9,
        status: "not-attempted",
        section: "SectionA",
        text: "Which HTML tag is used to create a dropdown list?",
        options: [
          { id: "A", text: "<list>", selected: false },
          { id: "B", text: "<dropdown>", selected: false },
          { id: "C", text: "<select>", selected: false },
          { id: "D", text: "<option>", selected: false },
        ],
      },
      {
        id: 10,
        status: "not-attempted",
        section: "SectionA",
        text: "Which CSS property is used to change the font size of text?",
        options: [
          { id: "A", text: "text-size", selected: false },
          { id: "B", text: "font-size", selected: false },
          { id: "C", text: "size", selected: false },
          { id: "D", text: "font-style", selected: false },
        ],
      },
    ],
    SectionB: [
      {
        id: 1,
        status: "not-attempted",
        section: "SectionB",
        text: "Which HTML5 element is used to define detailed information about a document, or parts of a document?",
        options: [
          { id: "A", text: "<details>", selected: false },
          { id: "B", text: "<info>", selected: false },
          { id: "C", text: "<metadata>", selected: false },
          { id: "D", text: "<data>", selected: false },
        ],
      },
      {
        id: 2,
        status: "not-attempted",
        section: "SectionB",
        text: "Which CSS property is used to create space between the content and its border?",
        options: [
          { id: "A", text: "margin", selected: false },
          { id: "B", text: "padding", selected: false },
          { id: "C", text: "space", selected: false },
          { id: "D", text: "border-spacing", selected: false },
        ],
      },
      {
        id: 3,
        status: "not-attempted",
        section: "SectionB",
        text: "Which HTML tag defines a section in a document?",
        options: [
          { id: "A", text: "<section>", selected: false },
          { id: "B", text: "<div>", selected: false },
          { id: "C", text: "<segment>", selected: false },
          { id: "D", text: "<part>", selected: false },
        ],
      },
      {
        id: 4,
        status: "not-attempted",
        section: "SectionB",
        text: "Which CSS property is used to specify the layout of flexbox items?",
        options: [
          { id: "A", text: "flex-direction", selected: false },
          { id: "B", text: "display: flex", selected: false },
          { id: "C", text: "flex-layout", selected: false },
          { id: "D", text: "flex-container", selected: false },
        ],
      },
      {
        id: 5,
        status: "not-attempted",
        section: "SectionB",
        text: "Which HTML attribute specifies the relationship between the current document and the linked resource?",
        options: [
          { id: "A", text: "href", selected: false },
          { id: "B", text: "src", selected: false },
          { id: "C", text: "rel", selected: false },
          { id: "D", text: "link", selected: false },
        ],
      },
      {
        id: 6,
        status: "not-attempted",
        section: "SectionB",
        text: "Which CSS property is used to change the border style of an element?",
        options: [
          { id: "A", text: "border-style", selected: false },
          { id: "B", text: "border", selected: false },
          { id: "C", text: "border-type", selected: false },
          { id: "D", text: "border-line", selected: false },
        ],
      },
      {
        id: 7,
        status: "not-attempted",
        section: "SectionB",
        text: "Which HTML5 element is used to define a footer for a document or section?",
        options: [
          { id: "A", text: "<footer>", selected: false },
          { id: "B", text: "<end>", selected: false },
          { id: "C", text: "<bottom>", selected: false },
          { id: "D", text: "<conclusion>", selected: false },
        ],
      },
      {
        id: 8,
        status: "not-attempted",
        section: "SectionB",
        text: "Which CSS property is used to change the opacity of an element?",
        options: [
          { id: "A", text: "opacity", selected: false },
          { id: "B", text: "transparency", selected: false },
          { id: "C", text: "fade", selected: false },
          { id: "D", text: "visibility", selected: false },
        ],
      },
      {
        id: 9,
        status: "not-attempted",
        section: "SectionB",
        text: "Which HTML5 element is used to define a navigation link?",
        options: [
          { id: "A", text: "<nav>", selected: false },
          { id: "B", text: "<navigation>", selected: false },
          { id: "C", text: "<link>", selected: false },
          { id: "D", text: "<menu>", selected: false },
        ],
      },
      {
        id: 10,
        status: "not-attempted",
        section: "SectionB",
        text: "Which CSS property is used to change the text alignment of an element?",
        options: [
          { id: "A", text: "text-align", selected: false },
          { id: "B", text: "align", selected: false },
          { id: "C", text: "justify", selected: false },
          { id: "D", text: "text-justify", selected: false },
        ],
      },
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

  return (
    <div className="exam-container">
      {/* Header */}
      <div className="header">
        <div className="test-title">HTML & CSS Programming Test</div>
        <div className="timer">
          <div className="timer-label">Time Left</div>
          <div className="timer-display">
            <div className="timer-unit">
              <div className="timer-value">
                {time.hours.toString().padStart(2, "0")}
              </div>
              <div className="timer-unit-label">hours</div>
            </div>
            <div className="timer-unit">
              <div className="timer-value">
                {time.minutes.toString().padStart(2, "0")}
              </div>
              <div className="timer-unit-label">minutes</div>
            </div>
            <div className="timer-unit">
              <div className="timer-value">
                {time.seconds.toString().padStart(2, "0")}
              </div>
              <div className="timer-unit-label">seconds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Question Section */}
        <div className="question-area">
          <div className="question-title">
            {currentSection} - Question {currentQuestion.id}
          </div>
          <div className="question-text">{currentQuestion.text}</div>

          <div className="options">
            {currentQuestion.options &&
              currentQuestion.options.map((option) => (
                <div key={option.id} className="option">
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name="answer"
                    checked={option.selected}
                    onChange={() => handleOptionSelect(option.id)}
                  />
                  <label
                    htmlFor={`option-${option.id}`}
                    className="option-label"
                  >
                    {option.text}
                  </label>
                </div>
              ))}
          </div>

          <div className="button-area">
            <button onClick={handleMarkForReview} className="btn btn-review">
              Mark for review
            </button>
            <button
              onClick={handlePrevious}
              className="btn btn-nav"
              disabled={
                currentQuestionIndex === 0 && currentSection === "SectionA"
              }
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="btn btn-nav"
              disabled={
                currentQuestionIndex === questions[currentSection].length - 1 &&
                currentSection === "SectionB"
              }
            >
              Next
            </button>
          </div>
        </div>

        {/* Navigation Panel */}
        <div className="navigation-area">
          {/* SectionA */}
          <div className="section">
            <div className="section-title">Section-A</div>
            <div className="question-grid">
              {questions.SectionA.map((question) => (
                <button
                  key={`sectiona-${question.id}`}
                  onClick={() =>
                    handleQuestionNavigation("Section-A", question.id)
                  }
                  className={`question-btn ${getStatusClass(question.status)}`}
                >
                  {question.id}
                </button>
              ))}
            </div>
          </div>

          {/* SectionB */}
          <div className="section">
            <div className="section-title">Section-B</div>
            <div className="question-grid">
              {questions.SectionB.map((question) => (
                <button
                  key={`sectionb-${question.id}`}
                  onClick={() =>
                    handleQuestionNavigation("Section-B", question.id)
                  }
                  className={`question-btn ${getStatusClass(question.status)}`}
                >
                  {question.id}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-area">
            <button className="btn btn-submit">Submit Test</button>
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
              <div className="legend-text">Review</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPlatform;
