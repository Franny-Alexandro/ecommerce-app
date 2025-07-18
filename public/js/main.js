// main.js - Orquestador principal
import { getProducts } from './api.js';
import { renderProducts, renderCategories, handleDeleteProduct } from './product.js';
import { addToCart, renderCart, updateQuantity, removeFromCart, clearCart } from './cart.js';
import { toggleCartPanel, toggleCheckoutModal, showThankYouMessage, toggleLoginModal, updateAuthControls } from './ui.js';
import { login, logout, getCurrentUser, isAdmin } from './auth.js';

// --- DOM Elements ---
const searchInput = document.getElementById('search-input');
const productGrid = document.getElementById('product-grid');
const categoryFilters = document.getElementById('category-filters');

const cartButton = document.getElementById('cart-button');
const closeCartButton = document.getElementById('close-cart-button');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutButton = document.getElementById('checkout-button');

const checkoutForm = document.getElementById('checkout-form');
const closeCheckoutButton = document.getElementById('close-checkout-button');
const closeThankYouButton = document.getElementById('close-thank-you-button');

const loginModal = document.getElementById('login-modal');
const showLoginButton = document.getElementById('show-login-button'); // Este botón se crea dinámicamente
const logoutButton = document.getElementById('logout-button'); // Este botón se crea dinámicamente
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const closeLoginModal = document.getElementById('close-login-modal');


// --- State for Filters/Search ---
let currentCategory = 'Todos';
let currentSearchTerm = '';

// --- Event Handlers ---
const handleFilterAndSearch = () => {
    const products = getProducts();
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = currentCategory === 'Todos' || product.category === currentCategory;
        return matchesSearch && matchesCategory;
    });
    renderProducts(filteredProducts);
};

const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    const success = login(username, password);
    if (success) {
        toggleLoginModal(false);
        updateAuthControls(getCurrentUser());
        renderProducts(); // Volver a renderizar productos para mostrar opciones de admin
    } else {
        loginError.classList.remove('hidden');
    }
};

const handleLogout = () => {
    logout();
    updateAuthControls(null);
    renderProducts(); // Volver a renderizar productos para ocultar opciones de admin
};

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderProducts();
    renderCategories();
    renderCart();
    updateAuthControls(getCurrentUser()); // Actualiza el header al cargar la página

    // Product Grid Events
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        }
        if (isAdmin() && e.target.classList.contains('delete-product-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            handleDeleteProduct(productId);
        }
        // TODO: Add event listener for 'edit-product-btn'
    });

    // Category Filter Events
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
                btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
            });
            e.target.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
            e.target.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
            currentCategory = e.target.dataset.category;
            handleFilterAndSearch();
        }
    });

    // Search Input Event
    searchInput.addEventListener('input', handleFilterAndSearch);

    // Cart Panel Events
    cartButton.addEventListener('click', () => toggleCartPanel(true));
    closeCartButton.addEventListener('click', () => toggleCartPanel(false));
    cartOverlay.addEventListener('click', () => toggleCartPanel(false));

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.dataset.id);
        if (target.classList.contains('quantity-change-btn')) {
            const change = parseInt(target.dataset.change);
            updateQuantity(id, change);
        }
        if (target.classList.contains('remove-from-cart-btn')) {
            removeFromCart(id);
        }
    });

    // Checkout Modal Events
    checkoutButton.addEventListener('click', () => {
        if (cart.getCart().length > 0) { // Verifica si hay elementos en el carrito
            toggleCheckoutModal(true);
            toggleCartPanel(false); // Cierra el carrito al abrir el checkout
            showThankYouMessage(false); // Asegúrate de que el formulario de checkout sea visible
            checkoutForm.reset();
            document.getElementById('checkout-form-container').classList.remove('hidden');
        }
    });
    closeCheckoutButton.addEventListener('click', () => toggleCheckoutModal(false));
    closeThankYouButton.addEventListener('click', () => toggleCheckoutModal(false));

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showThankYouMessage(true); // Muestra el mensaje de agradecimiento
        clearCart(); // Vacía el carrito
    });

    // Login/Logout Events (Delegación de eventos para botones dinámicos)
    document.querySelector('header').addEventListener('click', (e) => {
        if (e.target.id === 'show-login-button') {
            toggleLoginModal(true);
            loginError.classList.add('hidden'); // Limpia el mensaje de error anterior
        }
        if (e.target.id === 'logout-button') {
            handleLogout();
        }
    });
    
    if(loginForm) { // Verifica que el formulario exista
        loginForm.addEventListener('submit', handleLogin);
    }
    if(closeLoginModal) { // Verifica que el botón exista
        closeLoginModal.addEventListener('click', () => toggleLoginModal(false));
    }
});