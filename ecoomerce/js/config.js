import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
  authDomain: "comfort-desk.firebaseapp.com",
  databaseURL: "https://comfort-desk-default-rtdb.firebaseio.com",
  projectId: "comfort-desk",
  storageBucket: "comfort-desk.firebasestorage.app",
  messagingSenderId: "109687131068",
  appId: "1:109687131068:web:f42451da43c01ac5e479b9",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// js/products.js
let cart = JSON.parse(localStorage.getItem('chairCart')) || [];

// Function to add item to cart
window.addToCart = (id, name, price) => {
    const item = { id, name, price, quantity: 1 };
    const exists = cart.find(product => product.id === id);
    
    if (exists) {
        exists.quantity++;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('chairCart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
};