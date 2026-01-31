import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// Import Firestore functions
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

// 1. Auth Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Update Profile UI
        document.getElementById('userEmailDisplay').innerText = user.email;
        document.getElementById('userInitial').innerText = user.email.charAt(0).toUpperCase();
        
        // Fetch User's Orders from Firestore
        fetchUserOrders(user.uid);
    } else {
        window.location.href = "../index.html";
    }
});

// 2. Fetch Orders Function
async function fetchUserOrders(uid) {
    const orderList = document.getElementById('orderList');
    const orderCountBadge = document.getElementById('orderCount');
    
    try {
        // Query: Get all docs in 'orders' where userId matches the logged-in user
        const q = query(
            collection(db, "orders"), 
            where("userId", "==", uid),
            orderBy("createdAt", "desc") // Show newest orders first
        );

        const querySnapshot = await getDocs(q);
        orderList.innerHTML = ''; // Clear loading spinner

        if (querySnapshot.empty) {
            orderList.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-secondary">No orders found.</td></tr>';
            orderCountBadge.innerText = "0 Orders";
            return;
        }

        orderCountBadge.innerText = `${querySnapshot.size} Orders`;

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const date = new Date(order.createdAt).toLocaleDateString();
            
            orderList.innerHTML += `
                <tr>
                    <td class="small text-secondary">${date}</td>
                    <td><span class="small">${order.items.length} Product(s)</span></td>
                    <td class="fw-bold text-primary">${order.totalAmount}</td>
                    <td><span class="badge bg-success-subtle text-success border border-success px-3">PAID</span></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        // If you get an error here, you might need to create a Firestore Index (check browser console for link)
        orderList.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Failed to load orders.</td></tr>';
    }
}

// 3. Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "../index.html";
    });
});