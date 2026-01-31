import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, query, limitToFirst, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
    authDomain: "comfort-desk.firebaseapp.com",
    databaseURL: "https://comfort-desk-default-rtdb.firebaseio.com",
    projectId: "comfort-desk",
    appId: "1:109687131068:web:f42451da43c01ac5e479b9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Check Auth State for Navbar
onAuthStateChanged(auth, (user) => {
    const btn = document.getElementById('navAuthBtn');
    if (user) {
        btn.innerText = "Dashboard";
        btn.href = "pages/dashboard.html";
    }
});

// Fetch Featured Products
const productsRef = query(ref(db, 'products'), limitToFirst(3));
onValue(productsRef, (snapshot) => {
    const container = document.getElementById('featuredContainer');
    container.innerHTML = '';
    
    snapshot.forEach((child) => {
        const product = child.val();
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card glass-card h-100 p-3">
                    <img src="${product.imageUrl}" class="card-img-top rounded shadow-sm" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="fw-bold">${product.name}</h5>
                        <p class="text-primary fw-bold">$${product.price}</p>
                        <a href="pages/product.html" class="btn btn-outline-primary btn-sm w-100">View Details</a>
                    </div>
                </div>
            </div>
        `;
    });
});