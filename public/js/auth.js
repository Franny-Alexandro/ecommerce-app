// auth.js - Manejo de autenticación
import { authenticateUser } from './api.js';

const SESSION_KEY = 'currentUser';

export const login = (username, password) => {
    const user = authenticateUser(username, password);
    if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = () => {
    const user = localStorage.getItem(SESSION_KEY);
    return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
    return getCurrentUser() !== null;
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'admin';
};