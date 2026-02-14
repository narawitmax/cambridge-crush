# Cambridge Crush Matcher 💘

A simple web application for Cambridge students to anonymously submit their crushes and get notified when there's a mutual match!

## Features

- 🔐 Anonymous crush submission using CRSid
- 💕 Automatic mutual match detection
- 🎨 Beautiful, responsive UI
- 📊 Admin panel for data management
- 📥 Export data functionality

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Realtime Database**:
   - Go to "Build" → "Realtime Database"
   - Click "Create Database"
   - Start in **test mode** (you can adjust security rules later)
4. Get your Firebase configuration:
   - Go to Project Settings (gear icon) → "Your apps"
   - Add a web app if you haven't already
   - Copy the Firebase configuration object

### 2. Configure the Application

1. Open `app.js`
2. Replace the `firebaseConfig` object with your Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. **Change the admin password** in `app.js`:

```javascript
const ADMIN_PASSWORD = "your-secure-password-here";
```

### 3. Deploy

You can deploy this application using:

#### GitHub Pages
1. Push the files to your GitHub repository
2. Go to Settings → Pages
3. Select the branch to deploy from
4. Your site will be available at `https://yourusername.github.io/your-repo-name`

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Local Testing
Simply open `index.html` in a web browser, or use a local server:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── app.js          # Firebase integration and app logic
└── README.md       # This file
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Admin Password**: Change the default admin password in `app.js`
2. **Firebase Rules**: Update your Firebase Realtime Database rules for production:

```json
{
  "rules": {
    "crushes": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

3. **API Key**: While the API key is safe to expose in client-side code, make sure to set up proper Firebase Security Rules
4. Consider adding Firebase Authentication for better security

## How It Works

1. Users enter their CRSid and their crush's CRSid
2. The data is stored in Firebase Realtime Database
3. When a user submits, the app checks if their crush has also listed them
4. If there's a mutual match, both users see a match notification!
5. Admins can view all data and export it as JSON

## Admin Panel

Access the admin panel by:
1. Click "Admin Panel" button
2. Enter the admin password (default: `cambridgecrush2024`)
3. View all crushes or export data as JSON

## Privacy

- All CRSids are normalized to lowercase
- Data is stored securely in Firebase
- Only mutual matches are revealed to users
- Admin access is password-protected

## License

MIT License - feel free to use and modify!

## Support

For issues or questions, please open an issue on GitHub.
