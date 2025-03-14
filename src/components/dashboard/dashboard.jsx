import React from "react";
import "./dashboard.css";

const StudentDashboard = () => {
  const subjects = [
    {
      name: "Core Concepts of C++",
      totalMarks: 100,
      marksObtained: 85,
      grade: "B",
      icon: "💻",
    },
    {
      name: "Python Programming",
      totalMarks: 100,
      marksObtained: 78,
      grade: "B",
      icon: "🐍",
    },
    {
      name: "Data Structures and Algorithms",
      totalMarks: 100,
      marksObtained: 92,
      grade: "A",
      icon: "🔍",
    },
    {
      name: "Full Stack Development",
      totalMarks: 100,
      marksObtained: 65,
      grade: "C",
      icon: "🌐",
    },
    {
      name: "Operating Systems",
      totalMarks: 100,
      marksObtained: 88,
      grade: "B+",
      icon: "⚙️",
    },
  ];

  const activities = [
    { grade: "A", label: "Hackathons", progress: 84, icon: "🏆" },
    { grade: "B+", label: "Extra Curricular", progress: 78, icon: "🎭" },
    { grade: "B", label: "Attendance", progress: 55, icon: "📋" },
    { grade: "A+", label: "Group Discussions", progress: 98, icon: "👥" },
  ];

  const gradingScale = [
    { grade: "A+", range: "100-96" },
    { grade: "A", range: "95-91" },
    { grade: "B+", range: "90-86" },
    { grade: "B", range: "85-80" },
    { grade: "C", range: "79-75" },
    { grade: "D", range: "74-70" },
  ];

  // Calculate stroke-dashoffset for progress circle
  const calculateStrokeDashoffset = (percentage) => {
    const circumference = 2 * Math.PI * 54;
    return circumference - (circumference * percentage) / 100;
  };

  return (
    <div className="dashboard-container">

      <main className="dashboard-content">
        <section className="student-details">
          <div className="student-info">
            <div className="student-avatar">R</div>
            <div className="student-text">
              <h2>Rudrakshi</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Roll Number</span>
                  <span className="info-value">2210990747</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Class</span>
                  <span className="info-value">G12</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Mentor</span>
                  <span className="info-value">Dr. Parneet Kaur</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Batch</span>
                  <span className="info-value">2022-2026</span>
                </div>
              </div>
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
                    strokeDashoffset: calculateStrokeDashoffset(82),
                  }}
                />
              </svg>
              <div className="score-content">
                <span className="score-percentage">82%</span>
                <span className="score-grade">B</span>
              </div>
            </div>
            <p className="grade-description">Overall Performance</p>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="performance-highlights">
            <h3>Key Highlights</h3>
            <div className="highlights-grid">
              <div className="highlight-card best-subject">
                <span className="highlight-icon">🏅</span>
                <span className="highlight-title">Best Subject</span>
                <span className="highlight-value">Data Structures</span>
                <span className="highlight-detail">92/100</span>
              </div>

              <div className="highlight-card needs-improvement">
                <span className="highlight-icon">📈</span>
                <span className="highlight-title">Needs Improvement</span>
                <span className="highlight-value">Full Stack Dev</span>
                <span className="highlight-detail">65/100</span>
              </div>

              <div className="highlight-card attendance">
                <span className="highlight-icon">📅</span>
                <span className="highlight-title">Attendance</span>
                <span className="highlight-value">55%</span>
                <span className="highlight-detail">Needs Attention</span>
              </div>

              <div className="highlight-card overall-rank">
                <span className="highlight-icon">🥇</span>
                <span className="highlight-title">Class Rank</span>
                <span className="highlight-value">#8</span>
                <span className="highlight-detail">Top 15%</span>
              </div>
            </div>
          </section>

          <section className="marks-section">
            <div className="section-header">
              <h3>Subject Performance</h3>
              <div className="section-controls">
                <select className="semester-select">
                  <option>Current Semester</option>
                  <option>Previous Semester</option>
                </select>
              </div>
            </div>

            <div className="subject-cards">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className={`subject-card grade-${subject.grade}`}
                >
                  <div className="subject-icon">{subject.icon}</div>
                  <div className="subject-name">{subject.name}</div>
                  <div className="subject-marks">
                    <div className="marks-bar">
                      <div
                        className={`marks-progress grade-${subject.grade}-bg`}
                        style={{ width: `${subject.marksObtained}%` }}
                      ></div>
                    </div>
                    <div className="marks-text">
                      <span>
                        {subject.marksObtained}/{subject.totalMarks}
                      </span>
                      <span className={`grade-badge grade-${subject.grade}-bg`}>
                        {subject.grade}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="line-graph-section">
            <h3>Performance Trend</h3>
            <div className="line-graph-container">
              <svg className="line-graph" viewBox="0 0 1000 450">
                {/* X Axis */}
                <line
                  x1="50"
                  y1="340"
                  x2="950"
                  y2="340"
                  className="axis-line"
                />
                {subjects.map((subject, index) => (
                  <text
                    key={`x-label-${index}`}
                    x={50 + (index * 900) / subjects.length}
                    y="370"
                    className="axis-label"
                    textAnchor="middle"
                    dy="0.5em"
                  >
                    {subject.icon} {/* Use icon instead of full name */}
                  </text>
                ))}
                {/* Y Axis */}
                <line x1="50" y1="50" x2="50" y2="350" className="axis-line" />
                {[100, 80, 60, 40, 20].map((value, index) => (
                  <React.Fragment key={`y-grid-${index}`}>
                    <line
                      x1="50"
                      y1={350 - value * 3}
                      x2="950"
                      y2={350 - value * 3}
                      className="grid-line"
                    />
                    <text x="20" y={350 - value * 3 + 5} className="axis-label">
                      {value}
                    </text>
                  </React.Fragment>
                ))}
                {/* Area under the line */}
                <path
                  d={`
                    M${50},${350}
                    ${subjects
                      .map(
                        (subject, index) =>
                          `L${50 + (index * 900) / subjects.length},${
                            350 - subject.marksObtained * 3
                          }`
                      )
                      .join(" ")}
                    L${
                      50 + ((subjects.length - 1) * 900) / subjects.length
                    },${350}
                    Z
                  `}
                  className="data-area"
                />
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
                  <g key={`data-point-group-${index}`}>
                    <circle
                      cx={50 + (index * 900) / subjects.length}
                      cy={350 - subject.marksObtained * 3}
                      r="6"
                      className="data-point-glow"
                    />
                    <circle
                      cx={50 + (index * 900) / subjects.length}
                      cy={350 - subject.marksObtained * 3}
                      r="4"
                      className="data-point"
                    />
                    <text
                      x={50 + (index * 900) / subjects.length}
                      y={335 - subject.marksObtained * 3}
                      className="data-label"
                      textAnchor="middle"
                    >
                      {subject.marksObtained}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </section>

          <section className="activities-section">
            <h3>Activities & Conduct</h3>
            <div className="activities-grid">
              {activities.map((activity, index) => (
                <div className="activity-item" key={index}>
                  <div className="activity-header">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-label">{activity.label}</div>
                  </div>
                  <div className="activity-grade-indicator">
                    <div
                      className={`activity-grade grade-${activity.grade.replace(
                        "+",
                        "Plus"
                      )}-bg`}
                    >
                      {activity.grade}
                    </div>
                    <div className="activity-progress-container">
                      <div className="activity-progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${activity.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {activity.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grade-details">
            <h3>Grade Distribution</h3>
            <div className="grade-chart">
              {gradingScale.map((scale, index) => (
                <div className="grade-bar-container" key={index}>
                  <div className="grade-label">{scale.grade}</div>
                  <div className="grade-bar">
                    <div
                      className={`grade-bar-fill grade-${scale.grade.replace(
                        "+",
                        "Plus"
                      )}-bg`}
                      style={{
                        height: `${Math.max(15, Math.random() * 80)}%`,
                        opacity:
                          scale.grade === "A" || scale.grade === "B+" ? 1 : 0.7,
                      }}
                    ></div>
                  </div>
                  <div className="grade-range">{scale.range}</div>
                </div>
              ))}
            </div>
            <div className="grade-legend">
              <div className="legend-item">
                <span className="legend-marker your-grade"></span>
                <span>Your Grades</span>
              </div>
              <div className="legend-item">
                <span className="legend-marker class-average"></span>
                <span>Class Average</span>
              </div>
            </div>
          </section>
        </div>

        <section className="recommendation-section">
          <h3>Recommendations</h3>
          <div className="recommendation-cards">
            <div className="recommendation-card">
              <div className="recommendation-icon">📚</div>
              <div className="recommendation-content">
                <h4>Improve Full Stack Development</h4>
                <p>
                  Consider joining the web development workshop on Saturdays to
                  strengthen your skills.
                </p>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="recommendation-icon">📅</div>
              <div className="recommendation-content">
                <h4>Attendance Alert</h4>
                <p>
                  Your attendance is below the required threshold. Please
                  maintain regular attendance.
                </p>
              </div>
            </div>
            <div className="recommendation-card">
              <div className="recommendation-icon">🚀</div>
              <div className="recommendation-content">
                <h4>Keep up the good work!</h4>
                <p>
                  Your performance in Data Structures is excellent. Consider
                  participating in the coding competition.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
