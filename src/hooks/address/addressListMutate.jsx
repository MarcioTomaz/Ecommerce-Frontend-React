import {useMutation} from "@tanstack/react-query";
import {API_URL} from "../api.jsx";
import axios from "axios";

const postData = async(data) =>{

    // eslint-disable-next-line no-useless-catch
    try {
        const storedUser = localStorage.getItem('userLogin');

        const parsedValue = JSON.parse(storedUser);

        const id = parsedValue.id;
        const response = await axios.get(API_URL + '/address/read/address' + id);
        return response.data;

    }catch(error){
        throw error;
    }
}

export function addressMutate(){
    return useMutation({
        mutationFn: postData
    });
}