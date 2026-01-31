import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Use the config you provided
const firebaseConfig = {
  apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
  authDomain: "comfort-desk.firebaseapp.com",
  projectId: "comfort-desk",
  appId: "1:109687131068:web:f42451da43c01ac5e479b9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let isLoginMode = true;

window.toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('authTitle').innerText = isLoginMode ? "Login" : "Sign Up";
    document.getElementById('toggleText').innerHTML = isLoginMode 
        ? 'New to Comfort Desk? <a href="#" onclick="toggleAuthMode()" class="text-primary text-decoration-none">Create account</a>'
        : 'Already have an account? <a href="#" onclick="toggleAuthMode()" class="text-primary text-decoration-none">Login here</a>';
};

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    if (isLoginMode) {
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => window.location.href = "dashboard.html")
            .catch(err => alert(err.message));
    } else {
        createUserWithEmailAndPassword(auth, email, pass)
            .then(() => window.location.href = "dashboard.html")
            .catch(err => alert(err.message));
    }
});