# Patient System Setup

## Installation Required

You need to install bcryptjs for password hashing:

```bash
npm install bcryptjs
```

## System Architecture

### Two Separate Systems:

#### 1. Medical Professional System (Firebase Authentication)
- Login: `/login`
- Dashboard: `/dashboard` (DashboardPage.vue)
- Accounts created by admin in Firebase Console
- Full access to all patient records

#### 2. Patient System (Firestore Database)
- Login: `/patient-login`
- Dashboard: `/patient-dashboard`
- Patients can self-register
- Each patient sees only their own data

## Data Structure

### Patient Accounts (Firestore Collection: `patientAccounts`)
```javascript
{
  email: "patient@example.com",
  password: "hashedPassword",  // bcrypt hashed
  name: "John Doe",
  age: 35,
  gender: "Male",
  createdAt: timestamp,
  lastLogin: timestamp
}
```

### Patient BMI Records (Firestore Collection: `patientBMIRecords`)
```javascript
{
  patientId: "documentId",  // Reference to patientAccounts
  weight: 75,
  height: 175,
  bmi: 24.5,
  category: "Normal weight",
  timestamp: timestamp
}
```

## Security

### Password Hashing
- Uses bcryptjs with salt rounds of 10
- Passwords never stored in plain text
- Secure comparison for login

### Session Management
- Patient ID stored in sessionStorage
- Cleared on logout
- Checked on protected routes

## Next Steps

1. Install bcryptjs: `npm install bcryptjs`
2. Create Patient Dashboard
3. Update Router with patient routes
4. Add route guards for patient pages
5. Update landing page with patient login option
