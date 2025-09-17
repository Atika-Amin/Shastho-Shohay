import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Landingpage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import PatientRegister from "./PatientRegister";
import DoctorRegister from "./DoctorRegister";
import HospitalRegister from "./HospitalRegister";
import PharmacyRegister from "./PharmacyRegister";
import PatientDashboard from "./dashborad/PatientDashboard";
import PatientProfile from "./pages/PatientProfile.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/patientRegister" element={<PatientRegister />} />
        <Route path="/doctorRegister" element={<DoctorRegister />} />
        <Route path="/hospitalRegister" element={<HospitalRegister />} />
        <Route path="/pharmacyRegister" element={<PharmacyRegister />} />
        <Route path="/PatientDashboard" element={<PatientDashboard />} />
        <Route path="/patientprofile" element={<PatientProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
