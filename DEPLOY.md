# Deploy to Firebase (100% Free Forever!)

Firebase offers a **truly free tier** with no payment method required for basic usage. Perfect for chat apps!

## Quick Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `fluxchat` (or any name)
4. Disable Google Analytics (optional, to keep it simple)
5. Click "Create project"

### 2. Enable Realtime Database

1. In your Firebase project, click "Realtime Database" in the left menu
2. Click "Create Database"
3. Choose a location (pick closest to you)
4. Start in **test mode** (we'll secure it later)
5. Click "Enable"

### 3. Get Your Firebase Config

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app with nickname "FluxChat"
6. Copy the `firebaseConfig` object

### 4. Set Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. Secure Your Database (Important!)

1. Go to Realtime Database → Rules
2. Replace the rules with:

```json
{
  "rules": {
    "messages": {
      ".read": true,
      ".write": true
    },
    "users": {
      ".read": true,
      ".write": true
    },
    "typing": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Click "Publish"

### 6. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 7. Login to Firebase

```bash
firebase login
```

### 8. Initialize Firebase Hosting

```bash
firebase init hosting
```

When prompted:
- Select your Firebase project
- Public directory: `out` (Next.js export folder)
- Single-page app: **Yes**
- Overwrite index.html: **No**

### 9. Deploy!

```bash
npm run deploy
```

Or manually:
```bash
npm run build
firebase deploy
```

## Your App is Live! 🎉

Your chat will be available at: `https://your-project-id.web.app`

## Free Tier Limits (Generous!)

- **1 GB storage** - Plenty for messages
- **10 GB/month download** - More than enough
- **Unlimited reads/writes** (within reason)
- **Free SSL/HTTPS**
- **Custom domains** supported
- **No credit card required**
- **Never expires** - truly permanent!

## Updating Your App

After making changes:
```bash
git add .
git commit -m "Your changes"
git push
npm run deploy
```

## Troubleshooting

- **Database errors**: Check your `.env.local` file has correct values
- **Build errors**: Make sure all dependencies are installed (`npm install`)
- **Deploy errors**: Ensure you're logged in (`firebase login`)

## Security Note

The rules above allow anyone to read/write. For production, consider adding authentication, but for a simple chat app, this works great!
