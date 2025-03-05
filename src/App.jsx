import React from "react";
import Header from "./components/Header/Header";
import Hero from "./components/Hero-section/Hero";
import Footer from "./components/Footer/Footer";
import StudentDashboard from "./components/dashboard/dashboard";

const App = () => {
  return (
    <div>
      <Header />
      {/* <Hero /> */}
      <StudentDashboard />
      <Footer />
    </div>
  );
};

export default App;
