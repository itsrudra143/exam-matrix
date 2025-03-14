import React from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero-section/Hero";
import Footer from "./components/Footer/Footer";
import StudentDashboard from "./components/dashboard/dashboard";
import AdminDashboard from "./components/admin-dashboard/admindashboard";
import StudentProfileForm from "./components/student-profile/studentprofile";
import AdminProfileForm from "./components/admin-profile/adminprofile";
import StudentTest from "./components/student-test/StudentTest";

const App = () => {
  return (
    <div>
      <Header />
      <Hero />
      {/* <StudentDashboard /> */}
      {/* <AdminDashboard /> */}
      {/* <StudentProfileForm /> */}
      {/* <AdminProfileForm /> */}
      {/* <StudentTest /> */}
      <Footer />
    </div>
  );
};

export default App;
