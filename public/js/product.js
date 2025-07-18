// product.js - Lógica de productos y su renderizado
import { getProducts, addProduct, updateProduct, deleteProduct } from './api.js';
import { isAdmin, getCurrentUser } from './auth.js'; // Importar para verificar el rol

const productGrid = document.getElementById('product-grid');
const categoryFilters = document.getElementById('category-filters');
const noResults = document.getElementById('no-results');

export const renderProducts = (filteredProducts) => {
    productGrid.innerHTML = '';
    const productsToRender = filteredProducts || getProducts(); // Si no se filtra, muestra todos
    const userIsAdmin = isAdmin();

    if (productsToRender.length === 0) {
        noResults.classList.remove('hidden');
        productGrid.classList.add('hidden');
    } else {
        noResults.classList.add('hidden');
        productGrid.classList.remove('hidden');
        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300';
            
            let adminButtons = '';
            if (userIsAdmin) {
                adminButtons = `
                    <div class="flex mt-4 space-x-2">
                        <button data-product-id="${product.id}" class="edit-product-btn w-full bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-blue-600">Editar</button>
                        <button data-product-id="${product.id}" class="delete-product-btn w-full bg-red-500 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-red-600">Eliminar</button>
                    </div>
                `;
            }

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/400x400/e2e8f0/334155?text=Imagen+no+disponible';">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-gray-600 mb-4 h-12 overflow-hidden">${product.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-indigo-600">$${product.price.toFixed(2)}</span>
                        <button data-product-id="${product.id}" class="add-to-cart-btn bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200">
                            Agregar
                        </button>
                    </div>
                    ${adminButtons}
                </div>
            `;
            productGrid.appendChild(card);
        });
    }
};

export const renderCategories = () => {
    const categories = ['Todos', ...new Set(getProducts().map(p => p.category))];
    categoryFilters.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 whitespace-nowrap';
        if (category === 'Todos') {
            button.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
        } else {
            button.classList.add('bg-white', 'text-gray-700', 'border-gray-300', 'hover:bg-gray-100');
        }
        button.textContent = category;
        button.dataset.category = category;
        categoryFilters.appendChild(button);
    });
};

// Funciones para admin CRUD (ejemplos, necesitarán su propio modal/form)
export const handleAddProduct = (productData) => {
    addProduct(productData);
    renderProducts(); // Vuelve a renderizar la lista completa
};

export const handleEditProduct = (productId, updatedData) => {
    updateProduct(productId, updatedData);
    renderProducts();
};

export const handleDeleteProduct = (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        deleteProduct(productId);
        renderProducts();
        // También puedes limpiar el carrito si el producto eliminado estaba en él
    }
};