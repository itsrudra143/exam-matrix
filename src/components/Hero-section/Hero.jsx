import React from "react";
import "./Hero.css";
import HeroImage from "../../assets/images/Hero-img.jpg";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Your All-in-One Exam Platform</h1>
        <p>
          Take practice exams, get instant scores, and track your progress with
          our intuitive dashboard
        </p>

        <div className="feature-highlights">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Practice Exams</h3>
            <p>Access hundreds of practice questions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Instant Results</h3>
            <p>Get immediate feedback on your performance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement over time</p>
          </div>
        </div>

        <button className="hero-button">Get Started</button>
      </div>
      <div className="hero-image">
        <img src={HeroImage} alt="Exam Dashboard" />
      </div>
    </div>
  );
};

export default HeroSection;
