import React, { useState } from "react";
import "./createTest.css";

function TestCreator() {
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(60); // in minutes
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "",
      marks: 1,
      type: "mcq",
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
    },
  ]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleQuestionChange = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (questionId, optionId, field, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        const updatedOptions = q.options.map((opt) =>
          opt.id === optionId
            ? { ...opt, [field]: value }
            : field === "isCorrect" && value === true
            ? { ...opt, isCorrect: false }
            : opt
        );

        return { ...q, options: updatedOptions };
      })
    );
  };

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id), 0) + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        text: "",
        marks: 1,
        type: "mcq",
        options: [
          { id: 1, text: "", isCorrect: false },
          { id: 2, text: "", isCorrect: false },
          { id: 3, text: "", isCorrect: false },
          { id: 4, text: "", isCorrect: false },
        ],
      },
    ]);

    // Automatically scroll to the new question
    setTimeout(() => {
      const newQuestionElement = document.getElementById(`question-${newId}`);
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        const newOptionId = Math.max(...q.options.map((o) => o.id), 0) + 1;
        return {
          ...q,
          options: [
            ...q.options,
            { id: newOptionId, text: "", isCorrect: false },
          ],
        };
      })
    );
  };

  const removeOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        if (q.options.length <= 2) return q; // Keep at least 2 options

        return {
          ...q,
          options: q.options.filter((o) => o.id !== optionId),
        };
      })
    );
  };

  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + parseInt(q.marks || 0), 0);
  };

  const handleSaveTest = () => {
    if (!testTitle.trim()) {
      alert("Please enter a test title");
      return;
    }

    // Validate each question has text
    const emptyQuestions = questions.filter((q) => !q.text.trim());
    if (emptyQuestions.length > 0) {
      alert(
        `Please fill in all question texts. ${emptyQuestions.length} questions are empty.`
      );
      return;
    }

    // For MCQ questions, validate options
    const invalidMcqs = questions.filter(
      (q) =>
        q.type === "mcq" &&
        (q.options.some((o) => !o.text.trim()) ||
          !q.options.some((o) => o.isCorrect))
    );

    if (invalidMcqs.length > 0) {
      alert(
        `Please fill in all options and mark at least one correct option for each MCQ. ${invalidMcqs.length} questions have incomplete options.`
      );
      return;
    }

    const testData = {
      title: testTitle,
      duration: testDuration,
      questions: questions,
      totalMarks: calculateTotalMarks(),
      createdAt: new Date().toISOString(),
    };

    console.log("Test saved:", testData);
    // Here you would typically send this data to your backend
    alert("Test saved successfully!");
  };

  const changeQuestionType = (questionId, newType) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        // If changing to text type, remove all but one option
        const updatedOptions =
          newType === "text"
            ? [{ id: 1, text: "Answer", isCorrect: true }]
            : q.options.length > 0
            ? q.options
            : [
                { id: 1, text: "", isCorrect: false },
                { id: 2, text: "", isCorrect: false },
              ];

        return { ...q, type: newType, options: updatedOptions };
      })
    );
  };

  const duplicateQuestion = (id) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (!questionToDuplicate) return;

    const newId = Math.max(...questions.map((q) => q.id), 0) + 1;
    const duplicatedQuestion = {
      ...JSON.parse(JSON.stringify(questionToDuplicate)),
      id: newId,
    };

    // Find the index of the question to duplicate
    const index = questions.findIndex((q) => q.id === id);

    // Insert the duplicated question after the original
    const updatedQuestions = [
      ...questions.slice(0, index + 1),
      duplicatedQuestion,
      ...questions.slice(index + 1),
    ];

    setQuestions(updatedQuestions);

    // Scroll to the new question
    setTimeout(() => {
      const newQuestionElement = document.getElementById(`question-${newId}`);
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const renderQuestionPreview = (question, index) => {
    return (
      <div className="question-preview">
        <h3>
          Question {index + 1} ({question.marks} mark
          {question.marks > 1 ? "s" : ""})
        </h3>
        <p className="question-text">{question.text || "(No question text)"}</p>

        {question.type === "mcq" && (
          <div className="options-preview">
            {question.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`option-preview ${
                  option.isCorrect ? "correct-option" : ""
                }`}
              >
                <span className="option-label">
                  {String.fromCharCode(65 + optIndex)}.
                </span>
                <span className="option-text">
                  {option.text || "(No option text)"}
                </span>
                {option.isCorrect && <span className="correct-badge">✓</span>}
              </div>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <div className="text-answer-preview">
            <p>Answer: {question.options[0]?.text || "(No answer provided)"}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Fixed header that will scroll with the page */}
      <div className="fixed-header">
        <div className="header-content">
          <div className="header-left">
            <h1>
              {testTitle ? testTitle : "Create New Test"}
              {testTitle && <span className="title-label">Test Title</span>}
            </h1>
          </div>
          <div className="header-right">
            <div className="test-summary">
              <div className="summary-item">
                <span>Questions:</span>
                <strong>{questions.length}</strong>
              </div>
              <div className="summary-item">
                <span>Total Marks:</span>
                <strong>{calculateTotalMarks()}</strong>
              </div>
              <div className="summary-item">
                <span>Duration:</span>
                <strong>{testDuration} min</strong>
              </div>
            </div>
            <div className="header-actions">
              <button
                className={`btn-preview ${isPreviewMode ? "active" : ""}`}
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? "Edit" : "Preview"}
              </button>
              <button className="btn-save" onClick={handleSaveTest}>
                Save Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container, separate from the header */}
      <div className="main-container">
        <div className="test-creator-body">
          {!isPreviewMode ? (
            <>
              <div className="test-settings-section">
                <div className="section-title">Test Settings</div>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>Test Title:</label>
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      placeholder="Enter test title"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Test Duration (minutes):</label>
                    <input
                      type="number"
                      value={testDuration}
                      onChange={(e) => setTestDuration(e.target.value)}
                      min="1"
                      className="form-control duration-input"
                    />
                  </div>
                </div>
              </div>

              <div className="questions-container">
                <div className="section-title">Questions</div>

                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    id={`question-${question.id}`}
                    className="question-card"
                  >
                    <div className="question-header">
                      <h3>Question {index + 1}</h3>
                      <div className="question-actions">
                        <button
                          className="btn-icon btn-duplicate"
                          onClick={() => duplicateQuestion(question.id)}
                          title="Duplicate Question"
                        >
                          <span className="icon">📋</span>
                        </button>
                        <button
                          className="btn-icon btn-remove"
                          onClick={() => removeQuestion(question.id)}
                          disabled={questions.length <= 1}
                          title="Remove Question"
                        >
                          <span className="icon">🗑️</span>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Question:</label>
                      <textarea
                        value={question.text}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Enter your question"
                        className="form-control"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Marks:</label>
                        <input
                          type="number"
                          value={question.marks}
                          onChange={(e) =>
                            handleQuestionChange(
                              question.id,
                              "marks",
                              e.target.value
                            )
                          }
                          min="1"
                          className="form-control marks-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Question Type:</label>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            changeQuestionType(question.id, e.target.value)
                          }
                          className="form-control"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="text">Text Answer</option>
                        </select>
                      </div>
                    </div>

                    {question.type === "mcq" && (
                      <div className="options-container">
                        <h4>Options</h4>

                        {question.options.map((option, optIndex) => (
                          <div key={option.id} className="option-row">
                            <div className="option-label">
                              {String.fromCharCode(65 + optIndex)}.
                            </div>
                            <div className="option-text">
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) =>
                                  handleOptionChange(
                                    question.id,
                                    option.id,
                                    "text",
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${optIndex + 1}`}
                                className="form-control"
                              />
                            </div>

                            <div className="option-correct">
                              <label>
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={option.isCorrect}
                                  onChange={() =>
                                    handleOptionChange(
                                      question.id,
                                      option.id,
                                      "isCorrect",
                                      true
                                    )
                                  }
                                />
                                Correct
                              </label>
                            </div>

                            <button
                              className="btn-remove-option"
                              onClick={() =>
                                removeOption(question.id, option.id)
                              }
                              disabled={question.options.length <= 2}
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        <button
                          className="btn-add-option"
                          onClick={() => addOption(question.id)}
                        >
                          Add Option
                        </button>
                      </div>
                    )}

                    {question.type === "text" && (
                      <div className="form-group">
                        <label>Correct Answer:</label>
                        <input
                          type="text"
                          value={question.options[0]?.text || ""}
                          onChange={(e) =>
                            handleOptionChange(
                              question.id,
                              question.options[0]?.id,
                              "text",
                              e.target.value
                            )
                          }
                          placeholder="Enter the correct answer"
                          className="form-control"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <button className="btn-add-question" onClick={addQuestion}>
                  Add Question
                </button>
              </div>
            </>
          ) : (
            <div className="preview-mode">
              <div className="preview-header">
                <h2>{testTitle || "Untitled Test"}</h2>
                <div className="preview-info">
                  <span className="preview-duration">
                    Duration: {testDuration} minutes
                  </span>
                  <span className="preview-marks">
                    Total Marks: {calculateTotalMarks()}
                  </span>
                </div>
                <div className="preview-instructions">
                  <p>
                    Answer all questions. Each question carries the marks
                    indicated.
                  </p>
                </div>
              </div>

              <div className="preview-questions">
                {questions.map((question, index) => (
                  <div key={index} className="preview-question-card">
                    {renderQuestionPreview(question, index)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestCreator;
