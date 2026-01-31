import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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

let cart = JSON.parse(localStorage.getItem('chairCart')) || [];

const renderCart = () => {
    const list = document.getElementById('cartItemsList');
    if (cart.length === 0) return;

    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price * item.quantity;
        return `
            <div class="row align-items-center mb-4 pb-4 border-bottom border-secondary">
                <div class="col-3">
                    <img src="https://via.placeholder.com/100" class="img-fluid rounded" alt="${item.name}">
                </div>
                <div class="col-5">
                    <h5 class="fw-bold mb-0">${item.name}</h5>
                    <p class="text-secondary small mb-0">$${item.price} per unit</p>
                </div>
                <div class="col-4 text-end">
                    <div class="d-flex align-items-center justify-content-end">
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, -1)">-</button>
                        <span class="mx-3 fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQty(${index}, 1)">+</button>
                        <button class="btn btn-sm text-danger ms-3" onclick="removeItem(${index})"><i class="bi bi-trash"></i></button>
                    </div>
                    <div class="mt-2 fw-bold text-primary">$${(item.price * item.quantity).toFixed(2)}</div>
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
    location.reload();
};

// Terms Checkbox & Button Sync
document.getElementById('termsCheck').addEventListener('change', function() {
    document.getElementById('checkoutBtn').disabled = !this.checked;
});

// Checkout Action
document.getElementById('checkoutBtn').addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user) {
        alert("Please login to place an order!");
        window.location.href = "login.html";
        return;
    }

    const orderRef = ref(db, 'orders/' + user.uid);
    const newOrderRef = push(orderRef);
    set(newOrderRef, {
        items: cart,
        total: document.getElementById('totalPrice').innerText,
        status: "Paid",
        timestamp: new Date().toISOString()
    }).then(() => {
        alert("Order Successful!");
        localStorage.removeItem('chairCart');
        window.location.href = "dashboard.html";
    });
});

renderCart();