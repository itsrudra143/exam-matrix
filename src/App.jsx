import React from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero-section/Hero";
import Footer from "./components/Footer/Footer";
import StudentDashboard from "./components/dashboard/dashboard";
import AdminDashboard from "./components/admin-dashboard/admindashboard";
import StudentProfileForm from "./components/student-profile/studentprofile";
import AdminProfileForm from "./components/admin-profile/adminprofile";
import ExamMatrix from "./components/overview-students/overviewstudents";

const App = () => {
  return (
    <div>
      <Header />
      {/* <Hero /> */}
      {/* <StudentDashboard /> */}
      {/* <AdminDashboard /> */}
      {/* <StudentProfileForm /> */}
      {/* <AdminProfileForm /> */}
      <ExamMatrix />
      <Footer />
    </div>
  );
};

export default App;
