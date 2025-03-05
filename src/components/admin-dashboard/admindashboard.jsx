import React from "react";
import "./admindashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AdminDashboard = () => {
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="greeting">Good Morning, Dr Parneet Kaur</h1>
          <p className="quote">
            "Education is the passport to the future, for tomorrow belongs to
            those who prepare for it today."
          </p>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search exam..."
              className="search-input"
            />
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="subject-info">
          <div className="subject-card">
            <div className="subject-details">
              <p>Exam: Java Programming</p>
              <p>Total Marks: 100</p>
              <p>Date: 1st March 2025</p>
            </div>
          </div>
        </div>

        

        <div className="stats-grid">
          <div className="stats-card">
            <h3>📊 Total Students</h3>
            <p className="stats-number">125</p>
          </div>
          <div className="stats-card">
            <h3>🌟 Average Score</h3>
            <p className="stats-number">72%</p>
          </div>
          <div className="stats-card">
            <h3>✅ Students Passed</h3>
            <p className="stats-number">108</p>
          </div>
          <div className="stats-card">
            <h3>❌ Students Failed</h3>
            <p className="stats-number">17</p>
          </div>
        </div>

        <div className="chart-container">
          <h2>📊 Group Performance Analysis</h2>
          <BarChart
            width={1200}
            height={400}
            data={chartData}
            margin={{
              top: 20,
              right: 50,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="group" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" fill="#4CAF50" name="Passed" />
            <Bar dataKey="failed" fill="#FF5252" name="Failed" />
          </BarChart>
        </div>

        <div className="top-performers">
          <h2>🏆 Top 3 Performers</h2>
          <div className="performer-cards">
            {[
              {
                rank: 1,
                name: "Rudrakshi",
                rollNo: "2210990747",
                group: "G12",
                score: "98%",
              },
              {
                rank: 2,
                name: "Mayra",
                rollNo: "2210990982",
                group: "G2",
                score: "96.5%",
              },
              {
                rank: 3,
                name: "Harry",
                rollNo: "2210990103",
                group: "G8",
                score: "95%",
              },
            ].map(({ rank, name, rollNo, group, score }) => (
              <div className="performer-card" key={rank}>
                <div className="card-content">
                  <div className="rank-emoji">
                    {rank === 1 && "🥇"}
                    {rank === 2 && "🥈"}
                    {rank === 3 && "🥉"}
                  </div>
                  <p>Name: {name}</p>
                  <p>Roll No: {rollNo}</p>
                  <p>Group: {group}</p>
                  <p>Score: {score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="all-results">
          <h2>📝 All Students Results</h2>
          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Sno.</th>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Group</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Aryan Sharma</td>
                  <td>2210990701</td>
                  <td>G1</td>
                  <td>98</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Priya Verma</td>
                  <td>2210990702</td>
                  <td>G1</td>
                  <td>95</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Rohan Gupta</td>
                  <td>2210990703</td>
                  <td>G2</td>
                  <td>92</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Simran Kaur</td>
                  <td>2210990704</td>
                  <td>G2</td>
                  <td>96</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Vikram Singh</td>
                  <td>2210990705</td>
                  <td>G3</td>
                  <td>89</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Neha Patel</td>
                  <td>2210990706</td>
                  <td>G3</td>
                  <td>97</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>Amit Kumar</td>
                  <td>2210990707</td>
                  <td>G4</td>
                  <td>88</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>Shreya Das</td>
                  <td>2210990708</td>
                  <td>G4</td>
                  <td>91</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>Kunal Mehta</td>
                  <td>2210990709</td>
                  <td>G5</td>
                  <td>93</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>Ananya Rao</td>
                  <td>2210990710</td>
                  <td>G5</td>
                  <td>90</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>Rahul Yadav</td>
                  <td>2210990711</td>
                  <td>G6</td>
                  <td>85</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>Megha Kapoor</td>
                  <td>2210990712</td>
                  <td>G6</td>
                  <td>94</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>Arjun Nair</td>
                  <td>2210990713</td>
                  <td>G7</td>
                  <td>87</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>Riya Bansal</td>
                  <td>2210990714</td>
                  <td>G7</td>
                  <td>99</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>Siddharth Joshi</td>
                  <td>2210990715</td>
                  <td>G8</td>
                  <td>82</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>Pooja Mishra</td>
                  <td>2210990716</td>
                  <td>G8</td>
                  <td>86</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>17</td>
                  <td>Tarun Malhotra</td>
                  <td>2210990717</td>
                  <td>G9</td>
                  <td>80</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>18</td>
                  <td>Swati Aggarwal</td>
                  <td>2210990718</td>
                  <td>G9</td>
                  <td>83</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>19</td>
                  <td>Manish Choudhary</td>
                  <td>2210990719</td>
                  <td>G10</td>
                  <td>84</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>Sneha Reddy</td>
                  <td>2210990720</td>
                  <td>G10</td>
                  <td>81</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
