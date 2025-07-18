// ui.js - Funciones para manipular la UI

export const toggleCartPanel = (open) => {
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    if (open) {
        cartPanel.classList.remove('translate-x-full');
        cartOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        cartPanel.classList.add('translate-x-full');
        cartOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

export const toggleCheckoutModal = (open) => {
    const checkoutModal = document.getElementById('checkout-modal');
    if (open) {
        checkoutModal.classList.remove('scale-0');
        checkoutModal.classList.add('scale-100');
    } else {
        checkoutModal.classList.remove('scale-100');
        checkoutModal.classList.add('scale-0');
    }
};

export const showThankYouMessage = (show) => {
    const thankYouMessage = document.getElementById('thank-you-message');
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    if (show) {
        checkoutFormContainer.classList.add('hidden');
        thankYouMessage.classList.remove('hidden');
    } else {
        checkoutFormContainer.classList.remove('hidden');
        thankYouMessage.classList.add('hidden');
    }
};

export const toggleLoginModal = (open) => {
    const loginModal = document.getElementById('login-modal');
    if (open) {
        loginModal.classList.remove('hidden');
    } else {
        loginModal.classList.add('hidden');
    }
};

// Función para actualizar los controles de autenticación en el header
export const updateAuthControls = (currentUser) => {
    const authControls = document.getElementById('auth-controls');
    authControls.innerHTML = '';
    if (currentUser) {
        authControls.innerHTML = `
            <span class="text-gray-700 text-md font-medium">Hola, ${currentUser.username}!</span>
            <button id="logout-button" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300">Salir</button>
        `;
    } else {
        authControls.innerHTML = `
            <button id="show-login-button" class="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">Login</button>
        `;
    }
};

export const toggleAddProductModal = (open) => {
    // ... Implementar un modal o sección para agregar/editar productos
};