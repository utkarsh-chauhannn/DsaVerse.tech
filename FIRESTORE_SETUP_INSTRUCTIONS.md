# 🔥 Firestore Setup Instructions

## Step 0 (Required): Configure Firebase Web App Keys

If you see `Firebase: Error (auth/invalid-api-key)` (or a blank screen on startup), your local Firebase web config is missing or incorrect.

1. Go to Firebase Console → your project → **Project settings** (gear icon).
2. In **General** → **Your apps**, select your **Web app** (create one if you don’t have it).
3. Copy the Firebase config values (apiKey, authDomain, projectId, appId, etc.).
4. Create a file named `.env` in the project root and add:

```bash
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
# Optional
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

5. Restart the dev server (`Ctrl+C` then `npm start`) so CRA reloads env vars.

Notes:
- The API key should typically start with `AIza`.
- Do not wrap values in quotes unless they contain spaces.

## Issue: Progress Loading Forever / Mark as Learned Not Working

This usually means **Firestore security rules** haven't been set up yet. Follow these steps:

## Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **dsa-made-easy-6ad58**
3. Click **Firestore Database** in the left menu
4. If you see "Create database" button, click it
5. Choose **Production mode** (we'll add security rules next)
6. Select a location (choose closest to your users)
7. Click **Enable**

## Step 2: Set Up Security Rules

1. In Firestore Database, click on the **Rules** tab
2. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read for problems, leaderboard (for future features)
    match /problems/{problemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /leaderboard/{period} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

3. Click **Publish**

## Step 3: Verify Setup

1. Open your browser's **Developer Console** (F12)
2. Go to the **Console** tab
3. Look for any Firebase/Firestore errors
4. Common errors:
   - `PERMISSION_DENIED` → Security rules not set up correctly
   - `Firestore database is not initialized` → Database not created
   - Network errors → Check internet connection

## Step 4: Test

1. Sign in to your app
2. Go to "My Progress" page
3. It should load (may take a few seconds the first time)
4. Try clicking "Mark as Learned" on any algorithm/data structure
5. Check the Progress page - it should update

## Troubleshooting

### Still Loading Forever?
- Check browser console for errors
- Verify Firestore database is created
- Verify security rules are published
- Make sure you're signed in

### Mark as Learned Not Working?
- Check browser console for errors
- Verify the user document exists in Firestore
- Check that security rules allow write access

### Need Help?
Check the browser console (F12 → Console tab) for specific error messages.

