import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
    authDomain: "comfort-desk.firebaseapp.com",
    databaseURL: "https://comfort-desk-default-rtdb.firebaseio.com",
    projectId: "comfort-desk",
    appId: "1:109687131068:web:f42451da43c01ac5e479b9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const contactData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMsg').value,
        sentAt: new Date().toLocaleString()
    };

    const contactRef = ref(db, 'inquiries');
    const newInquiryRef = push(contactRef);

    set(newInquiryRef, contactData)
        .then(() => {
            document.getElementById('contactForm').reset();
            document.getElementById('successMsg').classList.remove('d-none');
        })
        .catch((err) => alert("Error: " + err.message));
});