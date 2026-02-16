console.log("MODULE STARTED");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase Configuration
// Replace these values with your actual Firebase project configuration
// Get this from: Firebase Console > Project Settings > Your Apps > Firebase SDK snippet

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://cambridge-crush-10492-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "cambridge-crush-10492",
  storageBucket: "cambridge-crush-10492.firebasestorage.app",
  messagingSenderId: "528374729329",
  appId: "1:528374729329:web:aba7d439b4d776f7efa9d0"
};

// Admin password - CHANGE THIS!
export const ADMIN_PASSWORD = "cambridgecrush2024";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log("DOM fully loaded");

const form = document.getElementById('crushForm');
const messageDiv = document.getElementById('message');
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const viewDataBtn = document.getElementById('viewDataBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const crushList = document.getElementById('crushList');
const adminPassword = document.getElementById('adminPassword');


function normalizeCRSid(id) {
  return id.trim().toLowerCase();
}

function isValidCRSid(id) {
  return /^[a-z]+[0-9]+$/.test(id);
}

function showMessage(text, type) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = "block";
}

async function checkForMatch(yourId, crushId) {
  const snapshot = await get(ref(database, `crushes/${crushId}`));

  console.log("Checking match...");
  console.log("Snapshot exists:", snapshot.exists());
  console.log("Snapshot value:", snapshot.val());

  if (!snapshot.exists()) return false;

  const data = snapshot.val();
  return data.crushes?.some(c => c.crushId === yourId);
}


async function saveCrush(yourId, crushId) {
  try {
    const crushRef = ref(database, `crushes/${yourId}`);
    const snapshot = await get(crushRef);

    let data = snapshot.exists()
      ? snapshot.val()
      : { crushes: [] };

    if (!data.crushes.some(c => c.crushId === crushId)) {
      data.crushes.push({
        crushId,
        timestamp: Date.now()
      });
    }

    await set(crushRef, data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const yourId = normalizeCRSid(document.getElementById('yourId').value);
    const crushId = normalizeCRSid(document.getElementById('crushId').value);

    // Validate CRSid format
    if (!isValidCRSid(yourId)) {
        showMessage('Your CRSid must start with letters followed by numbers (e.g., abc123).', 'error');
        return;
    }

    if (!isValidCRSid(crushId)) {
        showMessage('Crush CRSid must start with letters followed by numbers (e.g., abc123).', 'error');
        return;
    }

    if (yourId === crushId) {
        showMessage('You cannot enter yourself as your crush! 😅', 'error');
        return;
    }

    // Check for match
    const isMatch = await checkForMatch(yourId, crushId);

    // Save the crush data
    const saved = await saveCrush(yourId, crushId);

    if (!saved) {
        showMessage('Error saving data. Please try again.', 'error');
        return;
    }

    // Show appropriate message
    if (isMatch) {
        console.log('MATCH FOUND')
        showMessage(`🎉 IT'S A MATCH! Both you (${yourId}) and ${crushId} like each other! 💕`, 'match');
    } else {
        showMessage('Your crush has been recorded! If they also enter your CRSid, you\'ll both see a match notification! 🤞', 'success');
    }

    // Clear form
    form.reset();
});

// Admin panel toggle
adminBtn.addEventListener('click', () => {
    adminPanel.style.display = adminPanel.style.display === 'none' || adminPanel.style.display === '' ? 'block' : 'none';
});

// View all data (admin)
viewDataBtn.addEventListener('click', async () => {
    if (adminPassword.value !== ADMIN_PASSWORD) {
        alert('Incorrect admin password!');
        return;
    }

    crushList.innerHTML = '<div class="loading">Loading data...</div>';

    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'crushes'));

        if (!snapshot.exists()) {
            crushList.innerHTML = '<div class="loading">No data found.</div>';
            return;
        }

        const data = snapshot.val();
        let html = '';

        for (const [userId, userInfo] of Object.entries(data)) {
            html += `<div class="crush-item">
                <strong>${userId}</strong> has crushes on:<br>`;
            
            if (userInfo.crushes && userInfo.crushes.length > 0) {
                userInfo.crushes.forEach(crush => {
                    html += `• ${crush.crushId} (${new Date(crush.timestamp).toLocaleString()})<br>`;
                });
            } else {
                html += 'No crushes recorded<br>';
            }
            
            html += `</div>`;
        }

        crushList.innerHTML = html;
    } catch (error) {
        console.error('Error loading data:', error);
        crushList.innerHTML = '<div class="loading">Error loading data.</div>';
    }
});

// Export data as JSON
exportDataBtn.addEventListener('click', async () => {
    if (adminPassword.value !== ADMIN_PASSWORD) {
        alert('Incorrect admin password!');
        return;
    }

    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'crushes'));

        if (!snapshot.exists()) {
            alert('No data to export.');
            return;
        }

        const data = snapshot.val();
        const jsonString = JSON.stringify(data, null, 2);
        
        // Create download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cambridge-crush-data-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Error exporting data.');
    }
``});