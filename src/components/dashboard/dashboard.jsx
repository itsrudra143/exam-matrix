import React from "react";
import "./dashboard.css";

const StudentDashboard = () => {
  const subjects = [
    {
      name: "Core Concepts of C++",
      totalMarks: 100,
      marksObtained: 85,
      grade: "B",
    },
    {
      name: "Python Programming",
      totalMarks: 100,
      marksObtained: 78,
      grade: "B",
    },
    {
      name: "Data Structures and Algorithms",
      totalMarks: 100,
      marksObtained: 92,
      grade: "A",
    },
    {
      name: "Full Stack Development",
      totalMarks: 100,
      marksObtained: 65,
      grade: "C",
    },
    {
      name: "Operating Systems",
      totalMarks: 100,
      marksObtained: 88,
      grade: "B+",
    },
  ];

  const activities = [
    { grade: "A", label: "Hackathons", progress: 84 },
    { grade: "B+", label: "Extra Curricular", progress: 78 },
    { grade: "B", label: "Attendance", progress: 55 },
    { grade: "A+", label: "Group Discussions", progress: 98 },
  ];

  const gradingScale = [
    { grade: "A+", range: "100-96" },
    { grade: "A", range: "95-91" },
    { grade: "B+", range: "90-86" },
    { grade: "B", range: "85-80" },
    { grade: "C", range: "79-75" },
    { grade: "D", range: "74-70" },
  ];

  return (
    <div className="dashboard-container">
      <main className="dashboard-content">
        <section className="student-details">
          <div className="student-info">
            <h2>Rudrakshi</h2>
            <div className="info-grid">
              <p>Roll Number: 2210990747</p>
              <p>Class Number: G12</p>
              <p>Mentor: Dr. Parneet Kaur</p>
              <p>Batch: 2022-2026</p>
            </div>
          </div>
          <div className="final-score">
            <div className="score-radar">
              <svg className="progress-circle" viewBox="0 0 120 120">
                <circle className="circle-background" cx="60" cy="60" r="54" />
                <circle
                  className="circle-progress"
                  cx="60"
                  cy="60"
                  r="54"
                  style={{
                    strokeDasharray: "339.292",
                    strokeDashoffset: "58.286", // 82% progress calculation
                  }}
                />
              </svg>
              <div className="score-content">
                <span className="score-percentage">82%</span>
                {/* <span className="score-grade">B</span> */}
              </div>
            </div>
            <p className="grade-description">Final Score</p>
          </div>
        </section>
        <section className="full-width-section">
          <div className="marks-section">
            <h3>Subject Performance</h3>
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Maximum Marks</th>
                  <th>Marks Obtained</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.name}</td>
                    <td>{subject.totalMarks}</td>
                    <td>{subject.marksObtained}</td>
                    <td className={`grade-${subject.grade}`}>
                      {subject.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="line-graph-section">
          <h3>Performance Trend</h3>
          <div className="line-graph-container">
            <svg className="line-graph" viewBox="0 0 1000 450">
              {" "}
              {/* Increased viewBox height */}
              {/* X Axis */}
              <line
                x1="50"
                y1="340"
                x2="950"
                y2="340"
                className="axis-line"
              />{" "}
              {/* Raised axis line */}
              {subjects.map((subject, index) => (
                <text
                  key={`x-label-${index}`}
                  x={50 + (index * 900) / subjects.length}
                  y="370" /* Lowered label position */
                  className="axis-label"
                  textAnchor="middle"
                  dy="0.5em" /* Added vertical offset */
                >
                  {subject.name} {/* Show full name */}
                </text>
              ))}
              {/* Y Axis */}
              <line x1="50" y1="50" x2="50" y2="350" className="axis-line" />
              {[100, 80, 60, 40, 20].map((value, index) => (
                <>
                  <line
                    key={`y-grid-${index}`}
                    x1="50"
                    y1={350 - value * 3}
                    x2="950"
                    y2={350 - value * 3}
                    className="grid-line"
                  />
                  <text
                    key={`y-label-${index}`}
                    x="20"
                    y={350 - value * 3 + 5}
                    className="axis-label"
                  >
                    {value}
                  </text>
                </>
              ))}
              {/* Data Points and Line */}
              <polyline
                points={subjects
                  .map(
                    (subject, index) =>
                      `${50 + (index * 900) / subjects.length},${
                        350 - subject.marksObtained * 3
                      }`
                  )
                  .join(" ")}
                className="data-line"
              />
              {subjects.map((subject, index) => (
                <circle
                  key={`data-point-${index}`}
                  cx={50 + (index * 900) / subjects.length}
                  cy={350 - subject.marksObtained * 3}
                  r="4"
                  className="data-point"
                />
              ))}
            </svg>
          </div>
        </section>
        <section className="activities-section">
          <h3>Activities & Conduct</h3>
          <div className="activities-grid">
            {activities.map((activity, index) => (
              <div className="activity-item" key={index}>
                <div className="activity-grade">{activity.grade}</div>
                <div className="activity-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${activity.progress}%` }}
                  ></div>
                </div>
                <div className="activity-label">{activity.label}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="full-width-section">
          <div className="grade-details">
            <h3>Grade Distribution</h3>
            <table className="grade-table">
              <thead>
                <tr>
                  <th>Grade</th>
                  {gradingScale.map((scale, index) => (
                    <th key={index}>{scale.grade}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Score Range</td>
                  {gradingScale.map((scale, index) => (
                    <td key={index}>{scale.range}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
