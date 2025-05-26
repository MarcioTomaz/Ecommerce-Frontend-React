import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../GlobalConfig/AuthContext.jsx";
import axios from "axios";
import {ROUTES as ROTE, ROUTES} from "../../routes/URLS.jsx";
import {Button, Container, Table, useMantineTheme} from "@mantine/core";
import {API_URL} from "../../hooks/api.jsx";
import {useNavigate} from "react-router-dom";


const OrderClientList = () => {
    const {login, userToken} = useContext(AuthContext);
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate();
    const theme = useMantineTheme();


    useEffect(() => {

        axios.get(`${API_URL}${ROTE.ORDER_LIST}`,
            {headers: {'Authorization': `Bearer ${userToken}`}})
            .then(response => {

                setUserData(response.data.content);
            }).catch(error => {
            console.log(error);
        })
    }, [userToken]);

    const orderDetails= (orderId) =>{
        navigate(ROUTES.ORDER_DETAILS.replace(':id', orderId));
    }



    const rows = userData.map((row) => (
        <Table.Tr key={row.id}  style={{textAlign: "center"}}>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.status}</Table.Td>
            <Table.Td>{row.total}</Table.Td>
            <Table.Td>
                <Button style={{background: theme.colors.blue[9]}}
                        onClick={() => orderDetails(row.id)}>Detalhes</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container>
            <Table min={700}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{width: "20%", textAlign: "center"}}>Id do Pedido</Table.Th>
                        <Table.Th style={{textAlign: "center"}}>Status</Table.Th>
                        <Table.Th style={{textAlign: "center"}}>Total</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <Button style={{background: theme.colors.yellow[9]}} onClick={() => navigate('/profile')} type="button"
                    mt="md">Voltar</Button>
        </Container>
    );

}

export default OrderClientList;