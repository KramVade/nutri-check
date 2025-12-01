# Administrator Guide - Creating Medical Professional Accounts

## Overview
Only system administrators can create medical professional accounts. Users cannot self-register.

## Methods to Create Accounts

### Method 1: Firebase Console (Recommended)

#### Step-by-Step:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `nutri-check-84aa3`

2. **Navigate to Authentication**
   - Click "Authentication" in the left sidebar
   - Click "Users" tab

3. **Add New User**
   - Click "Add User" button
   - Enter email address (e.g., `doctor@hospital.com`)
   - Enter temporary password (minimum 6 characters)
   - Click "Add User"

4. **Notify the User**
   - Send the email and temporary password to the medical professional
   - Instruct them to:
     - Visit: `your-app-url/login`
     - Sign in with provided credentials
     - Change password after first login (optional feature)

#### Example:
```
Email: dr.smith@clinic.com
Password: TempPass123!
```

---

### Method 2: Google Sign-In (If Enabled)

#### Requirements:
- User must have a Google account
- Google Sign-In must be enabled in Firebase

#### Process:
1. User clicks "Continue with Google" on login page
2. Selects their Google account
3. **First-time users**: Account is automatically created
4. **Existing users**: Signed in immediately

#### Note:
If you want to restrict Google Sign-In to specific domains:
1. Go to Firebase Console → Authentication → Sign-in method
2. Click on Google provider
3. Add authorized domains under "Authorized domains"

---

### Method 3: Firebase Admin SDK (Advanced)

For bulk user creation or automated processes:

#### Setup:
```javascript
// server-side code (Node.js)
const admin = require('firebase-admin');

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});
```

#### Create Single User:
```javascript
async function createMedicalProfessional(email, password, displayName) {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: false
    });
    
    console.log('Successfully created user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Usage
createMedicalProfessional(
  'doctor@hospital.com',
  'SecurePassword123!',
  'Dr. John Smith'
);
```

#### Create Multiple Users:
```javascript
async function createMultipleUsers(users) {
  const results = [];
  
  for (const user of users) {
    try {
      const userRecord = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        displayName: user.name
      });
      
      results.push({
        success: true,
        email: user.email,
        uid: userRecord.uid
      });
    } catch (error) {
      results.push({
        success: false,
        email: user.email,
        error: error.message
      });
    }
  }
  
  return results;
}

// Usage
const newUsers = [
  { email: 'doctor1@hospital.com', password: 'Pass123!', name: 'Dr. Smith' },
  { email: 'doctor2@hospital.com', password: 'Pass456!', name: 'Dr. Jones' },
  { email: 'nurse1@hospital.com', password: 'Pass789!', name: 'Nurse Brown' }
];

createMultipleUsers(newUsers);
```

---

## User Management

### View All Users
1. Firebase Console → Authentication → Users
2. See list of all registered users
3. View: Email, UID, Creation date, Last sign-in

### Disable User Account
1. Find user in Authentication → Users
2. Click three dots menu (⋮)
3. Select "Disable account"
4. User can no longer sign in

### Delete User Account
1. Find user in Authentication → Users
2. Click three dots menu (⋮)
3. Select "Delete account"
4. Confirm deletion
5. **Warning**: This is permanent!

### Reset User Password
1. Find user in Authentication → Users
2. Click three dots menu (⋮)
3. Select "Reset password"
4. Firebase sends password reset email to user

---

## Security Best Practices

### Password Requirements
- Minimum 6 characters (Firebase default)
- Recommend: 8+ characters with mix of:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters

### Account Security
1. **Use strong passwords** for all accounts
2. **Enable 2FA** for admin accounts (Firebase Console)
3. **Regular audits** - Review user list monthly
4. **Remove inactive accounts** - Delete unused accounts
5. **Monitor sign-ins** - Check for suspicious activity

### Email Verification (Optional)
Enable email verification:
1. Firebase Console → Authentication → Templates
2. Customize "Email address verification" template
3. Require verification before access

---

## Troubleshooting

### User Can't Sign In

**Problem**: "Account not found"
- **Solution**: Create account in Firebase Console

**Problem**: "Wrong password"
- **Solution**: Reset password via Firebase Console

**Problem**: "Too many requests"
- **Solution**: Wait 15-30 minutes, then try again

### Google Sign-In Issues

**Problem**: "Popup closed by user"
- **Solution**: User needs to complete Google sign-in

**Problem**: "Unauthorized domain"
- **Solution**: Add domain to authorized domains in Firebase

---

## User Onboarding Checklist

When adding a new medical professional:

- [ ] Create account in Firebase Console
- [ ] Generate strong temporary password
- [ ] Send credentials securely (encrypted email/secure message)
- [ ] Provide login URL
- [ ] Include user guide/training materials
- [ ] Set up first-time login meeting
- [ ] Verify successful login
- [ ] Recommend password change
- [ ] Add to internal user directory

---

## Bulk User Import

For importing many users at once:

### CSV Format:
```csv
email,password,displayName
doctor1@hospital.com,TempPass1!,Dr. Smith
doctor2@hospital.com,TempPass2!,Dr. Jones
nurse1@hospital.com,TempPass3!,Nurse Brown
```

### Import Script:
```javascript
const csv = require('csv-parser');
const fs = require('fs');
const admin = require('firebase-admin');

async function importUsers(csvFilePath) {
  const users = [];
  
  // Read CSV
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', async () => {
      console.log(`Importing ${users.length} users...`);
      
      for (const user of users) {
        try {
          await admin.auth().createUser({
            email: user.email,
            password: user.password,
            displayName: user.displayName
          });
          console.log(`✓ Created: ${user.email}`);
        } catch (error) {
          console.error(`✗ Failed: ${user.email} - ${error.message}`);
        }
      }
      
      console.log('Import complete!');
    });
}

// Usage
importUsers('./users.csv');
```

---

## Support

### For Administrators
- Firebase Console: https://console.firebase.google.com/
- Firebase Documentation: https://firebase.google.com/docs/auth
- Firebase Support: https://firebase.google.com/support

### For Users
- Login issues: Contact system administrator
- Password reset: Use "Forgot Password" (if enabled)
- Account access: Contact IT department

---

## Quick Reference

### Create User (Console)
```
Firebase Console → Authentication → Users → Add User
```

### Disable User
```
Firebase Console → Authentication → Users → ⋮ → Disable
```

### Reset Password
```
Firebase Console → Authentication → Users → ⋮ → Reset Password
```

### View Sign-in Activity
```
Firebase Console → Authentication → Users → Click user → Sign-in method
```

---

## Current System Status

✅ **Sign-up disabled** - Users cannot self-register
✅ **Admin-only creation** - Accounts created by administrators
✅ **Email/Password** - Supported
✅ **Google Sign-In** - Supported (creates account on first use)
✅ **Secure** - Firebase Authentication handles security

---

## Need Help?

Contact your Firebase administrator or refer to:
- FINAL_ARCHITECTURE.md
- SYSTEM_READY.md
- Firebase Documentation
