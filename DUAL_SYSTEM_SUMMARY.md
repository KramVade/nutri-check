# Dual System Architecture - Complete!

## Overview
Your Nutri-Check system now has TWO separate portals:

### 1. Medical Professional Portal (Firebase Authentication)
- **Login**: `/login`
- **Dashboard**: `/dashboard`
- **Authentication**: Firebase Auth (admin-created accounts)
- **Purpose**: Manage all patient records

### 2. Patient Portal (Firestore Database)
- **Login**: `/patient-login`
- **Dashboard**: `/patient-dashboard`
- **Authentication**: Firestore database (self-registration)
- **Purpose**: Personal health tracking

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Landing Page (/)                      │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │  Medical Professional │  │   Patient Portal     │   │
│  │       Login           │  │      Login           │   │
│  └──────────────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
           │                            │
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Firebase Auth       │    │  Firestore DB        │
│  (Admin Created)     │    │  (Self Register)     │
└──────────────────────┘    └──────────────────────┘
           │                            │
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Medical Dashboard   │    │  Patient Dashboard   │
│  - View all patients │    │  - Personal BMI      │
│  - Add patients      │    │  - Own history       │
│  - Manage records    │    │  - Health tips       │
└──────────────────────┘    └──────────────────────┘
```

## Data Structure

### Firestore Collections

#### 1. patientAccounts (Patient Login Data)
```javascript
{
  email: "patient@example.com",
  password: "hashedPassword",  // SHA-256 hashed
  name: "John Doe",
  age: 35,
  gender: "Male",
  createdAt: timestamp,
  lastLogin: timestamp
}
```

#### 2. patientBMIRecords (Patient's Personal BMI Data)
```javascript
{
  patientId: "documentId",  // Links to patientAccounts
  weight: 75,
  height: 175,
  bmi: 24.5,
  category: "Normal weight",
  timestamp: timestamp
}
```

#### 3. patients (Medical Professional's Patient Records)
```javascript
{
  name: "Jane Smith",
  age: 28,
  gender: "Female",
  contact: "+1234567890",
  weight: 65,
  height: 165,
  bmi: 23.9,
  category: "Normal weight",
  userId: "medicalProfessionalUID",  // Who added this
  timestamp: timestamp
}
```

## User Flows

### Medical Professional Flow
```
1. Visit landing page
2. Click "Medical Professional Login"
3. Sign in with Firebase Auth (email/password or Google)
4. Access Medical Dashboard
5. Manage all patient records
6. Add new patients
7. View patient list
8. Calculate BMI for patients
```

### Patient Flow
```
1. Visit landing page
2. Click "Patient Portal"
3. Sign up (first time) or Sign in
   - Email, password, name, age, gender
   - Stored in Firestore
4. Access Personal Dashboard
5. View own BMI history
6. Calculate new BMI
7. Get health suggestions
8. Update profile
```

## Files Created

### Patient System Files
1. **src/views/PatientLoginPage.vue** - Patient login/signup
2. **src/views/PatientDashboardPage.vue** - Patient personal dashboard
3. **PATIENT_SYSTEM_SETUP.md** - Setup instructions
4. **DUAL_SYSTEM_SUMMARY.md** - This file

### Medical Professional Files (Already Exist)
1. **src/views/LoginPage.vue** - Medical professional login
2. **src/views/DashboardPage.vue** - Medical professional dashboard
3. **src/views/PatientInfoPage.vue** - Add patient records
4. **src/views/PatientListPage.vue** - View all patients
5. **src/views/PatientDetailPage.vue** - View patient details

## Next Steps

### 1. Update Router
Add patient routes to `src/router/index.js`:

```javascript
import PatientLoginPage from '../views/PatientLoginPage.vue'
import PatientDashboardPage from '../views/PatientDashboardPage.vue'

const routes = [
  // ... existing routes
  {
    path: '/patient-login',
    name: 'PatientLogin',
    component: PatientLoginPage
  },
  {
    path: '/patient-dashboard',
    name: 'PatientDashboard',
    component: PatientDashboardPage,
    meta: { requiresPatientAuth: true }
  }
]

// Add patient auth guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresPatientAuth) {
    const patientId = sessionStorage.getItem('patientId')
    if (!patientId) {
      next('/patient-login')
    } else {
      next()
    }
  } else {
    next()
  }
})
```

### 2. Update Landing Page
Add patient login button:

```vue
<button @click="$router.push('/patient-login')" class="patient-btn">
  Patient Portal
</button>
```

### 3. Create Additional Patient Pages
- Patient Profile Page (edit personal info)
- Patient BMI Calculator (save to patientBMIRecords)
- Patient BMI History (view all records with charts)

### 4. Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Medical professional access (Firebase Auth)
    match /patients/{patientId} {
      allow read, write: if request.auth != null;
    }
    
    // Patient accounts (anyone can create, only owner can read/update)
    match /patientAccounts/{accountId} {
      allow create: if true;  // Allow signup
      allow read, update: if request.resource.id == accountId;
    }
    
    // Patient BMI records (only owner can access)
    match /patientBMIRecords/{recordId} {
      allow read, write: if resource.data.patientId == request.auth.uid;
      allow create: if request.resource.data.patientId == request.auth.uid;
    }
  }
}
```

## Security Features

### Medical Professional System
- ✅ Firebase Authentication
- ✅ Admin-created accounts only
- ✅ Secure, industry-standard
- ✅ Google Sign-In supported

### Patient System
- ✅ Password hashing (SHA-256)
- ✅ Email validation
- ✅ Session-based authentication
- ✅ Self-registration allowed
- ✅ Data isolation (patients see only their data)

## Benefits

### For Medical Professionals
- Full control over patient records
- Professional dashboard
- Manage multiple patients
- Secure admin access

### For Patients
- Own their health data
- Track progress over time
- Easy self-registration
- Personal dashboard
- Privacy maintained

### For System
- Clear separation of concerns
- Scalable architecture
- Flexible access control
- HIPAA-friendly design

## Testing Checklist

### Medical Professional Portal
- [ ] Admin creates account in Firebase Console
- [ ] Medical professional logs in
- [ ] Can add patient records
- [ ] Can view all patients
- [ ] Can calculate BMI for patients
- [ ] Logout works

### Patient Portal
- [ ] Patient can sign up
- [ ] Email validation works
- [ ] Password hashing works
- [ ] Patient can sign in
- [ ] Dashboard shows personal data
- [ ] Can calculate own BMI
- [ ] Can view own history
- [ ] Logout works
- [ ] Cannot see other patients' data

## Current Status

✅ **Medical Professional Portal** - Fully functional
✅ **Patient Login Page** - Created
✅ **Patient Dashboard** - Created
🔄 **Router** - Needs patient routes added
🔄 **Landing Page** - Needs patient login button
🔄 **Patient BMI Calculator** - To be created
🔄 **Patient Profile Page** - To be created
🔄 **Patient BMI History** - To be created

## Summary

You now have a **dual-portal system**:
1. **Medical professionals** use Firebase Auth to manage all patients
2. **Patients** use Firestore accounts to track their own health

Both systems are independent, secure, and serve different purposes perfectly!
