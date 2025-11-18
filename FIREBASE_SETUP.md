# Firebase Setup Guide for Nutri-Check

## Overview
This application uses Firebase for:
- **Authentication**: User login and signup
- **Firestore Database**: Storing patient data and BMI calculations

## Firebase Configuration
The Firebase configuration is already set up in `src/firebase.js` with your project credentials.

## Features Implemented

### 1. Authentication
- **Login/Signup Page** (`/login`): Users can create accounts or sign in
- **Email/Password Authentication**: Traditional email and password login
- **Google Sign-In**: One-click authentication with Google account
- **Protected Routes**: All pages except landing and login require authentication
- **Logout**: Available from Dashboard and BMI Calculator

### 2. Database Structure
Patient records are stored in Firestore with the following structure:

```javascript
{
  name: string,
  age: number,
  gender: string,
  contact: string,
  weight: number,
  height: number,
  bmi: number,
  category: string, // "Underweight", "Normal weight", "Overweight", "Obese"
  userId: string, // Firebase Auth user ID
  timestamp: Date
}
```

## User Flow

1. **Landing Page** (`/`) → Introduction to Nutri-Check
2. **Login/Signup** (`/login`) → User creates account or logs in
   - Email/Password authentication
   - Google Sign-In (one-click)
3. **Dashboard** (`/dashboard`) → Medical professional hub with statistics and quick actions
4. **Patient Info** (`/patient-info`) → Enter patient details (name, age, gender, contact)
5. **BMI Calculator** (`/bmi-calculator`) → Enter weight/height, calculate BMI, save to Firestore
6. **Patient List** (`/patients`) → View all saved patients with their BMI
7. **Patient Details** (`/patients/:id`) → View complete patient information

## Firebase Authentication Setup

### Enable Authentication Methods in Firebase Console:

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password** authentication
3. Enable **Google** authentication
   - Click on Google provider
   - Enable the toggle
   - Add your project support email
   - Save

### Firebase Security Rules (Recommended)

Add these rules to your Firebase Console (Firestore Database → Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patients/{patientId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Running the Application

```bash
npm install
npm run dev
```

## First Time Setup

1. Go to `http://localhost:5173`
2. Click "Start Now" or "Login" from the landing page
3. Choose your sign-in method:
   - **Email/Password**: Click "Sign Up", enter email and password
   - **Google**: Click "Continue with Google" and select your Google account
4. You'll be redirected to the Patient Info page
5. Start adding patient data!

## Authentication Methods

### Email/Password
- Users can create accounts with email and password (minimum 6 characters)
- Toggle between Sign In and Sign Up modes
- Password reset available through Firebase

### Google Sign-In
- One-click authentication with Google account
- No password required
- Automatically creates user account on first sign-in
- Uses Firebase popup authentication

## Notes

- Patient data is associated with the logged-in user via `userId`
- BMI calculations are automatically saved to Firestore
- All routes except login require authentication
- User sessions persist across page refreshes
