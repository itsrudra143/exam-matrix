import React, { useState } from "react";
import "./AdminDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const chartData = [
    { group: "G1", passed: 10, failed: 2 },
    { group: "G2", passed: 8, failed: 4 },
    { group: "G3", passed: 12, failed: 1 },
    { group: "G4", passed: 9, failed: 3 },
    { group: "G5", passed: 11, failed: 2 },
    { group: "G6", passed: 7, failed: 5 },
    { group: "G7", passed: 10, failed: 3 },
    { group: "G8", passed: 8, failed: 4 },
    { group: "G9", passed: 13, failed: 1 },
    { group: "G10", passed: 9, failed: 3 },
    { group: "G11", passed: 11, failed: 2 },
    { group: "G12", passed: 7, failed: 5 },
  ];

  const studentsData = [
    {
      id: 1,
      name: "Aryan Sharma",
      rollNo: "2210990701",
      group: "G1",
      marks: 98,
      total: 100,
    },
    {
      id: 2,
      name: "Priya Verma",
      rollNo: "2210990702",
      group: "G1",
      marks: 95,
      total: 100,
    },
    {
      id: 3,
      name: "Rohan Gupta",
      rollNo: "2210990703",
      group: "G2",
      marks: 92,
      total: 100,
    },
    {
      id: 4,
      name: "Simran Kaur",
      rollNo: "2210990704",
      group: "G2",
      marks: 96,
      total: 100,
    },
    {
      id: 5,
      name: "Vikram Singh",
      rollNo: "2210990705",
      group: "G3",
      marks: 89,
      total: 100,
    },
    {
      id: 6,
      name: "Neha Patel",
      rollNo: "2210990706",
      group: "G3",
      marks: 97,
      total: 100,
    },
    {
      id: 7,
      name: "Amit Kumar",
      rollNo: "2210990707",
      group: "G4",
      marks: 88,
      total: 100,
    },
    {
      id: 8,
      name: "Shreya Das",
      rollNo: "2210990708",
      group: "G4",
      marks: 91,
      total: 100,
    },
    {
      id: 9,
      name: "Kunal Mehta",
      rollNo: "2210990709",
      group: "G5",
      marks: 93,
      total: 100,
    },
    {
      id: 10,
      name: "Ananya Rao",
      rollNo: "2210990710",
      group: "G5",
      marks: 90,
      total: 100,
    },
    {
      id: 11,
      name: "Rahul Yadav",
      rollNo: "2210990711",
      group: "G6",
      marks: 85,
      total: 100,
    },
    {
      id: 12,
      name: "Megha Kapoor",
      rollNo: "2210990712",
      group: "G6",
      marks: 94,
      total: 100,
    },
    {
      id: 13,
      name: "Arjun Nair",
      rollNo: "2210990713",
      group: "G7",
      marks: 87,
      total: 100,
    },
    {
      id: 14,
      name: "Riya Bansal",
      rollNo: "2210990714",
      group: "G7",
      marks: 99,
      total: 100,
    },
    {
      id: 15,
      name: "Siddharth Joshi",
      rollNo: "2210990715",
      group: "G8",
      marks: 82,
      total: 100,
    },
    {
      id: 16,
      name: "Pooja Mishra",
      rollNo: "2210990716",
      group: "G8",
      marks: 86,
      total: 100,
    },
    {
      id: 17,
      name: "Tarun Malhotra",
      rollNo: "2210990717",
      group: "G9",
      marks: 80,
      total: 100,
    },
    {
      id: 18,
      name: "Swati Aggarwal",
      rollNo: "2210990718",
      group: "G9",
      marks: 83,
      total: 100,
    },
    {
      id: 19,
      name: "Manish Choudhary",
      rollNo: "2210990719",
      group: "G10",
      marks: 84,
      total: 100,
    },
    {
      id: 20,
      name: "Sneha Reddy",
      rollNo: "2210990720",
      group: "G10",
      marks: 81,
      total: 100,
    },
    {
      id: 21,
      name: "Rudrakshi",
      rollNo: "2210990747",
      group: "G12",
      marks: 98,
      total: 100,
    },
    {
      id: 22,
      name: "Mayra",
      rollNo: "2210990982",
      group: "G2",
      marks: 96.5,
      total: 100,
    },
    {
      id: 23,
      name: "Harry",
      rollNo: "2210990103",
      group: "G8",
      marks: 95,
      total: 100,
    },
  ];

  const topPerformers = studentsData
    .sort((a, b) => b.marks - a.marks)
    .slice(0, 3)
    .map((student, index) => ({
      rank: index + 1,
      name: student.name,
      rollNo: student.rollNo,
      group: student.group,
      score: `${student.marks}%`,
    }));

  const filteredStudents = studentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      student.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradeColor = (marks) => {
    if (marks >= 90) return "#4CAF50";
    if (marks >= 80) return "#2196F3";
    if (marks >= 70) return "#FF9800";
    if (marks >= 60) return "#FFC107";
    return "#F44336";
  };

  const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#FFC107", "#F44336"];

  return (
    <div className="dashboard-container">
      {/* Top Greeting Section - Moved above sidebar */}
      <div className="top-greeting">
        <div className="greeting-container">
          <h1 className="greeting">Welcome back, Dr. Parneet Kaur</h1>
          <p className="quote">
            "Education is the passport to the future, for tomorrow belongs to
            those who prepare for it today."
          </p>
        </div>
        <div className="header-content">
          <div className="date-display">
            22 March 2024 | Exam Programming Setup
          </div>
          <div className="header-right">
            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search student, roll no, group..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="notification-bell">
              <span>🔔</span>
              <div className="notification-badge">3</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Sidebar - Now positioned below greeting */}
        <div className="sidebar">
          <div className="logo-container">
            <h3>Exam Matrix</h3>
          </div>
          <div className="nav-links">
            <button
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="nav-icon">📊</span>
              Overview
            </button>
            <button
              className={`nav-link ${activeTab === "results" ? "active" : ""}`}
              onClick={() => setActiveTab("results")}
            >
              <span className="nav-icon">📝</span>
              Student Results
            </button>
            <button
              className={`nav-link ${
                activeTab === "analytics" ? "active" : ""
              }`}
              onClick={() => setActiveTab("analytics")}
            >
              <span className="nav-icon">📈</span>
              Analytics
            </button>
            <button
              className={`nav-link ${activeTab === "top" ? "active" : ""}`}
              onClick={() => setActiveTab("top")}
            >
              <span className="nav-icon">🏆</span>
              Top Performers
            </button>
          </div>
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-details">
                <p className="user-name">Dr. Parneet Kaur</p>
                <p className="user-role">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Positioned after sidebar */}
        <div className="main-content">
          <main className="dashboard-main">
            {activeTab === "overview" && (
              <div className="overview-content">
                <div className="subject-info">
                  <div className="subject-card">
                    <div className="subject-details">
                      <div className="subject-icon">📚</div>
                      <div className="subject-text">
                        <p>Exam: Java Programming</p>
                        <p>Total Marks: 100</p>
                        <p>Date: 1st March 2025</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chart-container full-width">
                  <h2>📊 Group Performance Analysis</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="group" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="passed"
                        fill="#4CAF50"
                        name="Passed"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="failed"
                        fill="#FF5252"
                        name="Failed"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="stats-container">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="icon">✅</div>
                      <div className="content">
                        <h3>Students Passed</h3>
                        <p className="stats-number">108</p>
                        <p className="trend positive">86.4% pass rate</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="icon">❌</div>
                      <div className="content">
                        <h3>Students Failed</h3>
                        <p className="stats-number">17</p>
                        <p className="trend negative">13.6% fail rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "top" && (
              <div className="top-performers">
                <h2>🏆 Top Performers</h2>
                <div className="performer-cards">
                  {topPerformers.map(({ rank, name, rollNo, group, score }) => (
                    <div className="performer-card" key={rank}>
                      <div className="card-content">
                        <div className="rank-emoji">
                          {rank === 1 && "🥇"}
                          {rank === 2 && "🥈"}
                          {rank === 3 && "🥉"}
                        </div>
                        <div className="performer-info">
                          <h3>{name}</h3>
                          <p className="roll-no">Roll No: {rollNo}</p>
                          <p className="group">Group: {group}</p>
                          <div className="score-badge">{score}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="performance-insights">
                  <h3>Performance Insights</h3>
                  <div className="insights-grid">
                    <div className="insight-card">
                      <div className="insight-icon">🚀</div>
                      <div className="insight-content">
                        <h4>Highest Improvement</h4>
                        <p>Riya Bansal improved by 15% compared to last exam</p>
                      </div>
                    </div>
                    <div className="insight-card">
                      <div className="insight-icon">📊</div>
                      <div className="insight-content">
                        <h4>Group Performance</h4>
                        <p>Group G3 has the highest average score of 93%</p>
                      </div>
                    </div>
                    <div className="insight-card">
                      <div className="insight-icon">⚡</div>
                      <div className="insight-content">
                        <h4>Quick Completion</h4>
                        <p>Top performers completed exam 35% faster</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "results" && (
              <div className="all-results">
                <h2>📝 All Students Results</h2>

                <div className="filter-controls">
                  <div className="filter-dropdown">
                    <select className="filter-select">
                      <option value="all">All Groups</option>
                      <option value="G1">G1</option>
                      <option value="G2">G2</option>
                      <option value="G3">G3</option>
                    </select>
                  </div>
                  <div className="filter-dropdown">
                    <select className="filter-select">
                      <option value="all">All Grades</option>
                      <option value="A">A Grade (90-100)</option>
                      <option value="B">B Grade (80-89)</option>
                      <option value="C">C Grade (70-79)</option>
                    </select>
                  </div>
                  <div className="filter-dropdown">
                    <select className="filter-select">
                      <option value="marks">Sort by Marks</option>
                      <option value="name">Sort by Name</option>
                      <option value="group">Sort by Group</option>
                    </select>
                  </div>
                </div>

                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Sno.</th>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Group</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>{student.name}</td>
                          <td>{student.rollNo}</td>
                          <td>{student.group}</td>
                          <td>
                            <div className="marks-container">
                              <div
                                className="marks-bar"
                                style={{
                                  width: `${student.marks}%`,
                                  backgroundColor: getGradeColor(student.marks),
                                }}
                              ></div>
                              <span>
                                {student.marks}/{student.total}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              className="grade-badge"
                              style={{
                                backgroundColor: getGradeColor(student.marks),
                              }}
                            >
                              {student.marks >= 90
                                ? "A"
                                : student.marks >= 80
                                ? "B"
                                : student.marks >= 70
                                ? "C"
                                : student.marks >= 60
                                ? "D"
                                : "F"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                student.marks >= 40 ? "passed" : "failed"
                              }`}
                            >
                              {student.marks >= 40 ? "PASSED" : "FAILED"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pagination">
                  <button className="pagination-button active">1</button>
                  <button className="pagination-button">2</button>
                  <button className="pagination-button">3</button>
                  <button className="pagination-button">...</button>
                  <button className="pagination-button">7</button>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="analytics-section">
                <h2>📈 Advanced Analytics</h2>

                <div className="analytics-cards">
                  <div className="analytics-card">
                    <h3>Performance by Topic</h3>
                    <p className="analytics-insight">
                      Students scored highest in OOP concepts (92% avg)
                    </p>
                    <p className="analytics-insight negative">
                      Lowest scores in Exception Handling (68% avg)
                    </p>
                  </div>
                  <div className="analytics-card">
                    <h3>Time Analysis</h3>
                    <p className="analytics-insight">
                      Average completion time: 1h 42m
                    </p>
                    <p className="analytics-insight">
                      Most time spent on: Advanced Java Questions
                    </p>
                  </div>
                  <div className="analytics-card">
                    <h3>Comparison to Previous</h3>
                    <p className="analytics-insight positive">
                      Overall improvement: 8.5%
                    </p>
                    <p className="analytics-insight">
                      Top improved group: G7 (+12.3%)
                    </p>
                  </div>
                </div>

                <div className="chart-container">
                  <h3>Question Difficulty Analysis</h3>
                  <div className="difficulty-bars">
                    <div className="difficulty-bar-container">
                      <div className="difficulty-label">Q1 - Variables</div>
                      <div className="difficulty-track">
                        <div
                          className="difficulty-fill easy"
                          style={{ width: "15%" }}
                        ></div>
                      </div>
                      <div className="difficulty-value">Easy (15%)</div>
                    </div>
                    <div className="difficulty-bar-container">
                      <div className="difficulty-label">Q2 - Methods</div>
                      <div className="difficulty-track">
                        <div
                          className="difficulty-fill easy"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                      <div className="difficulty-value">Easy (25%)</div>
                    </div>
                    <div className="difficulty-bar-container">
                      <div className="difficulty-label">Q3 - Classes</div>
                      <div className="difficulty-track">
                        <div
                          className="difficulty-fill medium"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                      <div className="difficulty-value">Medium (45%)</div>
                    </div>
                    <div className="difficulty-bar-container">
                      <div className="difficulty-label">Q4 - Inheritance</div>
                      <div className="difficulty-track">
                        <div
                          className="difficulty-fill medium"
                          style={{ width: "52%" }}
                        ></div>
                      </div>
                      <div className="difficulty-value">Medium (52%)</div>
                    </div>
                    <div className="difficulty-bar-container">
                      <div className="difficulty-label">Q5 - Polymorphism</div>
                      <div className="difficulty-track">
                        <div
                          className="difficulty-fill hard"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                      <div className="difficulty-value">Hard (68%)</div>
                    </div>
                    <div className="difficulty-bar-container">
                      <div className="difficulty-label">Q6 - Interfaces</div>
                      <div className="difficulty-track">
                        <div
                          className="difficulty-fill hard"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                      <div className="difficulty-value">Hard (72%)</div>
                    </div>
                    <div className="difficulty-bar-container">
                      <div className="difficulty-label">
                        Q7 - Exception Handling
                      </div>
                      <div className="difficulty-track">
                        <div
                          className="difficulty-fill very-hard"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                      <div className="difficulty-value">Very Hard (85%)</div>
                    </div>
                  </div>
                </div>

                <div className="recommendation-section">
                  <h3>Recommendations</h3>
                  <div className="recommendation-cards">
                    <div className="recommendation-card">
                      <div className="recommendation-icon">📚</div>
                      <div className="recommendation-content">
                        <h4>Review Exception Handling</h4>
                        <p>
                          Consider additional workshops or material on exception
                          handling concepts
                        </p>
                      </div>
                    </div>
                    <div className="recommendation-card">
                      <div className="recommendation-icon">👥</div>
                      <div className="recommendation-content">
                        <h4>Group Study</h4>
                        <p>
                          Pair low-performing students with high-performers for
                          peer learning
                        </p>
                      </div>
                    </div>
                    <div className="recommendation-card">
                      <div className="recommendation-icon">🎯</div>
                      <div className="recommendation-content">
                        <h4>Practice Tests</h4>
                        <p>
                          Introduce more practice tests focused on difficult
                          topics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
