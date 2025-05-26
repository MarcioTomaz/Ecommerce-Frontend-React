

export const API_URL = 'http://localhost:8080/api';

export const isUserLoggedIn = () => {
    const storedUser = localStorage.getItem('userLogin');
    if (!storedUser) {
        return false;
    }

    try {
        const parsedUser = JSON.parse(storedUser);
        return !!parsedUser.token; // Retorna true se o token existir
    } catch (error) {
        console.error("Erro ao analisar o usuário armazenado:", error);
        return false;
    }
};

export const getUserToken = () => {
    try {
        const storedUser = localStorage.getItem('userLogin');
        if (!storedUser) return null;

        const parsedUser = JSON.parse(storedUser);
        return parsedUser.token || null;
    } catch (error) {
        console.error("Erro ao analisar o usuário armazenado:", error);
        return null;
    }
};
