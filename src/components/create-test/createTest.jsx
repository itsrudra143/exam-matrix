import React, { useState } from "react";
import "./createTest.css";

function TestCreator() {
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "",
      type: "mcq",
      required: false,
      options: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ],
    },
  ]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
            : field === "isCorrect" && value === true && q.type === "mcq"
            ? { ...opt, isCorrect: false }
            : opt
        );

        return { ...q, options: updatedOptions };
      })
    );
  };

  // Add new question
  const addQuestion = (type = "mcq") => {
    const newId = Math.max(...questions.map((q) => q.id), 0) + 1;

    let newQuestion = {
      id: newId,
      text: "",
      type: type,
      required: false,
    };

    if (type === "mcq") {
      newQuestion.options = [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ];
    } else if (type === "coding") {
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

  // Add option to MCQ question
  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || q.type !== "mcq") return q;

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

  // Remove option from MCQ question
  const removeOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        if (q.options.length <= 2) return q; // Keep at least 2 options

        // Check if we're removing the correct option
        const removingCorrect = q.options.find(
          (o) => o.id === optionId && o.isCorrect
        );

        const filteredOptions = q.options.filter((o) => o.id !== optionId);

        // If removing the correct option, make the first remaining option correct
        if (removingCorrect && filteredOptions.length > 0) {
          filteredOptions[0].isCorrect = true;
        }

        return { ...q, options: filteredOptions };
      })
    );
  };

  // Save the test
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
      description: testDescription,
      questions: questions,
      createdAt: new Date().toISOString(),
    };

    console.log("Test saved:", testData);
    // Here you would typically send this data to your backend
    alert("Test saved successfully!");
  };

  // Change question type
  const changeQuestionType = (questionId, newType) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        let updatedQuestion = { ...q, type: newType };

        if (newType === "mcq" && !updatedQuestion.options) {
          updatedQuestion.options = [
            { id: 1, text: "", isCorrect: false },
            { id: 2, text: "", isCorrect: false },
          ];
        } else if (newType === "coding") {
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

        {question.type === "mcq" && (
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

        {question.type === "coding" && (
          <div className="coding-preview">
            <div className="programming-language">
              Language: {question.programmingLanguage || "JavaScript"}
            </div>
            <div className="code-editor-preview">
              <pre>{question.starterCode || "// Write your code here"}</pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Toggle required state for a question
  const toggleRequired = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, required: !q.required } : q
      )
    );
  };

  return (
    <div className="test-creator-container">
      {!isPreviewMode ? (
        <>
          {/* Test Title Card */}
          <div className="form-card title-card">
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="Untitled Test"
              className="form-title-input"
            />
            <textarea
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
              placeholder="Test description"
              className="form-description-input"
            />
          </div>

          {/* Questions */}
          {questions.map((question) => (
            <div key={question.id} className="form-card question-card">
              <div className="question-header">
                <div className="question-type-selector">
                  <select
                    value={question.type}
                    onChange={(e) =>
                      changeQuestionType(question.id, e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="coding">Coding Question</option>
                  </select>
                </div>

                <div className="question-actions">
                  <button
                    className="btn-icon"
                    onClick={() => duplicateQuestion(question.id)}
                    title="Duplicate"
                  >
                    <span className="material-icon">content_copy</span>
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => removeQuestion(question.id)}
                    title="Delete"
                  >
                    <span className="material-icon">delete</span>
                  </button>
                </div>
              </div>

              <div className="question-content">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(question.id, "text", e.target.value)
                  }
                  placeholder="Question"
                  className="question-input"
                />

                {question.type === "mcq" && (
                  <div className="options-container">
                    {question.options.map((option, optIndex) => (
                      <div key={option.id} className="option-row">
                        <input
                          type="radio"
                          id={`option-${question.id}-${option.id}`}
                          name={`question-${question.id}`}
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionChange(
                              question.id,
                              option.id,
                              "isCorrect",
                              true
                            )
                          }
                          className="option-radio"
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
                          placeholder={`Option ${optIndex + 1}`}
                          className="option-input"
                        />
                        <button
                          className="btn-icon btn-remove-option"
                          onClick={() => removeOption(question.id, option.id)}
                          disabled={question.options.length <= 2}
                        >
                          <span className="material-icon">close</span>
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn-add-option"
                      onClick={() => addOption(question.id)}
                    >
                      Add option
                    </button>
                  </div>
                )}

                {question.type === "coding" && (
                  <div className="coding-container">
                    <div className="form-group">
                      <label>Programming Language:</label>
                      <select
                        value={question.programmingLanguage || "javascript"}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "programmingLanguage",
                            e.target.value
                          )
                        }
                        className="form-select"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Starter Code:</label>
                      <textarea
                        value={
                          question.starterCode || "// Write your code here"
                        }
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "starterCode",
                            e.target.value
                          )
                        }
                        className="code-editor"
                      />
                    </div>

                    <div className="form-group">
                      <label>Sample Solution (For Grading):</label>
                      <textarea
                        value={
                          question.sampleSolution || "// Sample solution here"
                        }
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id,
                            "sampleSolution",
                            e.target.value
                          )
                        }
                        className="code-editor"
                      />
                    </div>
                  </div>
                )}

                <div className="question-footer">
                  <label className="required-toggle">
                    <input
                      type="checkbox"
                      checked={question.required || false}
                      onChange={() => toggleRequired(question.id)}
                    />
                    Required
                  </label>
                </div>
              </div>
            </div>
          ))}

          {/* Add Question Button */}
          <div className="add-question-container">
            <button
              className="btn-add-question"
              onClick={() => addQuestion("mcq")}
            >
              <span className="material-icon">add</span> Add Question
            </button>
            <div className="question-type-menu">
              <button
                className="btn-question-type"
                onClick={() => addQuestion("mcq")}
              >
                <span className="material-icon">radio_button_checked</span>
                Multiple Choice
              </button>
              <button
                className="btn-question-type"
                onClick={() => addQuestion("coding")}
              >
                <span className="material-icon">code</span>
                Coding Question
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              className="btn-preview"
              onClick={() => setIsPreviewMode(true)}
            >
              Preview
            </button>
            <button className="btn-save" onClick={handleSaveTest}>
              Save
            </button>
          </div>
        </>
      ) : (
        <div className="preview-container">
          <div className="preview-header">
            <h1>{testTitle || "Untitled Test"}</h1>
            <p className="preview-description">{testDescription}</p>
          </div>

          <div className="preview-questions">
            {questions.map((question, index) => (
              <div key={index} className="preview-question-card">
                {renderQuestionPreview(question, index)}
              </div>
            ))}
          </div>

          <div className="preview-actions">
            <button
              className="btn-back-to-edit"
              onClick={() => setIsPreviewMode(false)}
            >
              Back to Edit
            </button>
            <button className="btn-submit">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestCreator;
