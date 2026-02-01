import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// Changed to Firestore SDK
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
    authDomain: "comfort-desk.firebaseapp.com",
    projectId: "comfort-desk",
    storageBucket: "comfort-desk.firebasestorage.app",
    messagingSenderId: "109687131068",
    appId: "1:109687131068:web:f42451da43c01ac5e479b9",
    measurementId: "G-ZJVVZYYNET"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initializing Firestore

let cart = JSON.parse(localStorage.getItem('chairCart')) || [];

const renderCart = () => {
    const list = document.getElementById('cartItemsList');
    
    // If cart is empty, show a message
    if (cart.length === 0) {
        list.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x display-1 text-secondary"></i>
                <p class="mt-3">Your cart is empty.</p>
                <a href="product.html" class="btn btn-outline-primary">Continue Shopping</a>
            </div>`;
        document.getElementById('subtotalPrice').innerText = "$0.00";
        document.getElementById('totalPrice').innerText = "$0.00";
        return;
    }

    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price * item.quantity;
      // Inside your renderCart mapping function
return `
<div class="row align-items-center mb-4 pb-4 border-bottom border-secondary">
    <div class="col-3 col-md-2">
        <img src="${item.image}" class="img-fluid rounded shadow-sm" alt="product" style="max-height: 80px; object-fit: contain; background: white;">
    </div>
    <div class="col-5 col-md-6">
        <h6 class="fw-bold mb-0 text-truncate">${item.name}</h6>
        <p class="text-primary small fw-bold mb-0">$${item.price}</p>
    </div>
    <div class="col-4 text-end">
        <div class="d-flex align-items-center justify-content-end mb-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, -1)">-</button>
            <span class="mx-2 fw-bold">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, 1)">+</button>
        </div>
        <button class="btn btn-sm text-danger border-0 bg-transparent" onclick="removeItem(${index})">
            <i class="bi bi-trash"></i>
        </button>
    </div>
</div>
`;
    }).join('');

    document.getElementById('subtotalPrice').innerText = `$${total.toFixed(2)}`;
    document.getElementById('totalPrice').innerText = `$${total.toFixed(2)}`;
};

// Update Quantity
window.updateQty = (index, change) => {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart.splice(index, 1);
    localStorage.setItem('chairCart', JSON.stringify(cart));
    renderCart();
};

// Remove Item
window.removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('chairCart', JSON.stringify(cart));
    renderCart(); // Better than reload for UX
};

// Terms Checkbox Sync
const termsCheck = document.getElementById('termsCheck');
const checkoutBtn = document.getElementById('checkoutBtn');
if(termsCheck) {
    termsCheck.addEventListener('change', function() {
        checkoutBtn.disabled = !this.checked;
    });
}

// Checkout Action (Updated for Firestore)
checkoutBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please login to place an order!");
        window.location.href = "login.html";
        return;
    }

    try {
        // Create an 'orders' collection in Firestore
        await addDoc(collection(db, "orders"), {
            userId: user.uid,
            userEmail: user.email,
            items: cart,
            totalAmount: document.getElementById('totalPrice').innerText,
            status: "Paid",
            createdAt: new Date().toISOString()
        });

        alert("Order Placed Successfully!");
        localStorage.removeItem('chairCart');
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Checkout failed. Please try again.");
    }
});

renderCart();