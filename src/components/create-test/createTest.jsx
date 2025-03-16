import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTest } from "../../hooks/useTests";
import "./createTest.css";

function TestCreator() {
  const navigate = useNavigate();
  const createTestMutation = useCreateTest();
  
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [duration, setDuration] = useState(60); // Default 60 minutes
  const [maxAttempts, setMaxAttempts] = useState(1); // Default 1 attempt
  const [expiryDuration, setExpiryDuration] = useState(""); // Optional expiry duration
  const [expiryUnit, setExpiryUnit] = useState("days"); // Default to days
  const [isUnlimitedAttempts, setIsUnlimitedAttempts] = useState(false); // For unlimited attempts
  const [isInfiniteExpiry, setIsInfiniteExpiry] = useState(true); // Default to infinite expiry
  const [startDate, setStartDate] = useState(""); // Start date for the test
  const [startTime, setStartTime] = useState(""); // Start time for the test
  const [useStartDateTime, setUseStartDateTime] = useState(false); // Whether to use start date/time
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "",
      type: "MCQ",
      required: false,
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ],
    },
  ]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Handle question text change
  const handleQuestionChange = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  // Handle option changes
  const handleOptionChange = (questionId, optionId, field, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        const updatedOptions = q.options.map((opt) =>
          opt.id === optionId
            ? { ...opt, [field]: value }
            : field === "isCorrect" && value === true && q.type === "MCQ"
            ? { ...opt, isCorrect: false }
            : opt
        );

        return { ...q, options: updatedOptions };
      })
    );
  };

  // Add new question
  const addQuestion = (type = "MCQ") => {
    const newId = Math.max(...questions.map((q) => q.id), 0) + 1;

    let newQuestion = {
      id: newId,
      text: "",
      type: type,
      required: false,
    };

    if (type === "MCQ" || type === "CHECKBOX") {
      newQuestion.options = [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ];
    } else if (type === "CODING") {
      newQuestion.programmingLanguage = "javascript";
      newQuestion.starterCode = "// Write your code here";
      newQuestion.sampleSolution = "// Sample solution here";
    }

    setQuestions([...questions, newQuestion]);
  };

  // Remove a question
  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Add option to MCQ or checkbox question
  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || (q.type !== "MCQ" && q.type !== "CHECKBOX"))
          return q;

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

  // Remove option from MCQ or checkbox question
  const removeOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        if (q.options.length <= 2) return q; // Keep at least 2 options

        // For MCQ, check if we're removing the correct option
        const removingCorrect =
          q.type === "MCQ" &&
          q.options.find((o) => o.id === optionId && o.isCorrect);

        const filteredOptions = q.options.filter((o) => o.id !== optionId);

        // If removing the correct option in MCQ, make the first remaining option correct
        if (removingCorrect && filteredOptions.length > 0) {
          filteredOptions[0].isCorrect = true;
        }

        return { ...q, options: filteredOptions };
      })
    );
  };

  // Save the test
  const handleSaveTest = async () => {
    if (!testTitle.trim()) {
      setError("Please enter a test title");
      return;
    }

    // Validate each question has text
    const emptyQuestions = questions.filter((q) => !q.text.trim());
    if (emptyQuestions.length > 0) {
      setError(`Please fill in all question texts. ${emptyQuestions.length} questions are empty.`);
      return;
    }

    // For MCQ and checkbox questions, validate options
    const invalidQuestions = questions.filter(
      (q) =>
        (q.type === "MCQ" || q.type === "CHECKBOX") &&
        (q.options.some((o) => !o.text.trim()) ||
          (q.type === "MCQ" && !q.options.some((o) => o.isCorrect)))
    );

    if (invalidQuestions.length > 0) {
      setError(
        `Please fill in all options and mark at least one correct option for each MCQ. ${invalidQuestions.length} questions have incomplete options.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      // Parse start date and time if provided
      let startDateTime = null;
      if (useStartDateTime && startDate) {
        const dateStr = startDate;
        const timeStr = startTime || "00:00";
        startDateTime = new Date(`${dateStr}T${timeStr}`);
        
        // Validate the date is in the future
        if (startDateTime <= new Date()) {
          setError("Start date and time must be in the future");
          setIsSubmitting(false);
          return;
        }
      }
      
      // Format the test data for the API
      const testData = {
        title: testTitle,
        description: testDescription,
        duration: parseInt(duration),
        maxAttempts: isUnlimitedAttempts ? -1 : parseInt(maxAttempts),
        expiryDuration: isInfiniteExpiry ? null : parseInt(expiryDuration),
        expiryUnit: expiryUnit,
        startTime: startDateTime,
        questions: questions.map((q, index) => ({
          text: q.text,
          type: q.type,
          required: q.required,
          order: index + 1,
          options: q.type === "MCQ" || q.type === "CHECKBOX" 
            ? q.options.map(o => ({
                text: o.text,
                isCorrect: o.isCorrect
              }))
            : undefined
        }))
      };
      
      // Call the API to create the test
      await createTestMutation.mutateAsync(testData);
      
      // Navigate to dashboard on success
      alert("Test saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving test:", error);
      setError(error.response?.data?.message || "Failed to save test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change question type
  const changeQuestionType = (questionId, newType) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        let updatedQuestion = { ...q, type: newType };

        if (
          (newType === "MCQ" || newType === "CHECKBOX") &&
          !updatedQuestion.options
        ) {
          updatedQuestion.options = [
            { id: 1, text: "", isCorrect: false },
            { id: 2, text: "", isCorrect: false },
          ];
        } else if (newType === "CODING") {
          delete updatedQuestion.options;
          updatedQuestion.programmingLanguage = "javascript";
          updatedQuestion.starterCode = "// Write your code here";
          updatedQuestion.sampleSolution = "// Sample solution here";
        }

        return updatedQuestion;
      })
    );
  };

  // Duplicate a question
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
  };

  // Render preview of a question
  const renderQuestionPreview = (question, index) => {
    return (
      <div className="question-preview">
        <h3>
          Question {index + 1}
          {question.required && <span className="required-mark">*</span>}
        </h3>
        <p className="question-text">{question.text || "(No question text)"}</p>

        {question.type === "MCQ" && (
          <div className="options-preview">
            {question.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`option-preview ${
                  option.isCorrect ? "correct-option" : ""
                }`}
              >
                <input
                  type="radio"
                  id={`preview-option-${question.id}-${option.id}`}
                  name={`preview-question-${question.id}`}
                  disabled
                />
                <label htmlFor={`preview-option-${question.id}-${option.id}`}>
                  {option.text || "(No option text)"}
                </label>
                {option.isCorrect && <span className="correct-badge">✓</span>}
              </div>
            ))}
          </div>
        )}

        {question.type === "CHECKBOX" && (
          <div className="options-preview">
            {question.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`option-preview ${
                  option.isCorrect ? "correct-option" : ""
                }`}
              >
                <input
                  type="checkbox"
                  id={`preview-option-${question.id}-${option.id}`}
                  disabled
                />
                <label htmlFor={`preview-option-${question.id}-${option.id}`}>
                  {option.text || "(No option text)"}
                </label>
                {option.isCorrect && <span className="correct-badge">✓</span>}
              </div>
            ))}
          </div>
        )}

        {question.type === "TEXT" && (
          <div className="text-preview">
            <textarea
              placeholder="Student's answer will appear here"
              disabled
            ></textarea>
          </div>
        )}

        {question.type === "CODING" && (
          <div className="coding-preview">
            <div className="code-editor-preview">
              <pre>{question.starterCode || "// Code editor will appear here"}</pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="test-creator-container">
      <div className="test-creator-header">
        <h1>{isPreviewMode ? "Test Preview" : "Create Test"}</h1>
        <div className="test-creator-actions">
          <button
            className="preview-button"
            onClick={togglePreviewMode}
          >
            {isPreviewMode ? "Edit Test" : "Preview Test"}
          </button>
          <button
            className="save-button"
            onClick={handleSaveTest}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Test"}
          </button>
        </div>
      </div>

      {error && <div className="error-message test-error">{error}</div>}

      {isPreviewMode ? (
        <div className="test-preview">
          <div className="test-preview-header">
            <h2>{testTitle || "(Untitled Test)"}</h2>
            <p className="test-description">
              {testDescription || "(No description provided)"}
            </p>
            <p className="test-duration">Duration: {duration} minutes</p>
            <p className="test-attempts">
              Attempts allowed: {isUnlimitedAttempts ? "Unlimited" : maxAttempts}
            </p>
            <p className="test-expiry">
              Expiry: {isInfiniteExpiry ? "No expiry" : `${expiryDuration} ${expiryUnit}`}
            </p>
            {useStartDateTime && startDate && (
              <p className="test-start-date">
                Starts on: {new Date(`${startDate}T${startTime || "00:00"}`).toLocaleString()}
              </p>
            )}
          </div>
          <div className="questions-preview">
            {questions.map((question, index) => (
              <div key={question.id} className="question-preview-container">
                {renderQuestionPreview(question, index)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="test-editor">
          <div className="test-details">
            <div className="form-group">
              <label htmlFor="test-title">Test Title</label>
              <input
                type="text"
                id="test-title"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Enter test title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="test-description">Description (Optional)</label>
              <textarea
                id="test-description"
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                placeholder="Enter test description"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="test-duration">Duration (minutes)</label>
              <input
                type="number"
                id="test-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Start Date & Time</label>
              <div className="start-date-container">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="use-start-date"
                    checked={useStartDateTime}
                    onChange={(e) => setUseStartDateTime(e.target.checked)}
                  />
                  <label htmlFor="use-start-date">Schedule test start</label>
                </div>
                {useStartDateTime && (
                  <div className="date-time-inputs">
                    <div className="date-input">
                      <label htmlFor="start-date">Date</label>
                      <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="time-input">
                      <label htmlFor="start-time">Time</label>
                      <input
                        type="time"
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label>Attempts Allowed</label>
              <div className="attempts-container">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="unlimited-attempts"
                    checked={isUnlimitedAttempts}
                    onChange={(e) => setIsUnlimitedAttempts(e.target.checked)}
                  />
                  <label htmlFor="unlimited-attempts">Unlimited attempts (for practice tests)</label>
                </div>
                {!isUnlimitedAttempts && (
                  <input
                    type="number"
                    id="max-attempts"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(e.target.value)}
                    min="1"
                    disabled={isUnlimitedAttempts}
                  />
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label>Test Expiry</label>
              <div className="expiry-container">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="infinite-expiry"
                    checked={isInfiniteExpiry}
                    onChange={(e) => setIsInfiniteExpiry(e.target.checked)}
                  />
                  <label htmlFor="infinite-expiry">No expiry</label>
                </div>
                {!isInfiniteExpiry && (
                  <div className="expiry-input">
                    <input
                      type="number"
                      id="expiry-duration"
                      value={expiryDuration}
                      onChange={(e) => setExpiryDuration(e.target.value)}
                      min="1"
                      disabled={isInfiniteExpiry}
                    />
                    <select 
                      value={expiryUnit}
                      onChange={(e) => setExpiryUnit(e.target.value)}
                      disabled={isInfiniteExpiry}
                      className="expiry-unit-select"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="questions-container">
            <h2>Questions</h2>
            <div className="question-types-toolbar">
              <button onClick={() => addQuestion("MCQ")}>Add MCQ</button>
              <button onClick={() => addQuestion("CHECKBOX")}>
                Add Checkbox
              </button>
              <button onClick={() => addQuestion("TEXT")}>Add Text</button>
              <button onClick={() => addQuestion("CODING")}>Add Coding</button>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="question-editor">
                <div className="question-header">
                  <h3>Question {index + 1}</h3>
                  <div className="question-actions">
                    <select
                      value={question.type}
                      onChange={(e) =>
                        changeQuestionType(question.id, e.target.value)
                      }
                    >
                      <option value="MCQ">Multiple Choice</option>
                      <option value="CHECKBOX">Checkbox</option>
                      <option value="TEXT">Text</option>
                      <option value="CODING">Coding</option>
                    </select>
                    <button
                      className="duplicate-button"
                      onClick={() => duplicateQuestion(question.id)}
                    >
                      Duplicate
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => removeQuestion(question.id)}
                      disabled={questions.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="question-content">
                  <div className="form-group">
                    <label htmlFor={`question-${question.id}`}>
                      Question Text
                    </label>
                    <textarea
                      id={`question-${question.id}`}
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionChange(question.id, "text", e.target.value)
                      }
                      placeholder="Enter question text"
                    ></textarea>
                  </div>

                  <div className="question-settings">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "required",
                            e.target.checked
                          )
                        }
                      />
                      Required
                    </label>
                  </div>

                  {(question.type === "MCQ" || question.type === "CHECKBOX") && (
                    <div className="options-editor">
                      <h4>Options</h4>
                      {question.options.map((option) => (
                        <div key={option.id} className="option-editor">
                          <input
                            type={question.type === "MCQ" ? "radio" : "checkbox"}
                            name={`question-${question.id}-options`}
                            checked={option.isCorrect}
                            onChange={(e) =>
                              handleOptionChange(
                                question.id,
                                option.id,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                          />
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
                            placeholder="Option text"
                          />
                          <button
                            className="remove-option-button"
                            onClick={() => removeOption(question.id, option.id)}
                            disabled={question.options.length <= 2}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        className="add-option-button"
                        onClick={() => addOption(question.id)}
                      >
                        Add Option
                      </button>
                    </div>
                  )}

                  {question.type === "CODING" && (
                    <div className="coding-editor">
                      <div className="form-group">
                        <label htmlFor={`language-${question.id}`}>
                          Programming Language
                        </label>
                        <select
                          id={`language-${question.id}`}
                          value={question.programmingLanguage}
                          onChange={(e) =>
                            handleQuestionChange(
                              question.id,
                              "programmingLanguage",
                              e.target.value
                            )
                          }
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor={`starter-code-${question.id}`}>
                          Starter Code
                        </label>
                        <textarea
                          id={`starter-code-${question.id}`}
                          value={question.starterCode}
                          onChange={(e) =>
                            handleQuestionChange(
                              question.id,
                              "starterCode",
                              e.target.value
                            )
                          }
                          className="code-editor"
                          placeholder="Provide starter code for students"
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor={`solution-${question.id}`}>
                          Sample Solution (for reference)
                        </label>
                        <textarea
                          id={`solution-${question.id}`}
                          value={question.sampleSolution}
                          onChange={(e) =>
                            handleQuestionChange(
                              question.id,
                              "sampleSolution",
                              e.target.value
                            )
                          }
                          className="code-editor"
                          placeholder="Provide a sample solution"
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestCreator;
