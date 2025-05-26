import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../api.jsx";
import axios from "axios";

const postData = async (data) => {
    try {
        const storedUser = localStorage.getItem('userLogin');

        if (!storedUser) {
            throw new Error("Usuário não autenticado.");
        }

        const parsedValue = JSON.parse(storedUser);
        // Acessar o token salvo no usuário
        const token = parsedValue.token;

        if (!token) {
            throw new Error("Token de autenticação não encontrado.");
        }

        // Configura os headers com o token de autenticação
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Realiza a requisição POST incluindo o header de autenticação
        const response = await axios.post(`${API_URL}/address/create`, data, config);
        return response.data;

    } catch (error) {
        throw error;
    }
}

export function addressMutate() {
    return useMutation({
        mutationFn: postData,
    });
}
