import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Use your existing config
const firebaseConfig = {
  apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
  authDomain: "comfort-desk.firebaseapp.com",
  projectId: "comfort-desk",
  appId: "1:109687131068:web:f42451da43c01ac5e479b9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 1. PROTECTION LOGIC: Redirect if not logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // If user logs out or session expires, kick them to login
        window.location.href = "../index.html";
    } else {
        // Fill dashboard with user data
        document.getElementById('userEmailDisplay').innerText = user.email;
        if(user.displayName) {
            document.getElementById('userInitial').innerText = user.displayName.charAt(0).toUpperCase();
        }
    }
});

// 2. LOGOUT LOGIC
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("User signed out.");
            // Optional: Clear any session-specific local storage here
            // localStorage.removeItem('some_user_preference');
            window.location.href = "../index.html";
        }).catch((error) => {
            alert("Error signing out: " + error.message);
        });
    });
}