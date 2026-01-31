import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"; // Ensure base app is imported if not already
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const auth = getAuth();

/**
 * 1. Update Cart Badge Count
 * Fetches total items from localStorage and updates the UI badge.
 */
const updateNavCart = () => {
    const cart = JSON.parse(localStorage.getItem('chairCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('globalCartCount');
    
    if (cartBadge) {
        cartBadge.innerText = totalItems;
        // Hide badge if cart is empty for cleaner UI
        cartBadge.style.display = totalItems > 0 ? "inline-block" : "none";
    }
};

/**
 * 2. Handle Login vs Dashboard Button
 * Uses Firebase Observer to toggle button text and links.
 */
onAuthStateChanged(auth, (user) => {
    const actionBtn = document.getElementById('navActionBtn');
    
    if (actionBtn) {
        if (user) {
            actionBtn.innerText = "My Dashboard";
            // Logic to handle pathing: if in /pages/ use 'dashboard.html', else 'pages/dashboard.html'
            const isInPagesFolder = window.location.pathname.includes('/pages/');
            actionBtn.href = isInPagesFolder ? "dashboard.html" : "pages/dashboard.html";
            
            actionBtn.classList.remove('btn-primary');
            actionBtn.classList.add('btn-outline-primary');
        } else {
            actionBtn.innerText = "Login";
            const isInPagesFolder = window.location.pathname.includes('/pages/');
            actionBtn.href = isInPagesFolder ? "login.html" : "pages/login.html";
            
            actionBtn.classList.remove('btn-outline-primary');
            actionBtn.classList.add('btn-primary');
        }
    }
});

// Run cart update on initial load
document.addEventListener('DOMContentLoaded', updateNavCart);

// Listen for storage changes (updates cart count across tabs)
window.addEventListener('storage', () => {
    updateNavCart();
});

// Export for use in other scripts (like when 'Add to Cart' is clicked)
export { updateNavCart };