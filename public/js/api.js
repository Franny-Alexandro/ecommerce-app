// api.js - Simulación de una API de backend

let productsData = JSON.parse(localStorage.getItem('allProducts')) || [
    { id: 1, name: 'Laptop Pro X', price: 1250.00, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Laptop+Pro+X', description: 'Potente laptop para profesionales creativos y desarrolladores.', category: 'Electrónica' },
    { id: 2, name: 'Smartphone Z', price: 899.99, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Smartphone+Z', description: 'El último smartphone con cámara de alta resolución y 5G.', category: 'Electrónica' },
    { id: 3, name: 'Auriculares Inalámbricos', price: 199.50, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Auriculares', description: 'Cancelación de ruido activa y sonido de alta fidelidad.', category: 'Accesorios' },
    { id: 4, name: 'Camiseta de Algodón', price: 25.00, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Camiseta', description: 'Camiseta básica y cómoda, 100% algodón orgánico.', category: 'Ropa' },
    { id: 5, name: 'Mochila Urbana', price: 75.00, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Mochila', description: 'Resistente al agua, con compartimento para laptop.', category: 'Accesorios' },
    { id: 6, name: 'Zapatillas Runner', price: 120.00, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Zapatillas', description: 'Diseñadas para máximo confort y rendimiento al correr.', category: 'Ropa' },
    { id: 7, name: 'Smartwatch Fit', price: 250.00, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Smartwatch', description: 'Monitoriza tu actividad física y notificaciones.', category: 'Electrónica' },
    { id: 8, name: 'Libro de Ciencia Ficción', price: 18.99, image: 'https://placehold.co/400x400/e2e8f0/334155?text=Libro', description: 'Una aventura épica en una galaxia lejana.', category: 'Libros' },
];

const usersData = [
    { username: 'admin', password: 'adminpassword', role: 'admin' },
    { username: 'user', password: 'userpassword', role: 'user' },
];

function saveProducts() {
    localStorage.setItem('allProducts', JSON.stringify(productsData));
}

export const getProducts = () => {
    return productsData;
};

export const getProductById = (id) => {
    return productsData.find(p => p.id === id);
};

export const addProduct = (product) => {
    const newProduct = { ...product, id: productsData.length > 0 ? Math.max(...productsData.map(p => p.id)) + 1 : 1 };
    productsData.push(newProduct);
    saveProducts();
    return newProduct;
};

export const updateProduct = (id, updatedFields) => {
    const index = productsData.findIndex(p => p.id === id);
    if (index !== -1) {
        productsData[index] = { ...productsData[index], ...updatedFields };
        saveProducts();
        return productsData[index];
    }
    return null;
};

export const deleteProduct = (id) => {
    const initialLength = productsData.length;
    productsData = productsData.filter(p => p.id !== id);
    saveProducts();
    return productsData.length < initialLength; // true if deleted
};

export const authenticateUser = (username, password) => {
    const user = usersData.find(u => u.username === username && u.password === password);
    return user;
};