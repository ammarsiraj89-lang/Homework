import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Your provided Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAeSNIxXzWSjjrI0FouZjQZIN2-6wH-a2Y",
  authDomain: "comfort-desk.firebaseapp.com",
  databaseURL: "https://comfort-desk-default-rtdb.firebaseio.com",
  projectId: "comfort-desk",
  storageBucket: "comfort-desk.firebasestorage.app",
  messagingSenderId: "109687131068",
  appId: "1:109687131068:web:f42451da43c01ac5e479b9",
  measurementId: "G-ZJVVZYYNET"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * Function to add a product to your Firebase Database
 */
export const addProduct = (name, price, category, imageUrl) => {
    const productListRef = ref(db, 'products');
    const newProductRef = push(productListRef);
    
    set(newProductRef, {
        name: name,
        price: parseFloat(price),
        category: category,
        imageUrl: imageUrl,
        isNew: true,
        createdAt: new Date().toISOString()
    }).then(() => {
        console.log(`Success! ${name} added to the store.`);
    }).catch((error) => {
        console.error("Firebase Error:", error);
    });
};

// Example Usage (You can call this from your console to add chairs):
// addProduct("Titan Evo 2026", 499, "Gaming", "https://your-image-url.com/chair.png");