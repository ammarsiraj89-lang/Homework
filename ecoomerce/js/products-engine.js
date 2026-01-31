import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
    authDomain: "comfort-desk.firebaseapp.com",
    databaseURL: "https://comfort-desk-default-rtdb.firebaseio.com",
    projectId: "comfort-desk",
    appId: "1:109687131068:web:f42451da43c01ac5e479b9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const renderProducts = (products) => {
    const grid = document.getElementById('catalogGrid');
    grid.innerHTML = products.map(p => `
        <div class="col">
            <div class="card glass-card h-100 border-0 overflow-hidden">
                <div class="position-relative">
                    <img src="${p.imageUrl}" class="card-img-top p-3" alt="${p.name}" style="height: 250px; object-fit: contain;">
                    ${p.isNew ? '<span class="badge bg-primary position-absolute top-0 start-0 m-3">NEW</span>' : ''}
                </div>
                <div class="card-body p-4">
                    <h5 class="fw-bold mb-1">${p.name}</h5>
                    <p class="text-secondary small mb-3">${p.category}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fs-4 fw-bold text-primary">$${p.price}</span>
                        <button onclick="addToCart('${p.id}', '${p.name}', ${p.price})" class="btn btn-primary rounded-pill px-4 btn-sm fw-bold">
                           <i class="bi bi-plus-lg"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

// Global AddToCart (Accessible via onclick)
window.addToCart = (id, name, price) => {
    let cart = JSON.parse(localStorage.getItem('chairCart')) || [];
    const existing = cart.find(i => i.id === id);
    if(existing) existing.quantity++;
    else cart.push({id, name, price, quantity: 1});
    localStorage.setItem('chairCart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
};

// Listen to Firebase Data
onValue(ref(db, 'products'), (snapshot) => {
    const data = snapshot.val();
    const productList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
    renderProducts(productList);
});