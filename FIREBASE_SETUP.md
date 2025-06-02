# Firebase Setup Guide for XGpt

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `xgpt-chat`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication**
2. Click on **Sign-in method** tab
3. Enable **Google** provider:
   - Click on Google
   - Toggle "Enable"
   - Add your email in "Authorized domains"
   - Save

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location closest to your users
5. Click "Done"

## Step 4: Get Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select Web (</>) 
4. Register app with nickname: "XGpt Web"
5. Copy the configuration values:
   - `apiKey`
   - `projectId`
   - `appId`

## Step 5: Add Domain Authorization

1. In **Authentication > Settings > Authorized domains**
2. Add your Replit domain (copy from browser address bar)
3. For production, add your custom domain

## Step 6: Deploy Security Rules

Copy this to **Firestore > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /chats/{chatId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        match /messages/{messageId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  }
}
```

## Step 7: Test Authentication

1. Try signing in with Google in your app
2. Check the Authentication tab for new users
3. Test creating chats and messages

## Troubleshooting

- **"unauthorized-domain"**: Add your domain to Authorized domains
- **"configuration-not-found"**: Check if Google sign-in is enabled
- **"popup-blocked"**: Allow popups in browser settings