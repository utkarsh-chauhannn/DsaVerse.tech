# 🔍 Understanding the "Failed to Sign In" Error

## FirebaseError: auth/unauthorized-domain (Deployed Website)

If the console shows:

`FirebaseError: Firebase: Error (auth/unauthorized-domain).`

Firebase Authentication is refusing to sign in because your site’s domain is not on the allowlist.

### Fix

1. Open **Firebase Console** → your project.
2. Go to **Authentication** → **Settings**.
3. Under **Authorized domains**, click **Add domain**.
4. Add your deployed domain (examples):
	- `your-app.vercel.app`
	- `your-app.netlify.app`
	- `yourdomain.com`
5. Refresh your deployed site and try Google sign-in again.

Notes:
- For local dev, ensure `localhost` is present (it usually is by default).
- Add the exact hostname you’re using (don’t include `https://` and don’t include paths).

## Why Sign-In Failed

The sign-in failed because **Firebase is not configured yet**. The app is currently using placeholder values in `src/firebase.js`:

```javascript
apiKey: "YOUR_API_KEY"  // ❌ This is a placeholder, not a real key
```

## ✅ Solution: Configure Firebase (2 Options)

### Option 1: Full Setup (Recommended - 5 minutes)

Follow **QUICK_FIREBASE_SETUP.md** to:
1. Create Firebase project
2. Enable Google authentication  
3. Get your config
4. Update `src/firebase.js`

### Option 2: Use Example/Test Project (Quick Test)

If you want to test first before creating your own project, you can use a test Firebase project temporarily.

**Would you like me to help you with:**
- [ ] Creating your own Firebase project (recommended for production)
- [ ] Setting up a test/demo configuration just to see it work

## 🎯 What You'll See After Configuration

**Before (Current State):**
- ❌ Click "Sign in with Google"
- ❌ Alert: "Firebase is not configured yet!"
- ❌ Orange warning banner on login page

**After Configuration:**
- ✅ Click "Sign in with Google"
- ✅ Google account selection popup
- ✅ Signed in! Profile shows in navbar
- ✅ Can access user data (name, email, photo)

## 📋 Quick Checklist

Current status of your setup:

- [x] Firebase package installed ✓
- [x] Authentication components created ✓
- [x] Login page working ✓
- [x] Error handling added ✓
- [ ] Firebase project created ⏳ **← YOU ARE HERE**
- [ ] Google auth enabled ⏳
- [ ] Config updated in code ⏳

## 🚀 Next Step

Open your browser to:
👉 **https://console.firebase.google.com/**

Then follow the 6 steps in **QUICK_FIREBASE_SETUP.md**

---

The code is ready - we just need your Firebase credentials! 🔑
