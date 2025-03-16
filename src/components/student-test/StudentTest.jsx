import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTest, useStartTest, useSubmitTest } from "../../hooks/useTests";
import "./StudentTest.css";

const StudentTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: test, isLoading: testLoading, error: testError } = useTest(id);
  const startTestMutation = useStartTest();
  const submitTestMutation = useSubmitTest();
  
  // State for timer
  const [time, setTime] = useState({
    hours: 0,
    minutes: 45,
    seconds: 0,
  });

  // Current question index and section
  const [currentSection, setCurrentSection] = useState("SectionA");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State for section collapse
  const [expandedSections, setExpandedSections] = useState({
    SectionA: true,
    SectionB: true,
  });

  // Test attempt state
  const [testAttempt, setTestAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize test attempt
  useEffect(() => {
    if (test && !testAttempt) {
      startTest();
    }
  }, [test]);

  // Set up timer when test is loaded
  useEffect(() => {
    if (test && test.duration) {
      setTime({
        hours: Math.floor(test.duration / 60),
        minutes: test.duration % 60,
        seconds: 0,
      });
    }
  }, [test]);

  // Timer countdown
  useEffect(() => {
    if (!testAttempt || time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Time's up - auto submit
          clearInterval(timer);
          handleSubmitTest();
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testAttempt]);

  // Start the test
  const startTest = async () => {
    try {
      setError("");
      const response = await startTestMutation.mutateAsync(id);
      
      // Check if the test is already completed and results are published
      if (response.status === 'COMPLETED') {
        setSuccess("This test has been completed and results are published. Redirecting to results page...");
        setTimeout(() => {
          navigate(`/test-results/${id}`);
        }, 2000);
        return;
      }
      
      // Check if maximum attempts reached
      if (response.status === 'MAX_ATTEMPTS_REACHED') {
        setError(response.message || "You have reached the maximum number of attempts for this test.");
        return;
      }
      
      setTestAttempt(response.attempt);
      
      // Initialize answers object
      if (test && test.questions) {
        const initialAnswers = {};
        test.questions.forEach(question => {
          initialAnswers[question.id] = {
            questionId: question.id,
            status: "not-attempted"
          };
          
          if (question.type === "MCQ") {
            initialAnswers[question.id].optionId = null;
          } else if (question.type === "CHECKBOX") {
            initialAnswers[question.id].selectedOptions = [];
          } else if (question.type === "TEXT") {
            initialAnswers[question.id].textAnswer = "";
          } else if (question.type === "CODING") {
            initialAnswers[question.id].codeAnswer = question.starterCode || "";
          }
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error("Error starting test:", error);
      setError(error.response?.data?.message || "Failed to start test. Please try again.");
    }
  };

  // Handle option selection for MCQ
  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        optionId,
        status: "answered"
      }
    }));
  };

  // Handle checkbox selection
  const handleCheckboxSelect = (questionId, optionId, isChecked) => {
    setAnswers(prev => {
      const currentAnswer = prev[questionId] || { questionId, selectedOptions: [], status: "not-attempted" };
      let selectedOptions = [...(currentAnswer.selectedOptions || [])];
      
      if (isChecked) {
        selectedOptions.push(optionId);
      } else {
        selectedOptions = selectedOptions.filter(id => id !== optionId);
      }
      
          return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          questionId,
          selectedOptions,
          status: selectedOptions.length > 0 ? "answered" : "not-attempted"
        }
      };
    });
  };

  // Handle text answer
  const handleTextAnswer = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        textAnswer: text,
        status: text.trim() ? "answered" : "not-attempted"
      }
    }));
  };

  // Handle code answer
  const handleCodeAnswer = (questionId, code) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        codeAnswer: code,
        status: code.trim() ? "answered" : "not-attempted"
      }
    }));
  };

  // Mark question for review
  const markForReview = (questionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        status: "marked-for-review"
      }
    }));
  };

  // Submit the test
  const handleSubmitTest = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      
      // Format answers for API
      let formattedAnswers = [];
      
      // Process each answer
      Object.values(answers).forEach(answer => {
        const { questionId, optionId, selectedOptions, textAnswer, codeAnswer } = answer;
        
        // For checkbox questions with multiple selected options
        if (selectedOptions && selectedOptions.length > 0) {
          // Create a separate answer for each selected option
          selectedOptions.forEach(optId => {
            formattedAnswers.push({
              questionId,
              optionId: optId,
              textAnswer: null,
              codeAnswer: null
            });
          });
        } else {
          // For MCQ, TEXT, and CODING questions
          formattedAnswers.push({
            questionId,
            optionId: optionId || null,
            textAnswer: textAnswer || null,
            codeAnswer: codeAnswer || null
          });
        }
      });
      
      const response = await submitTestMutation.mutateAsync({
        id,
        answers: formattedAnswers
      });
      
      setSuccess("Test submitted successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting test:", error);
      setError(error.response?.data?.message || "Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Navigate to a specific question
  const navigateToQuestion = (section, index) => {
    setCurrentSection(section);
    setCurrentQuestionIndex(index);
    
    // Ensure the section is expanded
    if (!expandedSections[section]) {
      toggleSection(section);
    }
  };

  // Get status class for question button
  const getStatusClass = (questionId) => {
    return answers[questionId]?.status || "not-attempted";
  };

  if (testLoading) {
    return <div className="loading-container">Loading test...</div>;
  }

  if (testError) {
    return <div className="error-container">Error loading test: {testError.message}</div>;
  }

  if (!test) {
    return <div className="error-container">Test not found</div>;
  }

  // Group questions by section (for this example, we'll create sections based on question type)
  const sections = {
    SectionA: test.questions.filter(q => q.type === "MCQ" || q.type === "CHECKBOX"),
    SectionB: test.questions.filter(q => q.type === "TEXT" || q.type === "CODING")
  };

  // Get current question
  const currentQuestions = sections[currentSection] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <div className="exam-container">
      {/* Test Header */}
      <div className="test-header">
        <div className="test-title">
          <h1>{test.title}</h1>
        </div>
        {testAttempt && (
          <div className="timer">
            <span className="timer-label">Time Remaining</span>
            <div className="timer-display">
              <div className="timer-unit">
                <div className="timer-value">{String(time.hours).padStart(2, "0")}</div>
                <div className="timer-unit-label">Hours</div>
              </div>
              <div className="timer-unit">
                <div className="timer-value">{String(time.minutes).padStart(2, "0")}</div>
                <div className="timer-unit-label">Minutes</div>
              </div>
              <div className="timer-unit">
                <div className="timer-value">{String(time.seconds).padStart(2, "0")}</div>
                <div className="timer-unit-label">Seconds</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error and Success Messages */}
      {(error || success) && (
        <div className="messages-container">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>
      )}

      {/* Main Content - Only show if there's a test attempt */}
      {testAttempt ? (
        <div className="main-content">
          {/* Question Area */}
          <div className="question-area">
            {currentQuestion ? (
              <>
                <div className="question-title">
                  Question {currentQuestionIndex + 1}
                  {currentQuestion.required && <span className="required-mark">*</span>}
                  <span className="question-type">({currentQuestion.type})</span>
                </div>

                <div className="question-text">
                  <p>{currentQuestion.text}</p>
                </div>

                <div className="options">
                  {currentQuestion.type === "MCQ" && (
                    <div className="mcq-options">
                      {currentQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className={`option ${
                            test.isPublished 
                              ? option.isCorrect 
                                ? 'correct' 
                                : option.isSelected 
                                  ? 'incorrect' 
                                  : '' 
                              : answers[currentQuestion.id]?.optionId === option.id 
                                ? 'selected' 
                                : ''
                          }`}
                        >
                          <input
                            type="radio"
                            id={`option-${option.id}`}
                            name={`question-${currentQuestion.id}`}
                            checked={test.isPublished ? option.isSelected : answers[currentQuestion.id]?.optionId === option.id}
                            onChange={() => handleOptionSelect(currentQuestion.id, option.id)}
                            disabled={test.isPublished}
                          />
                          <label className="option-label" htmlFor={`option-${option.id}`}>
                            {option.text}
                            {test.isPublished && option.isCorrect && <span className="correct-mark">✓</span>}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "CHECKBOX" && (
                    <div className="checkbox-options">
                      {currentQuestion.options.map((option) => (
                        <div 
                          key={option.id} 
                          className={`option ${
                            test.isPublished 
                              ? option.isCorrect 
                                ? 'correct' 
                                : option.isSelected 
                                  ? 'incorrect' 
                                  : '' 
                              : answers[currentQuestion.id]?.selectedOptions?.includes(option.id) 
                                ? 'selected' 
                                : ''
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`option-${option.id}`}
                            checked={test.isPublished ? option.isSelected : answers[currentQuestion.id]?.selectedOptions?.includes(option.id)}
                            onChange={(e) => handleCheckboxSelect(currentQuestion.id, option.id, e.target.checked)}
                            disabled={test.isPublished}
                          />
                          <label className="option-label" htmlFor={`option-${option.id}`}>
                            {option.text}
                            {test.isPublished && option.isCorrect && <span className="correct-mark">✓</span>}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {currentQuestion.type === "TEXT" && (
                  <div className="text-answer">
                    {test.isPublished && currentQuestion.studentAnswer ? (
                      <div className="published-answer">
                        <div className="answer-label">Your Answer:</div>
                        <div className="answer-content">{currentQuestion.studentAnswer}</div>
                      </div>
                    ) : (
                      <textarea
                        placeholder="Type your answer here..."
                        value={answers[currentQuestion.id]?.textAnswer || ""}
                        onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
                        disabled={test.isPublished}
                      ></textarea>
                    )}
                  </div>
                )}

                {currentQuestion.type === "CODING" && (
                  <div className="coding-answer">
                    {test.isPublished && currentQuestion.studentAnswer ? (
                      <div className="published-answer">
                        <div className="answer-label">Your Code:</div>
                        <pre className="code-display">{currentQuestion.studentAnswer}</pre>
                      </div>
                    ) : (
                      <textarea
                        className="code-editor"
                        placeholder="Write your code here..."
                        value={answers[currentQuestion.id]?.codeAnswer || currentQuestion.starterCode || ""}
                        onChange={(e) => handleCodeAnswer(currentQuestion.id, e.target.value)}
                        disabled={test.isPublished}
                      ></textarea>
                    )}
                  </div>
                )}

                <div className="button-area">
                  <button
                    className="btn btn-review"
                    onClick={() => markForReview(currentQuestion.id)}
                  >
                    Mark for Review
                  </button>
                  <div className="navigation-buttons">
                    <button
                      className="btn btn-nav"
                      disabled={
                        currentSection === "SectionA" && currentQuestionIndex === 0
                      }
                      onClick={() => {
                        if (currentQuestionIndex > 0) {
                          setCurrentQuestionIndex(currentQuestionIndex - 1);
                        } else if (currentSection === "SectionB") {
                          setCurrentSection("SectionA");
                          setCurrentQuestionIndex(sections.SectionA.length - 1);
                        }
                      }}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-nav"
                      disabled={
                        currentSection === "SectionB" &&
                        currentQuestionIndex === sections.SectionB.length - 1
                      }
                      onClick={() => {
                        if (
                          currentQuestionIndex <
                          currentQuestions.length - 1
                        ) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else if (currentSection === "SectionA") {
                          setCurrentSection("SectionB");
                          setCurrentQuestionIndex(0);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-question-message">
                <p>No questions available in this section.</p>
              </div>
            )}
          </div>

          {/* Navigation Area */}
          <div className="navigation-area">
            <div className="nav-header">
              <h3>Questions</h3>
              <div className="question-count">
                {Object.values(sections).flat().length} Questions
              </div>
            </div>

            {Object.keys(sections).map((section) => (
              <div key={section} className="section">
                <div 
                  className={`section-title collapsible`}
                  onClick={() => toggleSection(section)}
                >
                  {section}
                  <span className={`collapse-icon ${expandedSections[section] ? 'expanded' : ''}`}>
                    {expandedSections[section] ? '▼' : '▶'}
                  </span>
                </div>

                <div className={`question-grid-container ${expandedSections[section] ? 'expanded' : ''}`}>
                  <div className="question-grid">
                    {sections[section].map((question, index) => (
                      <button
                        key={question.id}
                        className={`question-btn ${
                          answers[question.id]?.status === "answered" ? "answered" : 
                          answers[question.id]?.status === "marked-for-review" ? "review" : 
                          "not-attempted"
                        } ${
                          currentSection === section &&
                          currentQuestionIndex === index
                            ? "current"
                            : ""
                        }`}
                        onClick={() => navigateToQuestion(section, index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="legend">
              <div className="legend-item">
                <div className="legend-color not-attempted"></div>
                <span className="legend-text">Not Attempted</span>
              </div>
              <div className="legend-item">
                <div className="legend-color current"></div>
                <span className="legend-text">Current</span>
              </div>
              <div className="legend-item">
                <div className="legend-color answered"></div>
                <span className="legend-text">Answered</span>
              </div>
              <div className="legend-item">
                <div className="legend-color review"></div>
                <span className="legend-text">Marked for Review</span>
              </div>
            </div>

            <div className="submit-area">
              <button 
                className="btn btn-submit"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      ) : !error && !success && (
        <div className="loading-container">
          <p>Loading test...</p>
        </div>
      )}
    </div>
  );
};

export default StudentTest;
