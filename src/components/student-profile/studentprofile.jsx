import React, { useState } from "react";
import "./studentprofile.css";

const StudentProfileForm = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    groupName: "",
    fatherName: "",
    fatherPhoneNumber: "",
    currentSemester: "",
    batch: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      setProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name.split(".")[1]]: value,
        },
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
    console.log("Profile Submitted:", profile);
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Student Profile</h2>

        <div className="form-section personal-info">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter last name"
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
                placeholder="e.g., +1 (555) 123-4567"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer Not to Say</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section academic-info">
          <h3 className="section-title">Academic Information</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="currentSemester">Current Semester</label>
              <input
                type="text"
                id="currentSemester"
                name="currentSemester"
                value={profile.currentSemester}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Fall 2024"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="batch">Batch</label>
              <input
                type="text"
                id="batch"
                name="batch"
                value={profile.batch}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 2022-2026"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="groupName">Group</label>
              <select
                id="groupName"
                name="groupName"
                value={profile.groupName}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Group</option>
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i} value={`G${i + 1}`}>
                    G{i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section guardian-info">
          <h3 className="section-title">Guardian Information</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="fatherName">Father's Name</label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={profile.fatherName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter father's name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="fatherPhoneNumber">Father's Phone Number</label>
              <input
                type="tel"
                id="fatherPhoneNumber"
                name="fatherPhoneNumber"
                value={profile.fatherPhoneNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., +1 (555) 123-4567"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section address-info">
          <h3 className="section-title">Address Information</h3>
          <div className="form-grid">
            <div className="input-group full-width">
              <label htmlFor="address-street">Street Address</label>
              <input
                type="text"
                id="address-street"
                name="address.street"
                value={profile.address.street}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter street address"
              />
            </div>
            <div className="input-group">
              <label htmlFor="address-city">City</label>
              <input
                type="text"
                id="address-city"
                name="address.city"
                value={profile.address.city}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter city"
              />
            </div>
            <div className="input-group">
              <label htmlFor="address-state">State/Province</label>
              <input
                type="text"
                id="address-state"
                name="address.state"
                value={profile.address.state}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter state/province"
              />
            </div>
            <div className="input-group">
              <label htmlFor="address-zip">Zip/Postal Code</label>
              <input
                type="text"
                id="address-zip"
                name="address.zipCode"
                value={profile.address.zipCode}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter zip/postal code"
              />
            </div>
            <div className="input-group">
              <label htmlFor="address-country">Country</label>
              <input
                type="text"
                id="address-country"
                name="address.country"
                value={profile.address.country}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="reset" className="secondary-button">
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfileForm;