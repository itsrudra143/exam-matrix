import React, { useState } from "react";
import "./adminprofile.css";

const AdminProfileForm = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    employeeId: "",
    dateHired: "",
    role: "",
    department: {
      name: "",
      head: "",
      location: "",
    },
    accountSettings: {
      password: "",
      confirmPassword: "",
    },
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("department.")) {
      setProfile((prev) => ({
        ...prev,
        department: {
          ...prev.department,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name.startsWith("accountSettings.")) {
      setProfile((prev) => ({
        ...prev,
        accountSettings: {
          ...prev.accountSettings,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (type === "checkbox") {
      setProfile((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Profile Submitted:", profile);
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Admin Profile</h2>

        {/* Main form content */}
        <div className="form-content">
          <div className="form-grid">
            {/* Personal Information */}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="form-input"
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={profile.employeeId}
                onChange={handleChange}
                className="form-input"
                placeholder="EMP-12345"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="dateHired">Date Hired</label>
              <input
                type="date"
                id="dateHired"
                name="dateHired"
                value={profile.dateHired}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={profile.role}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Role</option>
                <option value="super-admin">Super Admin</option>
                <option value="department-head">Department Head</option>
                <option value="staff-manager">Staff Manager</option>
                <option value="it-admin">IT Administrator</option>
              </select>
            </div>

            {/* Department Information */}
            <div className="input-group">
              <label htmlFor="department-name">Department</label>
              <select
                id="department-name"
                name="department.name"
                value={profile.department.name}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Department</option>
                <option value="administration">Administration</option>
                <option value="academic">Academic Affairs</option>
                <option value="it">Information Technology</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="department-head">Department Head</label>
              <input
                type="text"
                id="department-head"
                name="department.head"
                value={profile.department.head}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter department head name"
              />
            </div>

            <div className="input-group">
              <label htmlFor="department-location">Department Location</label>
              <input
                type="text"
                id="department-location"
                name="department.location"
                value={profile.department.location}
                onChange={handleChange}
                className="form-input"
                placeholder="Building/Floor/Room"
              />
            </div>

            {/* Account Settings */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="accountSettings.password"
                value={profile.accountSettings.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="accountSettings.confirmPassword"
                value={profile.accountSettings.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm password"
                required
              />
            </div>

            <div className="input-group checkbox-group">
              <label htmlFor="termsAccepted" className="checkbox-label">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={profile.termsAccepted}
                  onChange={handleChange}
                  className="form-checkbox"
                  required
                />
                <span>I accept the terms and conditions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="reset" className="secondary-button">
            Reset
          </button>
          <button type="submit" className="primary-button">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfileForm;
