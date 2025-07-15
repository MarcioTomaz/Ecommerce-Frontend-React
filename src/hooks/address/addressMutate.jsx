import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {API_URL} from "../api.jsx";


const postAddress = async (data) => {
    const token = localStorage.getItem('userLogin');

    if (!token) {
        throw new Error('Token de autenticação não encontrado.');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(`${API_URL}/address/create`, data, config);
    return response.data;
};

export function useAddressMutate(options = {}) {
    return useMutation({
        mutationFn: postAddress,
        ...options,  // Permite passar onSuccess, onError, etc
    });
}
