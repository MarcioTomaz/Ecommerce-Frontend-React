import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../api.jsx";


const fetchData = async (id) => {
    const response = await axios.get(API_URL + `/userPerson/read/${id}`);

    return response?.data?.data;
}

// Atualize a função useClient para aceitar um parâmetro id
export function useClient(id) {
    const query = useQuery({
        queryKey: ['client-data', id], // Adicione o id ao queryKey
        queryFn: () => fetchData(id),   // Passe o id para a função fetchData
    });

    return query;
}