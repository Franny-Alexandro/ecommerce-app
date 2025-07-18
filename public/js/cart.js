// cart.js - Lógica del carrito de compras

import { getProductById } from './api.js';
import { toggleCartPanel } from './ui.js'; // Importar si es necesario para abrir el carrito al añadir

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

const cartItemsContainer = document.getElementById('cart-items');
const cartCountBadge = document.getElementById('cart-count-badge');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const checkoutButton = document.getElementById('checkout-button');
const checkoutTotalEl = document.getElementById('checkout-total');


export const renderCart = () => {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">Tu carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'flex items-center justify-between py-4 border-b cart-item-enter';
            cartItemDiv.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div>
                        <h4 class="font-semibold text-gray-800">${item.name}</h4>
                        <p class="text-sm text-gray-500">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="flex items-center border rounded-md">
                        <button data-id="${item.id}" class="quantity-change-btn p-1 text-gray-600 hover:bg-gray-100" data-change="-1">-</button>
                        <span class="px-3 text-lg font-medium">${item.quantity}</span>
                        <button data-id="${item.id}" class="quantity-change-btn p-1 text-gray-600 hover:bg-gray-100" data-change="1">+</button>
                    </div>
                    <button data-id="${item.id}" class="remove-from-cart-btn text-red-500 hover:text-red-700 p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
    }
    updateCartSummary();
};

export const addToCart = (productId) => {
    const product = getProductById(productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
    toggleCartPanel(true); // Opcional: abre el carrito al añadir
};

export const updateQuantity = (productId, change) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
};

export const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
};

export const updateCartSummary = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartCountBadge.textContent = totalItems;
    checkoutButton.disabled = cart.length === 0;
    checkoutTotalEl.textContent = `$${subtotal.toFixed(2)}`;
};

export const saveCart = () => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
};

export const clearCart = () => {
    cart = [];
    saveCart();
    renderCart();
};

export const getCart = () => {
    return cart;
};