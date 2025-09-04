# 🏥 ShasthyoShohay --- AI-powered Healthcare Support System

A web-based AI healthcare assistant where patients, doctors, hospitals,
and pharmacies can connect.\
The goal is to provide **symptom analysis, doctor search, emergency
support, prescription management, and hospital/pharmacy services** in
one place.

------------------------------------------------------------------------

## 🚀 Features

### 👤 Patient Dashboard

-   AI Symptom Checker (Chatbot + Analysis)\
-   Doctor search (Search + Map view)\
-   Upload prescriptions & compare medicine prices\
-   Daily medicine reminders\
-   Manage medical records\
-   Personalized health tips & recent activity

### 👨‍⚕️ Doctor Dashboard

-   Today's appointment list\
-   Live emergency case support (Video Call)\
-   Access to patient reports/prescriptions\
-   Create & manage prescriptions\
-   Analytics: Patient count, follow-up cases

### 🏥 Hospital Dashboard

-   Hospital overview (Doctors, Patients, Beds)\
-   Live emergency case monitoring\
-   Patient admissions & bed management\
-   Doctor schedules & availability\
-   Pharmacy & prescription integration\
-   Reports & analytics (patient inflow, emergency response time, etc.)

### 💊 Pharmacy Module

-   Detect medicines from uploaded prescription\
-   Price comparison between brands\
-   Alternative brand suggestions\
-   Nearest pharmacy location

### 🚨 Emergency Support

-   Heart attack/stroke → First-aid guidance, CPR video simulation\
-   Accident → Nearby hospitals with bed/ICU availability\
-   Ambulance notifications & live tracking\
-   On-call doctor video/audio connect

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend:** React.js, Tailwind CSS\
-   **Routing:** React Router\
-   **Backend (Future):** Node.js + Express.js\
-   **Database (Future):** MongoDB / Firebase\
-   **AI & Chatbot:** Custom AI service (symptom checker, prescription
    analysis)\
-   **Map Integration:** Google Maps API\
-   **Video Call:** WebRTC / 3rd party API (e.g., Twilio)

------------------------------------------------------------------------

## 📂 Project Structure

    healthcare-ai/
    │── public/
    │   └── images/          # Logos, assets
    │── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # LandingPage, PatientDashboard, DoctorDashboard, HospitalDashboard
    │   ├── chatbot/         # AI Suggestion Chat UI
    │   ├── App.js
    │   └── index.js
    │── package.json
    │── tailwind.config.js
    │── README.md

------------------------------------------------------------------------

## ▶️ Run Locally

``` bash
# Clone the repository
git clone https://github.com/username/healthcare-ai.git

# Go to project folder
cd healthcare-ai

# Install dependencies
npm install

# Run local dev server
npm start
```

The app will run here 👉 <http://localhost:3000>

------------------------------------------------------------------------

## 📸 UI Preview (Examples)

-   Landing Page (Hero + Features)\
-   Patient Dashboard (AI Symptom Checker, Emergency, Prescriptions)\
-   Doctor Dashboard (Appointments, Emergency cases, Records)\
-   Hospital Dashboard (Doctors, Patients, Beds, Pharmacy, Reports)\
-   AI Chatbot UI (Symptom Analysis + Emergency Support)

------------------------------------------------------------------------

## 🔮 Future Updates

-   ✅ Multi-language support (Bangla + English)\
-   ✅ Full AI integration with real medical datasets\
-   ✅ Secure Authentication (JWT / OAuth)\
-   ✅ Push Notifications for reminders\
-   ✅ Mobile App (React Native)

------------------------------------------------------------------------

## 📄 License

This project is created for **educational purposes only**.\
**Disclaimer:** This is *not* medical advice. Always consult a licensed
doctor.
